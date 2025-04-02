'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'; // Elimina il cookie
    router.push('/login'); // Reindirizza alla pagina di login
  };

  return (
    <button onClick={handleLogout} class="btn btn-secondary">
      Logout
    </button>
  );
}