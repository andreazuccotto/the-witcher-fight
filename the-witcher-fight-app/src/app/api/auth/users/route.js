import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configura il pool di connessione al database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        // Seleziona solo il campo username dalla tabella utente
        const query = 'SELECT username FROM utente ORDER BY username';
        const result = await pool.query(query);

        // Ritorniamo un array di stringhe (username)
        const users = result.rows.map((r) => r.username);

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Errore GET /api/auth/users', error);
        return NextResponse.json({ error: 'Errore nel recupero degli utenti' }, { status: 500 });
    }
}
