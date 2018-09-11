import React, { Component } from "react";
import {
    FlexibleXYPlot,
    LineSeries,
    XAxis,
    YAxis,
    VerticalRectSeries,
} from "react-vis";
import Card from "./Card";

const data = [
    {x: 0, y: 8},
    {x: 1, y: 5},
    {x: 2, y: 4},
    {x: 3, y: 9},
    {x: 4, y: 1},
    {x: 5, y: 7},
    {x: 6, y: 6},
    {x: 7, y: 3},
    {x: 8, y: 2},
    {x: 9, y: 0}
];

class DummyChart extends Component {
    render() {
        return (
            <Card title="Chart">
                <div style={{"height": "200px"}}>
                    <FlexibleXYPlot>
                        <XAxis />
                        <YAxis />
                        <LineSeries data={data} />
                    </FlexibleXYPlot>
                </div>
            </Card>
        );
    }
}

export default DummyChart;
