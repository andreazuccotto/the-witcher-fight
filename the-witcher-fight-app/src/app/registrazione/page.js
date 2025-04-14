'use client'

import { useState } from 'react'
import Loader from '@/components/Loader' // Importa il componente Loader

export default function Registrazione() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('') // Aggiungi lo stato per username
  const [messaggio, setMessaggio] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessaggio(null)

    try {
      const res = await fetch('/api/auth/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }), // Includi username nel payload
      })
      const data = await res.json()
      if (res.ok) {
        setMessaggio('Registrazione avvenuta con successo!')
      } else {
        setMessaggio(data.error || 'Errore durante la registrazione')
      }
    } catch (error) {
      setMessaggio('Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      {/* Usa il componente Loader */}
      <Loader loading={loading} />

      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control border-secondary"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Gestisci il cambiamento di username
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
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
          <label htmlFor="password" className="form-label">
            Password
          </label>
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
          Registrati
        </button>
        <a href="/login" className="btn btn-link">Login</a>
      </form>
      {messaggio && <div className="alert alert-info mt-3">{messaggio}</div>}
    </div>
  )
}