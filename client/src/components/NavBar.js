import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite'; 
import { Context } from '../index';
import { GAZPROM_ROUTE, PROFILE_ROUTE, AGREEMENT_ROUTE, ADMIN_ROUTE } from '../utils/consts'; 
import '../styles/NavBar.css';

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const navigate = useNavigate();

    const isAuth = user.isAuth;
    const role = user.user?.role?.toUpperCase() || '';
    const fullName = isAuth ? `${user.user.first_name || ''} ${user.user.last_name || ''}`.trim() : '';

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setIsMenuVisible(!isMenuVisible);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setIsMenuVisible(false);
    };

    const handleLogout = () => {
      user.setIsAuth(false);
      user.setUser({});
      localStorage.removeItem('token'); 
      closeMenu();
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && menuOpen) {
                closeMenu();
            }
            if (e.key === 'Tab' && !menuOpen) {
                e.preventDefault();
                setMenuOpen(true);
                setIsMenuVisible(true);
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'q') {
                e.preventDefault();
                closeMenu();
                navigate(GAZPROM_ROUTE);
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'й') {
                e.preventDefault();
                closeMenu();
                navigate(GAZPROM_ROUTE);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuOpen, navigate]);

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-content">
                    <button className="hamburger" onClick={toggleMenu} title={menuOpen ? 'Закрыть меню' : 'Меню'}>
                        {menuOpen ? '✖' : '☰'}
                    </button>
                    <div className="logo-text">
                        <NavLink to={GAZPROM_ROUTE} className="logo">
                            GazUsluga
                        </NavLink>
                    </div>
                </div>
            </nav>
            <div className={`sidebar-menu ${isMenuVisible ? 'visible' : ''}`}>
                <div className="menu-header-line"></div>
                {isAuth && (
                    <div className="user-info">
                        <p>{fullName}</p> 
                    </div>
                )}
                {isAuth ? (
                    <>
                        <NavLink to={PROFILE_ROUTE} className="menu-link" onClick={toggleMenu}>Профиль</NavLink>

                        {role === 'ADMIN' ? (
                            <>
                                <NavLink to={AGREEMENT_ROUTE} className="menu-link" onClick={toggleMenu}>Управление договорами</NavLink>
                                <NavLink to={ADMIN_ROUTE} className="menu-link" onClick={toggleMenu}>Список пользователей</NavLink>
                            </>
                        ) : (
                            <NavLink to={AGREEMENT_ROUTE} className="menu-link" onClick={toggleMenu}>Мои договоры</NavLink>
                        )}

                        <button className="menu-button" onClick={handleLogout}>Выйти из системы</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="menu-link" onClick={toggleMenu}>Войти</NavLink>
                        <NavLink to="/registration" className="menu-link" onClick={toggleMenu}>Регистрация</NavLink>
                    </>
                )}
            </div>
        </div>
    );
});
export default NavBar;