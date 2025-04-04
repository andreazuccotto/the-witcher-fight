import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import MenuBar from '@/components/MenuBar';

export default async function PlayerDashboard() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  if (!tokenCookie) {
    redirect('/login');
  }
  const token = tokenCookie.value;

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    redirect('/login');
  }

  if (user.ruolo !== 'giocatore') {
    redirect('/dashboard/master');
  }

  return (
    <div className="container mt-5">
      {/* Barra menu utente */}
      <MenuBar user={user} />
      <div className="container mt-5">
        <h1>Dashboard Giocatore</h1>
        <p>Ciao {user.username}, qui puoi vedere le schede del tuo personaggio.</p>
        {/* Inserisci qui il codice per mostrare le schede del personaggio */}
      </div>
    </div>
  );
}
