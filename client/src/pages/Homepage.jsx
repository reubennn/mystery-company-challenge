import React from "react";

import Form from "../components/Form/Form";

/**
 * Import styled-components.
 * - See client/src/styles/styled-components/styled.main.js for more details.
 */
import * as S from "../styles/styled-components/styled.main";

const Homepage = () => (
    <S.MainPageBody>
        <S.Header>A Very Important Full Stack App</S.Header>
        <Form />
    </S.MainPageBody>
);

export default Homepage;
