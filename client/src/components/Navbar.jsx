import React from "react";
import { Link, useLocation } from "react-router-dom";

import * as S from "../styles/styled-components/styled.main";

/**
 * React Component which displays a sticky nav button in the top right
 * to navigate to the other page in the app.
 * - Our App essentially has two primary pages: homepage and listings.
 * - Therefore, we only need one button to navigate to the other page.
 *
 * @return {Component} navbar for simple website navigation
 */
const Navbar = () => {
    /**
     * React Router useLocation Hook to get the current url.
     *
     * Implementation from: https://stackoverflow.com/a/60736742
     * and official documentation from: https://reactrouter.com/web/api/Hooks/uselocation
     */
    const location = useLocation();
    /** Get the current url to render the navbar dynamically */
    const url = location.pathname;

    return (
        <S.Navbar>
            <ul>
                {url === "/" ? (
                    <li>
                        <Link to="/list">
                            <S.NavButton>Listings</S.NavButton>
                        </Link>
                    </li>
                ) : (
                    <li>
                        <Link to="/">
                            <S.NavButton>Home</S.NavButton>
                        </Link>
                    </li>
                )}
            </ul>
        </S.Navbar>
    );
};

export default Navbar;
