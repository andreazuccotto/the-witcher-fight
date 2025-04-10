'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader'; // Importa il componente Loader

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messaggio, setMessaggio] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessaggio(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Redirecting to:', data.redirectUrl);
        router.push(data.redirectUrl);
      } else {
        setMessaggio(data.error || 'Errore durante il login');
      }
    } catch (error) {
      console.error(error);
      setMessaggio('Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {/* Usa il componente Loader */}
      <Loader loading={loading} />

      <h2>Login</h2>
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
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control border-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Login
        </button>
        <a href="/registrazione" className="btn btn-secondary mx-2">Registrati</a>
        <a href="/password-reset" className="btn btn-link">Password dimenticata?</a>
      </form>
      {messaggio && <div className="alert alert-danger mt-3">{messaggio}</div>}
    </div>
  );
}