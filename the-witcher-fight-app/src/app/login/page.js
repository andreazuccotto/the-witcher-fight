'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [messaggio, setMessaggio] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessaggio(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (res.ok) {
        router.push(data.redirectUrl)
      } else {
        setMessaggio(data.error || 'Errore durante il login')
      }
    } catch (error) {
      console.error(error)
      setMessaggio('Errore di rete')
    } finally {
      // piccola pausa per far apparire il loader
      setTimeout(() => setLoading(false), 200)
    }
  }

  return (
    <div className="container mt-5">
      {/* Componente Loader */}
      <Loader loading={loading} />

      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={loading ? 'opacity-50' : ''}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Caricamento...' : 'Login'}
        </button>
      </form>

      {messaggio && <div className="alert alert-danger mt-3">{messaggio}</div>}
    </div>
  )
}
