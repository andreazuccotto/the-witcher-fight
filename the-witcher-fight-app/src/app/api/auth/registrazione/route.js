// src/app/api/auth/registrazione/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

// Configura il pool di connessione a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Username, email e password sono obbligatori" }, { status: 400 });
    }

    // Verifica se l'utente esiste già
    const existingUserQuery = 'SELECT * FROM utente WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json({ error: "Utente già registrato" }, { status: 400 });
    }

    // Crea hash della password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crea l'utente con ruolo "giocatore" (di default)
    const createUserQuery = `
      INSERT INTO utente (email, password_hash, ruolo, username)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const createUserResult = await pool.query(createUserQuery, [email, password_hash, 'giocatore', username]);

    const utente = createUserResult.rows[0];

    return NextResponse.json({ message: "Registrazione avvenuta con successo", utente });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}