import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export async function GET() {
    try {
        // cookies() deve essere awaited prima di usare il suo valore
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Token non trovato' }, { status: 401 });
        }

        // Verifica il token lato server
        const decodedUser = jwt.verify(token, JWT_SECRET);

        return NextResponse.json({ user: decodedUser });
    } catch (error) {
        console.error('Errore nel recupero del token:', error);
        return NextResponse.json({ error: 'Token non valido' }, { status: 401 });
    }
}