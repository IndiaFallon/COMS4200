import React, { Component} from "react";
import "./App.scss";

import ElasticStatus from "./components/ElasticStatus";
import elasticsearch from "elasticsearch";
import { ELASTIC_CONFIG } from "./Elastic";

class App extends Component{

    constructor(props) {
        super(props);

        this.state = {
            // Is the cluster ready to accept queries
            elasticReady: false,
            // The human readable status of the elasticsearch connection
            elasticStatus: "Not Connected",
        };

        // The elasticsearch cluster
        this.client = null;
    }

    componentDidMount() {
        // Update the state
        this.setState({elasticReady: false});
        this.setState({elasticStatus: "Connecting"});

        this.client = new elasticsearch.Client({
            host: ELASTIC_CONFIG.HOST,
            log: ELASTIC_CONFIG.LOG,
        });

        // Make the client accessible for debugging
        window.client = this.client;

        this.client.ping({
            requestTimeout: 5000,
        }).then(result => {
            this.setState({elasticReady: true});
            this.setState({elasticStatus: "Connected"});
        }).catch(err => {
            this.setState({elasticReady: false});
            this.setState({elasticStatus: "Down"});
        });
    }

    componentWillUnmount() {
    }

    render(){
        return(
            <div className="App">
                <div className="App-map">
                    <h1>Map goes here</h1>
                </div>

                <div className="App-sidebar">
                    <ElasticStatus
                        client={this.client}
                        elasticReady={this.state.elasticReady}
                        elasticStatus={this.state.elasticStatus}
                    />
                    <ElasticStatus
                        client={this.client}
                        elasticReady={this.state.elasticReady}
                        elasticStatus={this.state.elasticStatus}
                    />
                    <ElasticStatus
                        client={this.client}
                        elasticReady={this.state.elasticReady}
                        elasticStatus={this.state.elasticStatus}
                    />
                </div>
            </div>
        );
    }
}

export default App;
