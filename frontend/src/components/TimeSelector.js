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
        }

        // The colour range to use, 0 is the default
        // and 1 is the selected colour
        this.colorRange = [
            "#b3ccfa",
            "#ff8a01",
        ];

        this.onValueClick = this.onValueClick.bind(this);
    }

    parseData(data) {
        const { selectedHour } = this.props;

        let hour = 0;
        let output = [];

        for (let i = 0; i < data.length; i++) {
            output.push({
                x0: hour,
                x: hour+1,
                y: data[i],
                color: selectedHour == hour ? 0 : 1,
            });

            hour++;
        }

        return output;
    }

    onValueClick(d, obj) {
        this.props.setSelectedHour(d.x0);
    }

    render() {
        return (
            <FlexibleXYPlot
                xDomain={[0, 24]}
                yDomain={[0, 10]}

                colorType="category"
                colorRange={this.colorRange}
            >
                <XAxis />
                <YAxis />
                <VerticalRectSeries
                    data={this.parseData(testData)}
                    onValueClick={this.onValueClick}
                />
                
                <Crosshair values={this.state.crosshairValues}>
                </Crosshair>
            </FlexibleXYPlot>
        );
    }
}

export default TimeSelector;
