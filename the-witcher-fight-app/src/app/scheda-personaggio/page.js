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
            let tokenData = null
            try {
                const res = await fetch('/api/auth/token')
                if (!res.ok) throw new Error('Token non trovato')
                // dichiariamo tokenData fuori dal blocco try per poterlo riusare dopo
                tokenData = await res.json()
                setUser(tokenData.user)
            } catch (err) {
                console.error(err.message)
                router.push('/login')
                return
            }
            // se l'utente è recuperato, carica la scheda
            try {
                // Passiamo esplicitamente user.id al backend per sicurezza
                const userIdParam = encodeURIComponent(tokenData.user?.id)
                const res2 = await fetch(`/api/scheda?userId=${userIdParam}`, { credentials: 'include' })
                if (!res2.ok) throw new Error((await res2.json()).error || 'Errore caricamento scheda')
                const schedaData = await res2.json()
                // API ora risponde { scheda: ... } o { scheda: null, message: ... }
                setScheda(schedaData.scheda ?? schedaData)
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
    // Costruisci oggetto statistiche se non presente (usa i campi presenti nella tabella)
    const statsFields = [
        'intelligenza', 'riflessi', 'destrezza', 'fisico', 'velocita', 'empatia', 'manualita', 'volonta', 'fortuna',
        'grinta', 'coraggio', 'balistica', 'resistenza', 'ingegno', 'recupero', 'punti_salute', 'vigore'
    ]

    const statistics = scheda.statistiche || statsFields.reduce((acc, k) => {
        if (scheda[k] !== undefined && scheda[k] !== null) acc[k] = scheda[k]
        return acc
    }, {})

    // Abilità: può essere un array di oggetti o un oggetto mappato (jsonb)
    const abilitaList = (() => {
        if (!scheda.abilita) return []
        if (Array.isArray(scheda.abilita)) return scheda.abilita
        // se è oggetto mappato converti in array di { nome, valore }
        if (typeof scheda.abilita === 'object') return Object.entries(scheda.abilita).map(([n, v]) => ({ nome: n, valore: v }))
        return []
    })()

    // Abilità esclusive similmente
    const abilitaEsclusive = (() => {
        const key = scheda['abilità esclusive'] || scheda.abilita_esclusive || scheda.abilitaEsclusive || scheda.abilita_esclusive
        if (!key) return []
        if (Array.isArray(key)) return key
        if (typeof key === 'object') return Object.entries(key).map(([n, v]) => ({ nome: n, valore: v }))
        return []
    })()

    // Magie: può essere array di stringhe o array di oggetti
    const magieList = scheda.magie || []

    return (
        <div className="container my-5">
            <MenuBar user={user} />
            <h1 className="text-center text-uppercase border-bottom pb-2 mb-4">
                {scheda.nome}
            </h1>

            <div className="row">
                <div className="col-12">
                    <h5>Dati base</h5>
                    <table className="table table-sm">
                        <tbody>
                            <tr><th>Nome</th><td>{scheda.nome}</td></tr>
                            <tr><th>Sesso</th><td>{scheda.sesso}</td></tr>
                            <tr><th>Razza</th><td>{scheda.razza}</td></tr>
                            <tr><th>Professione</th><td>{scheda.professione}</td></tr>
                            <tr><th>Punti Salute</th><td>{scheda.punti_salute ?? scheda.salute ?? ''}</td></tr>
                            <tr><th>Resistenza</th><td>{scheda.resistenza}</td></tr>
                            <tr><th>Vigore</th><td>{scheda.vigore}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="col-md-6">
                    <h5>Statistiche</h5>
                    <table className="table table-sm">
                        <tbody>
                            {Object.entries(statistics).length === 0 ? (
                                <tr><td className="text-muted">Nessuna statistica disponibile</td></tr>
                            ) : (
                                Object.entries(statistics).reduce((rows, [key, val], i, arr) => {
                                    if (i % 2 === 0) rows.push([arr[i], arr[i + 1]]);
                                    return rows;
                                }, []).map(([s1, s2], idx) => (
                                    <tr key={idx}>
                                        <th className="text-uppercase">{s1[0]}</th><td>{s1[1]}</td>
                                        {s2 ? <>
                                            <th className="text-uppercase">{s2[0]}</th><td>{s2[1]}</td>
                                        </> : <><th></th><td></td></>}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <h5 className="mt-4">Abilità</h5>
                    {abilitaList.length === 0 ? (
                        <div className="text-muted">Nessuna abilità</div>
                    ) : (
                        <table className="table table-sm">
                            <thead>
                                <tr><th>Abilità</th><th>Valore</th></tr>
                            </thead>
                            <tbody>
                                {abilitaList.map((a, i) => (
                                    <tr key={i}><td>{a.nome}</td><td>{a.valore}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <h5 className="mt-4">Abilità Esclusive</h5>
                    {abilitaEsclusive.length === 0 ? (
                        <div className="text-muted">Nessuna abilità esclusiva</div>
                    ) : (
                        <table className="table table-sm">
                            <thead>
                                <tr><th>Abilità</th><th>Valore</th></tr>
                            </thead>
                            <tbody>
                                {abilitaEsclusive.map((a, i) => (
                                    <tr key={i}><td>{a.nome}</td><td>{a.valore}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="col-md-6">
                    <h5>Equipaggiamento</h5>
                    {Array.isArray(scheda.equipaggiamento) && scheda.equipaggiamento.length > 0 ? (
                        <table className="table table-sm">
                            <thead>
                                <tr><th>Oggetto</th><th>Quantità</th></tr>
                            </thead>
                            <tbody>
                                {scheda.equipaggiamento.map((e, i) => (
                                    <tr key={i}><td>{e.oggetto}</td><td>{e.quantita}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-muted">Nessun equipaggiamento registrato</div>
                    )}

                    <h5 className="mt-4">Armi / Combattimento</h5>
                    {Array.isArray(scheda.combattimento) && scheda.combattimento.length > 0 ? (
                        <table className="table table-sm">
                            <thead>
                                <tr><th>Nome</th><th>PA</th><th>Danno</th><th>Effetti</th></tr>
                            </thead>
                            <tbody>
                                {scheda.combattimento.map((c, i) => (
                                    <tr key={i}><td>{c.nome}</td><td>{c.PA}</td><td>{c.danno}</td><td>{c.effetti}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-muted">Nessuna arma registrata</div>
                    )}

                    <h5 className="mt-4">Magie</h5>
                    {magieList.length === 0 ? (
                        <div className="text-muted">Nessuna magia</div>
                    ) : (
                        // gestiamo sia array di stringhe che array di oggetti
                        <table className="table table-sm small">
                            <thead>
                                <tr><th>Nome</th><th>Dettagli</th></tr>
                            </thead>
                            <tbody>
                                {magieList.map((m, i) => (
                                    <tr key={i}>
                                        <td>{typeof m === 'string' ? m : m.nome}</td>
                                        <td>{typeof m === 'string' ? '-' : JSON.stringify(m)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>

                <div className="col-12 mt-4">
                    <h5>Altri campi (raw)</h5>
                    <pre className="small bg-light p-2" style={{ overflowX: 'auto' }}>{JSON.stringify(scheda, null, 2)}</pre>
                </div>
            </div>
        </div>
    )
}
