'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState(null)
  const [messaggio, setMessaggio] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Recupera la lista degli utenti (username + email) al caricamento della pagina
    let mounted = true
    const fetchUsers = async () => {
      setUsersLoading(true)
      try {
        const res = await fetch('/api/auth/users')
        if (!res.ok) {
          console.error('Errore nel recupero degli utenti', res.status)
          setUsers([])
          setUsersError('Impossibile caricare la lista utenti')
        } else {
          const data = await res.json()
          if (mounted) {
            // L'API ritorna un array di username (stringhe)
            setUsers(data.users || [])
            // Se disponibile, imposta il primo username selezionato
            if ((data.users || []).length > 0) {
              setUsername((data.users || [])[0])
            }
          }
        }
      } catch (err) {
        console.error('Errore fetch users', err)
        setUsers([])
        setUsersError('Errore di rete durante il caricamento utenti')
      } finally {
        if (mounted) setUsersLoading(false)
      }
    }

    fetchUsers()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessaggio(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (res.ok) {
        router.push(data.redirectUrl)
      } else {
        // Messaggi più chiari per l'utente
        if (data && data.error) setMessaggio(data.error)
        else setMessaggio('Credenziali non valide o errore durante il login')
      }
    } catch (error) {
      console.error(error)
      setMessaggio('Errore di rete: impossibile contattare il server')
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
          <label htmlFor="username" className="form-label">Utente</label>
          {usersLoading ? (
            <div>Caricamento utenti...</div>
          ) : usersError ? (
            <div className="text-danger">{usersError}</div>
          ) : users && users.length === 0 ? (
            <div className="text-muted">Nessun utente trovato.</div>
          ) : (
            <select
              id="username"
              className="form-select"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
              required
            >
              <option value="" disabled>Seleziona un utente</option>
              {users.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
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
          disabled={loading || usersLoading || (users && users.length === 0)}
        >
          {loading ? 'Caricamento...' : 'Login'}
        </button>
      </form>

      {messaggio && <div className="alert alert-danger mt-3">{messaggio}</div>}
    </div>
  )
}
