import React from 'react';
import LogoutButton from './LogoutButton';

const MenuBar = ({ user }) => {
    return (
        <div className="user-menu">
            <span>Benvenuto, {user?.email || 'Ospite'}</span>
            <LogoutButton />
        </div>
    );
};

export default MenuBar;