import React from "react";

import Form from "../components/Form/Form";

/**
 * Import styled-components.
 * - See client/src/styles/styled-components/styled.main.js for more details.
 */
import * as S from "../styles/styled-components/styled.main";

/**
 * Homepage which is the landing page for the React App.
 *
 * - Displays a form for the user to enter their details
 * to be stored into the PostgreSQL database.
 *
 * @return {Component} the home page
 */
const Homepage = () => (
    <>
        <S.MainPageBody>
            <S.Header>A Very Important Full Stack App</S.Header>
            <Form />
        </S.MainPageBody>
    </>
);

export default Homepage;
