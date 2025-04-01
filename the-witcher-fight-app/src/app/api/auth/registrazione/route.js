// src/app/api/auth/registrazione/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email e password sono obbligatorie" }, { status: 400 });
    }

    // Verifica se l'utente esiste già
    const existingUser = await prisma.utente.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Utente già registrato" }, { status: 400 });
    }

    // Crea hash della password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crea l'utente con ruolo "giocatore" (di default)
    const utente = await prisma.utente.create({
      data: {
        email,
        passwordHash,
        ruolo: 'giocatore'
      }
    });

    return NextResponse.json({ message: "Registrazione avvenuta con successo", utente });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
