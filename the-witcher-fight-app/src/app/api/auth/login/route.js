// src/app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Configura il pool di connessione a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST(request) {
  let client;

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email e password sono obbligatorie" }, { status: 400 });
    }

    // Connessione al database
    client = await pool.connect();

    // Trova l'utente tramite email
    const queryText = 'SELECT id, email, password_hash, ruolo FROM utente WHERE email = $1';
    const result = await client.query(queryText, [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 400 });
    }

    const utente = result.rows[0];

    // Verifica la password
    const isValid = await bcrypt.compare(password, utente.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 400 });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: utente.id, email: utente.email, ruolo: utente.ruolo },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "Login effettuato con successo", token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}