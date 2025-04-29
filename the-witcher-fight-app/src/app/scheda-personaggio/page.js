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
        <div className="container my-5">
            <h1 className="text-center text-uppercase border-bottom pb-2 mb-4">
                {scheda.nome}
            </h1>

            <div className="row">
                {/* Colonna sinistra */}
                <div className="col-md-4">
                    <table className="table table-sm">
                        <tbody>
                            <tr><th>Razza</th><td>{scheda.razza}</td></tr>
                            <tr><th>Professione</th><td>{scheda.professione}</td></tr>
                        </tbody>
                    </table>

                    <h5 className="mt-4">Statistiche</h5>
                    <table className="table table-sm">
                        <tbody>
                            {Object.entries(scheda.statistiche).reduce((rows, [key, val], i, arr) => {
                                if (i % 2 === 0) rows.push([arr[i], arr[i + 1]]);
                                return rows;
                            }, []).map(([s1, s2], idx) => (
                                <tr key={idx}>
                                    <th className="text-uppercase">{s1[0]}</th><td>{s1[1]}</td>
                                    {s2 ? <>
                                        <th className="text-uppercase">{s2[0]}</th><td>{s2[1]}</td>
                                    </> : <><th></th><td></td></>}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h5 className="mt-4">Salute & Resistenza</h5>
                    <table className="table table-sm">
                        <tbody>
                            <tr><th>Salute</th><td>{scheda.salute}</td></tr>
                            <tr><th>Resistenza</th><td>{scheda.resistenza}</td></tr>
                        </tbody>
                    </table>

                    <h5 className="mt-4">Armatura</h5>
                    <table className="table table-sm">
                        <thead>
                            <tr><th>Locazione</th><th>PR</th><th>Danni</th></tr>
                        </thead>
                        <tbody>
                            {scheda.armatura.map((a, i) => (
                                <tr key={i}>
                                    <td>{a.locazione}</td>
                                    <td>{a.pr}</td>
                                    <td>{a.danni}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h5 className="mt-4">Capacità</h5>
                    <ul className="small">
                        {scheda.capacita.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>

                {/* Colonna centrale */}
                <div className="col-md-4">
                    <h5>Equipaggiamento</h5>
                    <table className="table table-sm">
                        <thead>
                            <tr><th>Oggetto</th><th>Quantità</th></tr>
                        </thead>
                        <tbody>
                            {scheda.equipaggiamento.map((e, i) => (
                                <tr key={i}>
                                    <td>{e.oggetto}</td>
                                    <td>{e.quantita}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h5 className="mt-4">Abilità</h5>
                    <div className="row">
                        {scheda.abilita.map((a, i) => (
                            <div className="col-6 small" key={i}>{a.nome}: <strong>{a.valore}</strong></div>
                        ))}
                    </div>

                    <h5 className="mt-4">Abilità Esclusive</h5>
                    <div className="row">
                        {scheda['abilità esclusive'].map((a, i) => (
                            <div className="col-6 small" key={i}>{a.nome}: <strong>{a.valore}</strong></div>
                        ))}
                    </div>
                </div>

                {/* Colonna destra */}
                <div className="col-md-4">
                    <h5>Armi</h5>
                    <table className="table table-sm">
                        <thead>
                            <tr><th>Nome</th><th>PA</th><th>Danno</th><th>Effetti</th></tr>
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

                    <h5 className="mt-4">Magie</h5>
                    <table className="table table-sm small">
                        <thead>
                            <tr>
                                <th>Nome</th><th>RES</th><th>Difesa</th><th>Portata</th><th>Durata</th>
                            </tr>
                        </thead>
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
        </div>

    )
}
