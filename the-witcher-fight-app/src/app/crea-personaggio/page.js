'use client'

import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import MenuBar from '@/components/MenuBar';

export default function CreateCharacter() {
  const [formData, setFormData] = useState({
    nome: '',
    razza: '',
    professione: '',
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
            <select
              id="razza"
              name="razza"
              className="form-select"
              value={formData.razza}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              <option value="witcher">Witcher</option>
              <option value="elfo">Elfo</option>
              <option value="nano">Nano</option>
              <option value="umano">Umano</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="professione" className="form-label">Professione</label>
            <select
              id="professione"
              name="professione"
              className="form-select"
              value={formData.professione}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              <option value="armigero">Armigero</option>
              <option value="artigiano">Artigiano</option>
              <option value="bardo">Bardo</option>
              <option value="criminale">Criminale</option>
              <option value="mago">Mago</option>
              <option value="criminale">Medico</option>
              <option value="mercante">Mercante</option>
              <option value="prete">Prete</option>
              <option value="witcher">Witcher</option>
            </select>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="int" className="form-label">Intelligenza</label>
              <input
                type="number"
                id="int"
                name="int"
                className="form-control"
                value={formData.int}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="rif" className="form-label">Riflessi</label>
              <input
                type="number"
                id="rif"
                name="rif"
                className="form-control"
                value={formData.rif}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="des" className="form-label">Destrezza</label>
              <input
                type="number"
                id="des"
                name="des"
                className="form-control"
                value={formData.des}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="fis" className="form-label">Fisico</label>
              <input
                type="number"
                id="fis"
                name="fis"
                className="form-control"
                value={formData.fis}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="vel" className="form-label">Velocità</label>
              <input
                type="number"
                id="vel"
                name="vel"
                className="form-control"
                value={formData.vel}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="emp" className="form-label">Empatia</label>
              <input
                type="number"
                id="emp"
                name="emp"
                className="form-control"
                value={formData.emp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="man" className="form-label">Manualità</label>
              <input
                type="number"
                id="man"
                name="man"
                className="form-control"
                value={formData.man}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="vol" className="form-label">Volontà</label>
              <input
                type="number"
                id="vol"
                name="vol"
                className="form-control"
                value={formData.vol}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="for" className="form-label">Fortuna</label>
              <input
                type="number"
                id="for"
                name="for"
                className="form-control"
                value={formData.for}
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