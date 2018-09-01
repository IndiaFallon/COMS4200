import React, { Component } from "react";
import elasticsearch from "elasticsearch";
import "./App.scss";

import ElasticStatus from "./components/ElasticStatus";
import Map from "./components/Map";
import { ELASTIC_CONFIG } from "./Elastic";

class App extends Component{

    constructor(props) {
        super(props);

        this.state = {
            // Is the cluster ready to accept queries
            elasticReady: false,
            // The human readable status of the elasticsearch connection
            elasticStatus: "Not Connected",

            // Dummy data
            ipData: {},
        };

        // The elasticsearch cluster
        this.client = null;

        this.ping = null;
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
        }).then((result, reject) => {
            this.setState({elasticReady: true});
            this.setState({elasticStatus: "Connected"});
        }).catch(err => {
            this.setState({elasticReady: false});
            this.setState({elasticStatus: "Down"});
        });

        // Fetch the dummy data
        fetch("/out.json").then(r => r.json()).then(r => this.setState({ipData: r}));
    }

    componentWillUnmount() {
        this.client.close();
    }

    render(){
        return(
            <div className="App">
                <div className="App-map">
                    <Map ipData={this.state.ipData} />
                </div>

                <div className="App-sidebar">
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
