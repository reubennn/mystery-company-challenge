import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch"; // Adds fetch support for IE browser.

/** Import the main React Application */
import App from "./App";

/** Stylesheets to reset/normalize across browsers **/
import "./styles/normalize.scss";
import "./styles/reset.local.scss";

/** Import main styling */
import "./styles/index.scss";

ReactDOM.render(
    <App />,
    document.getElementById("root"),
);
