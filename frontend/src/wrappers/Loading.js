/**
 * Used to give a component a loading state,
 * in which a spinner is displayed
 *
 * @author Roy Portas <royportas@gmail.com>
 */
import React from "react";

import "./Loading.scss";

function Loading(props) {

    if (props.hasLoaded) {
        return props.children || null;
    } else {
        return (
            <div className={props.className + " Loading"}>
                <i className="far fa-compass fa-3x Loading-spinner"></i>
            </div>
        );
    }
}

export default Loading;
