import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Listings from "./pages/Listings";
import NotFound from "./pages/NotFound";

/**
 * The main React App; parent of all other Components.
 *
 * React Router => render Homepage when url is a "/":
 *      - "/" would match every single route, so Route "exact" tells
 *      React Router needs to match the url exactly.
 * - React Router implementation followed by
 * official documentation: https://reactrouter.com/web/api
 *
 * @return {Component} the React App
 */
const App = () => (
    <Router>
        <Navbar />
        <Switch>
            <Route path="/" component={Homepage} exact />
            <Route path="/list" component={Listings} exact />
            <Route render={NotFound} /> {/* All other routes */}
        </Switch>
    </Router>
);

/** Only use React HMR during development environment */
export default process.env.NODE_ENV !== "production" ? hot(module)(App) : App;
