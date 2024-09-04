import React from 'react';
import NavLink from './NavLink';

export default function Header() {
    return (
        <nav>
            <NavLink href="/" active={route().current('dashboard')}>
                Home
            </NavLink>
            <NavLink href="/dashboard" active={route().current('dashboard')}>
                Dashboard
            </NavLink>
            <NavLink href="/profile" active={route().current('profile.edit')}>
                Profile
            </NavLink>
            {/* Verifique se o link para DTF está realmente incluído aqui */}
            <NavLink href="/dtf" active={route().current('dtf')}>
                DTF
            </NavLink>
        </nav>
    );
}
