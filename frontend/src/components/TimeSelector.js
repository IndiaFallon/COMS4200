import React, { Component } from "react";
import { getHourlyAggregates } from "../Elastic";
import {
    Crosshair,
    FlexibleXYPlot,
    XAxis,
    YAxis,
    VerticalRectSeries,
} from "react-vis";
import "./TimeSelector.scss";

// 24 data points, one for each hour
const testData = [
    2,
    5,
    1,
    2,
    4,
    7,
    2,
    4,
    9,
    1,
    3,
    7,
    8,
    2,
    5,
    2,
    6,
    2,
    5,
    1,
    5,
    7,
    6,
    5,
    2,
]; 

class TimeSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            crosshairValues: [],
            hoveredHour: null,
            data: [],
        }

        // The colour range to use, 0 is the default
        // and 1 is the selected colour
        this.colorRange = [
            "blue",
            "yellow",
            "red",
        ];

        this.onValueClick = this.onValueClick.bind(this);
        this.onValueMouseOver = this.onValueMouseOver.bind(this);
        this.onValueMouseOut = this.onValueMouseOut.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.elasticReady != prevProps.elasticReady) {
            this.getData();
        }
    }

    parseData(data) {
        const { selectedHour } = this.props;

        let hour = 0;
        let output = [];

        for (let i = 0; i < data.length; i++) {

            let color = 0;
            if (hour == selectedHour) {
                color = 2;
            } else if (hour == this.state.hoveredHour) {
                color = 1;
            }

            output.push({
                x0: hour,
                x: hour+1,
                y: data[i].y,
                color: color,
            });

            hour++;
        }

        return output;
    }

    /*
     * Fetches the data from ElasticSearch
     */
    getData() {
        const { elasticReady, client } = this.props;

        if (elasticReady) {
            getHourlyAggregates(client, 0, 0).then(data => {
                this.setState({data}); 
            });
        }
    }

    onValueClick(d, obj) {
        this.props.setSelectedHour(d.x0);
    }

    onValueMouseOver(d, obj) {
        this.setState({hoveredHour: d.x0});
    }

    onValueMouseOut(d, obj) {
        this.setState({hoveredHour: null});
    }
    render() {

        // On render, query the data

        return (
            <div className="TimeSelector">
                <FlexibleXYPlot
                    xDomain={[0, 26]}

                    colorType="category"
                    colorRange={this.colorRange}
                    colorDomain={[0, 1, 2]}

                    margin={{left: 5, right: 5, top: 5, bottom: 0}}
                >
                    <XAxis hideTicks hideLine />
                    <YAxis hideTicks hideLine />
                    <VerticalRectSeries
                        data={this.parseData(this.state.data)}
                        onValueClick={this.onValueClick}
                        onValueMouseOver={this.onValueMouseOver}
                        onValueMouseOut={this.onValueMouseOut}
                    />
                    
                    <Crosshair values={this.state.crosshairValues}>
                    </Crosshair>
                </FlexibleXYPlot>
            </div>
        );
    }
}

export default TimeSelector;
