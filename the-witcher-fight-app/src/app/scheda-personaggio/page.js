'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MenuBar from '@/components/MenuBar'

export default function ViewScheda() {
    const [user, setUser] = useState(null)
    const [scheda, setScheda] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/token')
                if (!res.ok) throw new Error('Token non trovato')
                const data = await res.json()
                setUser(data.user)
            } catch (err) {
                console.error(err.message)
                router.push('/login')
                return
            }
            // se l'utente è recuperato, carica la scheda
            try {
                const res2 = await fetch('/api/scheda', { credentials: 'include' })
                if (!res2.ok) throw new Error((await res2.json()).error || 'Errore caricamento scheda')
                setScheda(await res2.json())
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    if (loading) return <div className="container mt-5">Caricamento in corso…</div>
    if (error) return <div className="container mt-5 text-danger">Errore: {error}</div>

    return (
        <div className="container mt-5">
            <MenuBar user={user} />
            <div className="container mt-5">
                <h1>{scheda.nome}</h1>
                <p>
                    <strong>Sesso:</strong> {scheda.sesso} &nbsp;
                    <strong>Razza:</strong> {scheda.razza} &nbsp;
                    <strong>Professione:</strong> {scheda.professione}
                </p>

                {/* Statistiche */}
                <h2>Statistiche</h2>
                <div className="row row-cols-2 row-cols-md-5 g-3">
                    {Object.entries(scheda.statistiche).map(([key, value]) => (
                        <div className="col" key={key}>
                            <div className="card p-2 text-center">
                                <div className="card-title text-capitalize">{key}</div>
                                <div className="card-text fs-4">{value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Abilità */}
                <h2 className="mt-4">Abilità</h2>
                <div className="row">
                    {scheda.abilita.map((a, i) => (
                        <div className="col-6 col-md-4 mb-2" key={i}>
                            {a.nome}: {a.valore}
                        </div>
                    ))}
                </div>

                {/* Abilità esclusive */}
                <h2 className="mt-4">Abilità Esclusive</h2>
                <div className="row">
                    {scheda['abilità esclusive'].map((a, i) => (
                        <div className="col-6 col-md-4 mb-2" key={i}>
                            {a.nome}: {a.valore}
                        </div>
                    ))}
                </div>

                {/* Armatura */}
                <h2 className="mt-4">Armatura</h2>
                <table className="table">
                    <thead>
                        <tr><th>Locazione</th><th>PR</th><th>Danni</th></tr>
                    </thead>
                    <tbody>
                        {scheda.armatura.map((ar, i) => (
                            <tr key={i}>
                                <td>{ar.locazione}</td>
                                <td>{ar.pr}</td>
                                <td>{ar.danni}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Combattimento */}
                <h2 className="mt-4">Combattimento</h2>
                <table className="table">
                    <thead>
                        <tr><th>Arma</th><th>PA</th><th>Danno</th><th>Effetti</th></tr>
                    </thead>
                    <tbody>
                        {scheda.combattimento.map((c, i) => (
                            <tr key={i}>
                                <td>{c.nome}</td>
                                <td>{c.PA}</td>
                                <td>{c.danno}</td>
                                <td>{c.effetti}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Capacità */}
                <h2 className="mt-4">Capacità</h2>
                <ul>
                    {scheda.capacita.map((cap, i) => <li key={i}>{cap}</li>)}
                </ul>

                {/* Equipaggiamento */}
                <h2 className="mt-4">Equipaggiamento</h2>
                <table className="table">
                    <thead><tr><th>Oggetto</th><th>Quantità</th></tr></thead>
                    <tbody>
                        {scheda.equipaggiamento.map((e, i) => (
                            <tr key={i}>
                                <td>{e.oggetto}</td>
                                <td>{e.quantita}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Magie */}
                <h2 className="mt-4">Magie</h2>
                <table className="table">
                    <thead><tr><th>Nome</th><th>Costo RES</th><th>Difesa</th><th>Portata</th><th>Durata</th></tr></thead>
                    <tbody>
                        {scheda.magie.map((m, i) => (
                            <tr key={i}>
                                <td>{m.nome}</td>
                                <td>{m['costo in RES']}</td>
                                <td>{m.difesa}</td>
                                <td>{m.portata}</td>
                                <td>{m.durata}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
