import React from "react";

import ListingsTable from "../components/ListingsTable";

import * as S from "../styles/styled-components/styled.main";

/**
 * Listings page which displays a table with data from the
 * PostgreSQL database, including entry creation date, name stored,
 * and message which is only revealed when the user enters the correct
 * PIN number.
 *
 * @return {Component} the home page
 */
const Listings = () => (
    <S.MainPageBody>
        <S.Header>A Table of Very Important Data</S.Header>
        <ListingsTable />
    </S.MainPageBody>
);

export default Listings;
