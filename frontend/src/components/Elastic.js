/**
 * Displays details about the elasticsearch connection
 */

import React, { Component} from "react";
import elastic from "elasticsearch";

class Elastic extends Component{

    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
            clusterStatus: "Not Connected",
        };

        this.toggleHidden = this.toggleHidden.bind(this);

        this.client = null;

        this.host = "localhost:9200";
        this.log = "trace";

        // Elastic records
        this.index = "nprobe-2017.07.21";
        this.type = "flows";
        window.index = this.index;
        window.type = this.type;
    }

    componentDidMount() {
        this.setState({clusterStatus: "Connecting"});

        this.client = new elastic.Client({
            host: this.host,
            log: this.log,
        });

        window.client = this.client;

        this.client.ping({
            requestTimeout: 5000,
        }).then(result => {
            this.setState({clusterStatus: "Connected"});
        }).catch(err => {
            this.setState({clusterStatus: "Down"});
        });
    }

    componentWillUnmount() {
    }

    toggleHidden() {
        this.setState({hidden: !this.state.hidden});
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
                <div>
                    <div className="card-content">
                        <div className="content">
                            <table className="table is-striped">
                                <tbody>
                                    <tr>
                                        <td>Cluster Status:</td>
                                        <td>{this.state.clusterStatus}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <footer className="card-footer">
                        <a href="#" className="card-footer-item">Reconnect</a>
                    </footer>
                </div>
            );
        }
    }
}

export default Elastic;
