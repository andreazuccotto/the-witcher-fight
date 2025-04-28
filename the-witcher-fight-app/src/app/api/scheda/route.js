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
        return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Verifica il JWT
    let payload
    try {
        payload = jwt.verify(tokenCookie.value, JWT_SECRET)
    } catch (err) {
        return NextResponse.json({ error: 'Token non valido o scaduto' }, { status: 401 })
    }

    // Query per recuperare il campo `dati` dal record della scheda del giocatore
    const result = await pool.query(
        'SELECT dati FROM scheda WHERE id_utente = $1',
        [payload.id]
    )
    if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Scheda non trovata' }, { status: 404 })
    }

    // Restituisci direttamente il JSON memorizzato in `dati`
    return NextResponse.json(result.rows[0].dati)
}
