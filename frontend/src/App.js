/**
 * The main component for the application
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";
import elasticsearch from "elasticsearch";
import "./App.scss";

import ElasticStatus from "./components/ElasticStatus";
import Map from "./components/Map";
import TimeSelector from "./components/TimeSelector";
import DummyChart from "./components/DummyChart";
import ProtocolChart from "./components/ProtocolChart";
import ProtocolFilter from "./components/ProtocolFilter";
import Loading from "./wrappers/Loading";
import { getMapData, getHourlyAggregates, ELASTIC_CONFIG } from "./Elastic";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // Is the cluster ready to accept queries
            elasticReady: false,
            // The human readable status of the elasticsearch connection
            elasticStatus: "Not Connected",

            // TODO: Rename
            // The geospatial data
            ipData: {},

            // If the data is loading
            ipDataLoading: false,

            // The hourly aggregations for the TimeSelector
            hourlyAggregates: [],

            // The selected hour
            selectedHour: null,

            // The start and end timestamp
            startTimestamp: null,
            endTimestamp: null,

            // Used to toggle the time selector
            timeSelectorVisible: true,

            // The protocol filter
            filter: {}
        };

        // The elasticsearch cluster
        this.client = null;

        this.ping = null;

        // Bind functions
        this.setHourAndTimestamp = this.setHourAndTimestamp.bind(this);
        this.toggleTimeSelector = this.toggleTimeSelector.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
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

            // Get the hourly aggregates
            getHourlyAggregates(client, 0, 0).then(d => this.setState({hourlyAggregates: d}));


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

                <img src="/logo.png" className="App-logo" />

                <div className="App-map">
                    <Map
                        ipData={this.state.ipData} 
                    />
                    <Loading
                        hasLoaded={this.state.ipDataLoading == false}
                        className="App-map-loader"
                    />
                </div>

                <div className="App-time-selector">

                    <div onClick={this.toggleTimeSelector} className="App-time-selector-header">
                        Hide/Show
                    </div>

                    { this.renderTimeSelector() }
                </div>

                <div className="App-sidebar">
                    <ElasticStatus
                        client={this.client}
                        elasticReady={this.state.elasticReady}
                        elasticStatus={this.state.elasticStatus}
                    />

                    <ProtocolFilter onChange={this.handleFilterChange} />

                    <DummyChart />

                    <ProtocolChart />
                </div>
            </div>
        );
    }

    renderTimeSelector() {
        if (this.state.timeSelectorVisible) {
            return (
                <div style={{height: "200px"}}>
                    <Loading hasLoaded={this.state.hourlyAggregates.length != 0} >
                        <TimeSelector 
                            selectedHour={this.state.selectedHour}
                            setHourAndTimestamp={this.setHourAndTimestamp}

                            data={this.state.hourlyAggregates}
                        />
                    </Loading>
                </div>
            );
        } else {
            return (
                <div style={{height: "20px"}} />
            );
        }
    }

    toggleTimeSelector() {
        this.setState({timeSelectorVisible: !this.state.timeSelectorVisible});
    }

    setHourAndTimestamp(hour, timestamp) {
        const startTimestamp = timestamp;
        const endTimestamp = timestamp + 3600000;

        this.setState({
            selectedHour: hour,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp
        });

        this.setState({ipDataLoading: true});

        const filter = this.state.filter;

        getMapData(client, startTimestamp, endTimestamp, filter.protocolName, filter.protocolMap)
            .then(r => {
                this.setState({ipData: r, ipDataLoading: false});
            });
    }

    handleFilterChange(newFilter) {
        const startTimestamp = this.state.startTimestamp;
        const endTimestamp = this.state.endTimestamp;

        this.setState({filter: newFilter});

        if (!startTimestamp || !endTimestamp) {
            // Don't query elastic
            return;
        }

        this.setState({ipDataLoading: true});

        getMapData(client, startTimestamp, endTimestamp, newFilter.protocolName, newFilter.protocolMap)
            .then(r => {
                this.setState({ipData: r, ipDataLoading: false});
            });
    }
}

export default App;
