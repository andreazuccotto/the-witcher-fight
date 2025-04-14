// filepath: c:\Users\andrea.zuccotto\Progetti\the-witcher-fight\the-witcher-fight-app\src\app\api\auth\password-reset\route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email richiesta' }), { status: 400 });
        }

        console.log("nodemailer.createTransport");

        // Configura il trasportatore di Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // Usa `true` per la porta 465, `false` per la porta 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        // Configura il contenuto dell'email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Mittente
            to: email, // Destinatario
            subject: 'Recupero Password - The Witcher Fight',
            text: 'Clicca sul link per reimpostare la tua password: https://example.com/password-reset',
        };

        console.log("transporter.sendMail");

        // Invia l'email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Email di recupero inviata con successo!' }), { status: 200 });
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        return new Response(JSON.stringify({ error: 'Errore del server' }), { status: 500 });
    }
}