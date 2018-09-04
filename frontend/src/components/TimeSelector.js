import React, { Component } from "react";
import {
    Crosshair,
    FlexibleXYPlot,
    XAxis,
    YAxis,
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
        }

        this.onNearestX = this.onNearestX.bind(this);
    }

    parseData(data) {
        let hour = 0;
        let output = [];

        for (let i = 0; i < data.length; i++) {
            output.push({
                x0: hour,
                x: hour+1,
                y: data[i],
            });

            hour++;
        }

        return output;
    }

    onNearestX(value, obj) {
        if (obj.index) {
            // this.setState({crosshairValues: testData[obj.index]});
        }
    }

    render() {
        return (
            <FlexibleXYPlot
                xDomain={[0, 24]}
                yDomain={[0, 10]}
            >
                <XAxis />
                <YAxis />
                <VerticalRectSeries
                    data={this.parseData(testData)}
                    onNearestX={this.onNearestX}
                />
                
                <Crosshair values={this.state.crosshairValues}>
                </Crosshair>
            </FlexibleXYPlot>
        );
    }
}

export default TimeSelector;
