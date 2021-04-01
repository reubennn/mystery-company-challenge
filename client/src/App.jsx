import React from "react";
import { hot } from "react-hot-loader";

import Homepage from "./pages/Homepage";

const App = () => (
    <Homepage />
);

export default process.env.NODE_ENV !== "production" ? hot(module)(App) : App;
