import { Link, NavLink } from 'react-router-dom';
import React, { useState,useEffect } from "react";
import Container from './Container';
import UserMenu from './UserMenu';
import Clogo from '../assets/Clogo.png';
import styles from './Nav.module.css';
import {jwtDecode} from 'jwt-decode';


function getLinkStyle({ isActive }) {
    return {
        textDecoration: isActive ? 'underline' : '',
    };
}


function Nav({ isLoggedIn, onLogout }) {

    const token = localStorage.getItem('auth-token');
    let decoded;
    if(token) {
        decoded = jwtDecode(token);
    }
    console.log(decoded);
    const [isAdmin,setIsAdmin] = useState(0);

    useEffect(() => {
        if (decoded && decoded.isAdmin === 1) {
            setIsAdmin(1);
        }
        else setIsAdmin(0);
    }, [decoded]);
    return (
        <div className={styles.nav}>
            <Container className={styles.container}>
                <Link to="/">
                    <img src={Clogo} alt="Challengers Logo"/>
                </Link>
                <ul className={styles.menu}>
                    {!isLoggedIn ? (
                        <>
                            <li>
                                <NavLink style={getLinkStyle} to="/challenge">
                                    도전
                                </NavLink>
                            </li>
                            <li>
                                <NavLink style={getLinkStyle} to="/community">
                                    게시판
                                </NavLink>
                            </li>
                            <li>
                                <NavLink style={getLinkStyle} to="/reviewList">
                                    후기보기
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink style={getLinkStyle} to="/challenge">
                                    도전
                                </NavLink>
                            </li>
                            <li>
                                <NavLink style={getLinkStyle} to="/community">
                                    게시판
                                </NavLink>
                            </li>
                            {isAdmin === 1 && (
                                <li>
                                    <NavLink to="/adminpage" style={getLinkStyle}>
                                        관리자페이지
                                    </NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink style={getLinkStyle} to="/mypage">
                                    마이페이지
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li>
                        <UserMenu isLoggedIn={isLoggedIn} onLogout={onLogout}/>
                    </li>
                </ul>
            </Container>
        </div>
    );
}

export default Nav;
