/**
 * A chart that displays the different protocols
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";
import {
    FlexibleXYPlot,
    RadarChart,
} from "react-vis";
import Card from "./Card";

const DATA = [
    {
        name: 'Mercedes',
        mileage: 7,
        safety: 8,
        performance: 9,
    }
];

class ProtocolChart extends Component {

    constructor(props) {
        super(props);

        this.chartContainer = React.createRef();
    }

    render() {

        const chartWidth = this.chartContainer.current ? this.chartContainer.current.clientWidth : 200;
        const chartHeight = this.chartContainer.current ? this.chartContainer.current.clientHeight : 200;

        return (
            <Card title="Protocols">
                <div ref={this.chartContainer} style={{"height": "200px"}}>
                    <RadarChart
                        data={DATA}

                        domains={[
                            {name: 'mileage', domain: [0, 10]},
                            {name: 'safety', domain: [5, 10], getValue: d => d.safety},
                            {name: 'performance', domain: [0, 10], getValue: d => d.performance},
                        ]}

                        style={{
                            axes: {
                                stroke: "white",
                                text: {
                                    stroke: "grey",
                                    fontSize: 9,
                                },
                            },
                            labels: {
                                fontSize: 10,
                                fill: "white",
                            },
                            polygons: {
                                fillOpacity: 0.1,
                            }
                        }}

                        height={chartHeight}
                        width={chartWidth}
                    />
                </div>
            </Card>
        );
    }
}

export default ProtocolChart;
