'use client';

import { useState } from 'react';

export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [messaggio, setMessaggio] = useState(null);
    const [success, setSuccess] = useState(null); // Nuovo stato per il risultato
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessaggio(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/auth/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessaggio('Email di recupero inviata con successo!');
                setSuccess(true); // Imposta il successo
            } else {
                setMessaggio(data.error || 'Errore durante il recupero della password');
                setSuccess(false); // Imposta l'errore
            }
        } catch (error) {
            console.error(error);
            setMessaggio('Errore di rete');
            setSuccess(false); // Imposta l'errore
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Recupero Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control border-secondary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    Recupera Password
                </button>
            </form>
            {messaggio && (
                <div className={`alert mt-3 ${success ? 'alert-success' : 'alert-danger'}`}>
                    {messaggio}
                </div>
            )}
        </div>
    );
}