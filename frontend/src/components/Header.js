/*
 * The header displayed in the sidebar
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React from "react";
import "./Header.scss";

function Header(props) {
    return (
        <div className="Header">
            <h1 className="Header-title subtitle is-3"><i className="far fa-eye"></i> TrafficVis</h1>
        </div>
    );
}

export default Header;
