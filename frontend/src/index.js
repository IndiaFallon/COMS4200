/**
 * The entrypoint
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

// Import the global styles
import "./styles.scss";

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
