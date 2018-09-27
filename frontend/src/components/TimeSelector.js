/**
 * Allows the user to select times
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";
import {
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
            hoveredHour: null,
        }

        // The colour range to use:
        // - 0 is the default
        // - 1 is hover
        // - 1 is the selected colour
        this.colorRange = [
            "rgba(255, 255, 255, 0.2)",
            "rgba(255, 255, 255, 0.6)",
            "rgba(255, 255, 255, 1)",
        ];

        this.strokeRange = [
            "rgba(255, 255, 255, 1)",
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

            let stroke = 0;
            let color = 0;
            if (hour == selectedHour) {
                color = 2;
            } else if (hour == this.state.hoveredHour) {
                color = 1;
            }

            output.push({
                x0: hour-0.25,
                x: hour+0.25,
                y: data[i].y,
                timestamp: data[i].name,
                color: color,
                stroke: stroke,
            });

            hour++;
        }

        return output;
    }

    onValueClick(d, obj) {
        this.props.setHourAndTimestamp(d.x0+0.25, d.timestamp);
    }

    onValueMouseOver(d, obj) {
        this.setState({hoveredHour: d.x0+0.25});
    }

    onValueMouseOut(d, obj) {
        this.setState({hoveredHour: null});
    }

    render() {
        return (
            <div className={this.props.className + " TimeSelector"}>
                <p>
                    Click on one of the below boxes to show the
                    traffic data on the map above
                </p>

                <div className="TimeSelector-chart">
                    <div style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        left: "0",
                        bottom: "0"
                    }}>
                        <FlexibleXYPlot
                            xDomain={[1, 24]}

                            colorType="category"
                            colorRange={this.colorRange}
                            colorDomain={[0, 1, 2]}
                            strokeRange={this.strokeRange}
                            strokeDomain={[0, 1]}

                            margin={{left: 40, right: 40, top: 20, bottom: 30}}
                        >
                            <XAxis
                                tickFormat={d => {
                                    if (d == 12) {
                                        return "12pm";
                                    } else if (d == 24) {
                                        return "12am";
                                    } else if (d > 12) {
                                        return `${d-12}pm`;
                                    }

                                    return `${d}am`;
                                }}
                                style={{
                                    line: { stroke: "white" },
                                    ticks: { stroke: "white" },
                                    text: { stroke: "none", fill: "white" },
                                }}
                            />
                            <YAxis hideTicks hideLine />
                            <VerticalRectSeries
                                data={this.parseData(this.props.data)}
                                onValueClick={this.onValueClick}
                                onValueMouseOver={this.onValueMouseOver}
                                onValueMouseOut={this.onValueMouseOut}
                                style={{
                                    strokeWidth: "0.5px",
                                }}
                            />
                        </FlexibleXYPlot>
                    </div>
                </div>

                <p>Time</p>
            </div>
        );
    }
}

export default TimeSelector;
