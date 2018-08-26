/**
 * Displays details about the elasticsearch connection
 */

import React, { Component} from "react";
import { getDocumentCount } from "../Elastic";

class ElasticStatus extends Component{

    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
            recordCount: 0,
        };

        this.toggleHidden = this.toggleHidden.bind(this);
    }

    toggleHidden() {
        this.setState({hidden: !this.state.hidden});
    }

    componentDidMount() {
        if (this.props.elasticReady) {
            console.log("Getting document count");
            getDocumentCount(this.props.client)
                .then(count => {
                    this.setState({recordCount: count});
                });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.elasticReady != prevProps.elasticReady && this.props.elasticReady) {
            console.log("Getting document count");
            getDocumentCount(this.props.client)
                .then(count => {
                    this.setState({recordCount: count});
                });
        }
    }

    render(){

        return(
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        Elasticsearch Cluster
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
                        <table className="table is-bordered" style={{width: "100%", marginBottom: "0px"}}>
                            <tbody>
                                <tr>
                                    <td>Cluster Status:</td>
                                    <td>{this.props.elasticStatus}</td>
                                </tr>
                                <tr>
                                    <td>Record Count:</td>
                                    <td>{this.state.recordCount}</td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            );
        }
    }
}

export default ElasticStatus;
