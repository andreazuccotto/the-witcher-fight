"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader'; // Importa il componente Loader

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNavigation = (path) => {
    setLoading(true); // Mostra il loader
    router.push(path); // Naviga alla pagina
  };

  return (
    <div className="container mt-4">
      {loading && <Loader />} {/* Mostra il componente Loader */}
      <h1 className="text-center">Benvenuto in The Witcher Fight App</h1>
      <div className="text-center mt-4">
        <button
          onClick={() => handleNavigation('/login')}
          className="btn btn-primary mx-2"
          disabled={loading} // Disabilita il bottone durante il caricamento
        >
          Login
        </button>
        <button
          onClick={() => handleNavigation('/registrazione')}
          className="btn btn-secondary mx-2"
          disabled={loading} // Disabilita il bottone durante il caricamento
        >
          Registrati
        </button>
      </div>
    </div>
  );
}