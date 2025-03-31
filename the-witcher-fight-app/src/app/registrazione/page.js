'use client'

import { useState } from 'react'

export default function Registrazione() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [messaggio, setMessaggio] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessaggio(null)

    const res = await fetch('/api/auth/registrazione', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessaggio('Registrazione avvenuta con successo!')
    } else {
      setMessaggio(data.error || 'Errore')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" className="form-control"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" id="password" className="form-control"
            value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary">Registrati</button>
      </form>

      {messaggio && <div className="alert alert-info mt-3">{messaggio}</div>}
    </div>
  )
}
