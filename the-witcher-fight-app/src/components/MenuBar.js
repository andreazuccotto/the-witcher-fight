import React from 'react';
import LogoutButton from './LogoutButton';

const MenuBar = ({ user }) => {
    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <span className="navbar-brand">
                    Benvenuto, {user?.username || 'Ospite'}
                </span>
                <div className="flex-grow-1">
                    <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/dashboard/player">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="/crea-personaggio">Crea Personaggio</a>
                        </li>
                    </ul>
                </div>
                <LogoutButton />
            </div>
        </nav>
    );
};

export default MenuBar;