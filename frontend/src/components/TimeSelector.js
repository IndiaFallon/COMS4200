import React, { Component } from "react";
import {
    Crosshair,
    FlexibleXYPlot, XAxis, YAxis,
    VerticalRectSeries,
} from "react-vis";

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
                y: data[i],
                color: color,
            });

            hour++;
        }

        return output;
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
        return (
            <FlexibleXYPlot
                xDomain={[0, 24]}
                yDomain={[0, 10]}

                colorType="category"
                colorRange={this.colorRange}
                colorDomain={[0, 1, 2]}
            >
                <XAxis />
                <YAxis />
                <VerticalRectSeries
                    data={this.parseData(testData)}
                    onValueClick={this.onValueClick}
                    onValueMouseOver={this.onValueMouseOver}
                    onValueMouseOut={this.onValueMouseOut}
                />
                
                <Crosshair values={this.state.crosshairValues}>
                </Crosshair>
            </FlexibleXYPlot>
        );
    }
}

export default TimeSelector;
