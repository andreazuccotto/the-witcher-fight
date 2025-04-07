'use client'

import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import MenuBar from '@/components/MenuBar';

export default function CreateCharacter() {
  const [formData, setFormData] = useState({
    nome: '',
    razza: '',
    classe: '',
    forza: '',
    destrezza: '',
    intelligenza: '',
    vitalita: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/token');
        if (!res.ok) {
          throw new Error('Token non trovato');
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error(error.message);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/character/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Scheda creata con successo!');
      } else {
        setMessage(data.error || 'Errore durante la creazione della scheda');
      }
    } catch (error) {
      console.error(error);
      setMessage('Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <MenuBar user={user} />
      <div className="container mt-5">
        <h1>Crea la tua Scheda Personaggio - The Witcher</h1>
        <p>Compila i campi seguenti per creare la tua scheda personaggio.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome Personaggio</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="form-control"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="razza" className="form-label">Razza</label>
            <input
              type="text"
              id="razza"
              name="razza"
              className="form-control"
              value={formData.razza}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="classe" className="form-label">Classe</label>
            <input
              type="text"
              id="classe"
              name="classe"
              className="form-control"
              value={formData.classe}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="forza" className="form-label">Forza</label>
              <input
                type="number"
                id="forza"
                name="forza"
                className="form-control"
                value={formData.forza}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="destrezza" className="form-label">Destrezza</label>
              <input
                type="number"
                id="destrezza"
                name="destrezza"
                className="form-control"
                value={formData.destrezza}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="intelligenza" className="form-label">Intelligenza</label>
              <input
                type="number"
                id="intelligenza"
                name="intelligenza"
                className="form-control"
                value={formData.intelligenza}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="vitalita" className="form-label">Vitalità</label>
              <input
                type="number"
                id="vitalita"
                name="vitalita"
                className="form-control"
                value={formData.vitalita}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creazione in corso...' : 'Crea Scheda'}
            </button>
          </div>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
}