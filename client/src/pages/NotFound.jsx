import React from "react";
import { Link } from "react-router-dom";

import * as S from "../styles/styled-components/styled.main";

/**
 * Simple not found page to display when the url does not match
 * any listed as a React Router url.
 *
 * @return {Component} the not found page
 */
const NotFound = () => (
    <S.MainPageBody>
        <S.CenterInViewport>
            <S.Header fontSize="5rem">404</S.Header>
            <S.Header as="h2" className="no-margin-top">
                Page Not Found
            </S.Header>
            <br />
            <p>Sorry, the page you are looking for doesn&apos;t exist.</p>
            <br />
            <Link to="/">
                <S.Button className="uppercase">Take me home</S.Button>
            </Link>
        </S.CenterInViewport>
    </S.MainPageBody>
);

export default NotFound;
