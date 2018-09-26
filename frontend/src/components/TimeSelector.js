/**
 * Allows the user to select times
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";
import {
    Crosshair,
    FlexibleXYPlot,
    XAxis,
    YAxis,
    VerticalRectSeries,
} from "react-vis";
import "./TimeSelector.scss";

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
                y: data[i].y,
                timestamp: data[i].name,
                color: color,
            });

            hour++;
        }

        return output;
    }

    onValueClick(d, obj) {
        this.props.setHourAndTimestamp(d.x0, d.timestamp);
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
                        data={this.parseData(this.props.data)}
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
