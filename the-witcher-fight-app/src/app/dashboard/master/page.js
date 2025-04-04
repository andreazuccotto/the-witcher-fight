import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import MenuBar from '@/components/MenuBar';

export default async function MasterDashboard() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  console.log('Token cookie in dashboard:', tokenCookie);
  if (!tokenCookie) {
    redirect('/login');
  }
  const token = tokenCookie.value;

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    redirect('/login');
  }

  if (user.ruolo !== 'master') {
    redirect('/dashboard/player');
  }

  return (
    <div className="container mt-5">
      {/* Barra menu utente */}
      <MenuBar user={user} />
      <div className="container mt-5">
        <h1>Dashboard Master</h1>
        <p>Ciao {user.username}, qui puoi vedere le schede di tutti i giocatori.</p>
        {/* Inserisci qui il codice per mostrare le schede di tutti i giocatori */}
      </div>
    </div>
  );
}