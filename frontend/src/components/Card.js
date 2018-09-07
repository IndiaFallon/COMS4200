/**
 * A basic card for the sidebar
 */

import React, { Component} from "react";
import "./Card.scss";

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
        };

        this.toggleHidden = this.toggleHidden.bind(this);
    }

    toggleHidden() {
        this.setState({hidden: !this.state.hidden});
    }

    render() {
        const { title } = this.props;

        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        {title}
                    </p>
                    <a onClick={this.toggleHidden} className="card-header-icon">
                        <span className="icon">
                            {this.renderArrow()}
                        </span>
                    </a>
                </header>

                {this.renderContent()}

            </div>
        );
    }

    renderArrow() {
        if (this.state.hidden) {
            return (
                <i className="fas fa-angle-left" aria-hidden="true" />
            );
        } else {
            return (
                <i className="fas fa-angle-down" aria-hidden="true" />
            );
        }
    }

    renderContent() {
        if (!this.state.hidden) {
            return (
                <div style={{width: "100%"}}>
                    {this.props.children}
                </div>
            );
        }
    }
}
