import React, { Component} from "react";
import elasticsearch from "elasticsearch";
import DeckGL, { ArcLayer } from "deck.gl";
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
                    <DeckGL
                        initialViewState={this.state}
                        controller={true}
                        layers={this.renderLayers()}
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

    renderLayers() {
        return [
            new ArcLayer({
                id: "arc",
                data: this.state.ipData,
                getSourcePosition: d => {
                    return [d.src_latlng[1], d.src_latlng[0]];
                },
                getTargetPosition: d => {
                    return [d.dst_latlng[1], d.dst_latlng[0]];
                },
                getSourceColor: d => [255, 0, 0],
                getTargetColor: d => [0, 255, 0],
                strokeWidth: 4,
            }),
        ];
    }
}

export default App;
