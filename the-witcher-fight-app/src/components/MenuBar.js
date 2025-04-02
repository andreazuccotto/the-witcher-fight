import React from 'react';
import LogoutButton from './LogoutButton';

const MenuBar = ({ user }) => {
    return (
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <span>Benvenuto, {user?.username || 'Ospite'}</span>
                <LogoutButton />
            </div>
        </nav>
    );
};

export default MenuBar;