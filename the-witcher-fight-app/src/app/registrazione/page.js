'use client'

import { useState } from 'react'

// Componente overlay per il loader
function OverlayLoader({ loading }) {
  if (!loading) return null
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </div>
    </div>
  )
}

export default function Registrazione() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        body: JSON.stringify({ email, password }),
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
      {/* Overlay loader: si visualizza sopra il contenuto */}
      <OverlayLoader loading={loading} />

      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
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
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          Registrati
        </button>
      </form>
      {messaggio && <div className="alert alert-info mt-3">{messaggio}</div>}
    </div>
  )
}
