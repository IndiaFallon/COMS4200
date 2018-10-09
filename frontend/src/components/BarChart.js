/**
 * A chart that displays bar chart formatted information
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";
import {
    FlexibleXYPlot,
    VerticalBarSeries,
    XAxis,
    YAxis
} from "react-vis";
import Card from "./Card";

class BarChart extends Component {

    constructor(props) {
        super(props);

        this.chartContainer = React.createRef();
    }

    render() {
        return (
            <Card title={this.props.title}>
                <div ref={this.chartContainer} style={{"height": "200px"}}>
                    { this.renderChart() }
                </div>
            </Card>
        );
    }

    renderChart() {
        if (this.props.data && this.props.data.length > 0) {
            return (
                <FlexibleXYPlot
                    xType="ordinal"
                    stackBy="x"
                    margin={{left: 80}}
                >
                    <XAxis
                        tickLabelAngle={-90}
                        style={{
                            line: { stroke: "white" },
                            ticks: { stroke: "white" },
                            text: { stroke: "none", fill: "white" },
                        }}
                    />
                    <YAxis
                        style={{
                            line: { stroke: "white" },
                            ticks: { stroke: "white" },
                            text: { stroke: "none", fill: "white" },
                        }}
                    />

                    <VerticalBarSeries
                        data={this.props.data}
                    />
                </FlexibleXYPlot>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }
}

export default BarChart;
