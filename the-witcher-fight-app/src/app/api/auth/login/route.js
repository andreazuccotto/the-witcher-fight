import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Configura il pool di connessione al database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Usa una variabile d'ambiente per il segreto JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatorie' },
        { status: 400 }
      );
    }

    // Query per trovare l'utente nella tabella "utente"
    const query = 'SELECT * FROM utente WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 400 }
      );
    }
    const user = result.rows[0];

    // Confronta la password inserita con quella memorizzata (colonna "password_hash")
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 400 }
      );
    }

    // Crea un token JWT con i dati dell'utente
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        ruolo: user.ruolo, // ad esempio "master" o "giocatore"
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Determina il redirect URL in base al ruolo
    const redirectUrl = user.ruolo === 'master' ? '/dashboard/master' : '/dashboard/player';

    console.log('Token:', token);
    console.log('Redirect URL:', redirectUrl);

    // Prepara la risposta in JSON
    const response = NextResponse.json({
      message: 'Login effettuato con successo',
      redirectUrl,
      ruolo: user.ruolo,
    });

    // Imposta il cookie httpOnly contenente il token
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false, // Disabilita secure in sviluppo
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}