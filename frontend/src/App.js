import React, { Component } from "react";
import elasticsearch from "elasticsearch";
import "./App.scss";

import ElasticStatus from "./components/ElasticStatus";
import Map from "./components/Map";
import TimeSelector from "./components/TimeSelector";
import DummyChart from "./components/DummyChart";
import { getMapData, ELASTIC_CONFIG } from "./Elastic";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // Is the cluster ready to accept queries
            elasticReady: false,
            // The human readable status of the elasticsearch connection
            elasticStatus: "Not Connected",

            // Dummy data
            ipData: {},

            // The selected hour
            selectedHour: null,

            // The start and end timestamp
            startTimestamp: null,
            endTimestamp: null,
        };

        // The elasticsearch cluster
        this.client = null;

        this.ping = null;

        // Bind functions
        this.setHourAndTimestamp = this.setHourAndTimestamp.bind(this);
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
    }

    componentWillUnmount() {
        this.client.close();
    }

    render(){
        return(
            <div className="App">
                <div className="App-map">
                    <Map
                        selectedHour={this.state.selectedHour}
                        ipData={this.state.ipData} 
                    />
                </div>

                <div className="App-time-selector">
                    <TimeSelector 
                        selectedHour={this.state.selectedHour}
                        setHourAndTimestamp={this.setHourAndTimestamp}

                        client={this.client}
                        elasticReady={this.state.elasticReady}
                    />
                </div>

                <div className="App-sidebar">
                    <ElasticStatus
                        client={this.client}
                        elasticReady={this.state.elasticReady}
                        elasticStatus={this.state.elasticStatus}
                    />

                    <DummyChart />
                </div>
            </div>
        );
    }

    setHourAndTimestamp(hour, timestamp) {
        const startTimestamp = timestamp;
        const endTimestamp = timestamp + 3600000;

        this.setState({
            selectedHour: hour,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp
        });

        getMapData(client, startTimestamp, endTimestamp).then(r => this.setState({ipData: r}));

    }
}

export default App;
