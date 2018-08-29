import React, { Component} from "react";
import elasticsearch from "elasticsearch";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import "./App.scss";

import ElasticStatus from "./components/ElasticStatus";
import { ELASTIC_CONFIG } from "./Elastic";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoicnBvcnRhcyIsImEiOiJlNDRkYjIwYzNlMzIyZjY4YjA0YmIyOTU4MGI3NWJkYiJ9.d7ofM7x51os38ReO9X0E6w";

class App extends Component{

    constructor(props) {
        super(props);

        this.state = {
            // Is the cluster ready to accept queries
            elasticReady: false,
            // The human readable status of the elasticsearch connection
            elasticStatus: "Not Connected",

            // Deck.gl viewport settings
            longitude: 153.021072,
            latitude: -27.470125,
            zoom: 13,
            pitch: 60,
            bearing: 30,
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
    }

    componentWillUnmount() {
        this.client.close();
    }

    render(){
        return(
            <div className="App">
                <div className="App-map">
                    <DeckGL
                        initialViewState={this.state}
                        controller={true}
                    >
                        <StaticMap
                            reuseMaps
                            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                        />
                    </DeckGL>
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
