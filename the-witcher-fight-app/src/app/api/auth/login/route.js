// src/app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email e password sono obbligatorie" }, { status: 400 });
    }

    // Trova l'utente tramite email
    const utente = await prisma.utente.findUnique({ where: { email } });
    if (!utente) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 400 });
    }

    // Verifica la password
    const isValid = await bcrypt.compare(password, utente.passwordHash);
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
  }
}
