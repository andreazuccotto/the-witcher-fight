import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret'

export async function GET(request) {
    // Leggi il cookie di autenticazione
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('token')
    if (!tokenCookie) {
        // Non abbiamo cookie; continueremo comunque perché potremmo ricevere userId via query
        // return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Verifica il JWT (solo se presente il cookie)
    let payload = null
    if (tokenCookie) {
        try {
            payload = jwt.verify(tokenCookie.value, JWT_SECRET)
        } catch (err) {
            console.debug('Token presente ma non valido:', err.message)
            // Non interrompiamo qui: potremmo comunque avere explicitUserId
            payload = null
        }
    } else {
        console.debug('Nessun cookie token presente')
    }

    // Consentiamo l'override esplicito via query param ?userId=... (utile lato client)
    let explicitUserId = null
    try {
        const url = new URL(request.url)
        explicitUserId = url.searchParams.get('userId')
    } catch (e) {
        explicitUserId = null
    }

    // Estraggo l'ID utente dal payload: supportiamo sia `payload.id` sia `payload.user.id` per compatibilità
    const tokenUserId = payload?.id ?? payload?.user?.id ?? payload?.userId
    const userId = explicitUserId ?? tokenUserId
    if (!userId) {
        return NextResponse.json({ error: 'Impossibile determinare user id (né query né token)' }, { status: 401 })
    }

    // Query per recuperare il campo `dati` dal record della scheda del giocatore
    let result
    try {
        result = await pool.query('SELECT * FROM scheda_personaggio WHERE utente_id = $1', [userId])
    } catch (dbErr) {
        console.error('DB error fetching scheda for userId=', userId, dbErr)
        return NextResponse.json({ error: 'Errore interno DB' }, { status: 500 })
    }

    if (!result.rows || result.rows.length === 0) {
        console.debug('Nessuna scheda trovata per userId=', userId)
        return NextResponse.json({ error: 'Scheda non trovata' }, { status: 404 })
    }
    // Recupera i dati della scheda. In alcune righe i dati sono nella colonna `dati`,
    // in altri progetti (come il tuo) i campi della scheda sono direttamente nella row.
    // Quindi prendiamo prima `dati` se presente, altrimenti usiamo l'intera row.
    const dati = result.rows[0]
    if (dati === undefined || dati === null) {
        console.debug('Scheda trovata ma senza dati for userId=', userId, 'row=', result.rows[0])
        // Restituiamo 200 con body esplicito invece di 204 (evitiamo body vuoto che rompe JSON.parse client-side)
        return NextResponse.json({ message: 'Scheda trovata ma senza dati', scheda: null }, { status: 200 })
    }

    // NextResponse.json può fallire se nei dati sono presenti valori non serializzabili (bigint, Date, Buffer).
    // Usiamo una stringify sicura e ritorniamo una Response con Content-Type JSON.
    const safeStringify = (obj) => JSON.stringify(obj === undefined ? null : obj, (_k, v) => {
        if (typeof v === 'bigint') return v.toString();
        if (v instanceof Date) return v.toISOString();
        // gestisci Buffer (Node) -> base64
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(v)) return v.toString('base64');
        return v;
    });

    // Primo tentativo: restituiamo direttamente come JSON (come fa /api/auth/users)
    try {
        console.debug('Returning scheda for userId=', userId, 'via NextResponse.json')
        return NextResponse.json({ scheda: dati })
    } catch (err) {
        // Se NextResponse.json fallisce per tipi non serializzabili, usiamo il fallback sicuro
        console.error('NextResponse.json failed, falling back to safe stringify', err)
        const payloadObj = { scheda: dati }
        const responseBody = safeStringify(payloadObj)
        try {
            const parsed = JSON.parse(responseBody)
            return NextResponse.json(parsed)
        } catch (parseErr) {
            console.error('Failed to parse safe-stringified payload, returning raw string', parseErr)
            return new NextResponse(responseBody, {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }
}
