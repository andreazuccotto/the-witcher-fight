import React from 'react';

export default function Home() {
    return (
      <div className="container mt-4">
        <h1 className="text-center">Benvenuto in The Witcher Fight App</h1>
        <div className="text-center mt-4">
          <a href="/login" className="btn btn-primary mx-2">Login</a>
          <a href="/register" className="btn btn-secondary mx-2">Registrati</a>
        </div>
      </div>
    )
}