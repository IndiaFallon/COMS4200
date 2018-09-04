import React, { Component } from "react";
import {
    FlexibleXYPlot,
    LineSeries,
    XAxis,
    YAxis,
    VerticalRectSeries,
} from "react-vis";

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
    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
        };

        this.toggleHidden = this.toggleHidden.bind(this);
    }

    toggleHidden() {
        this.setState({hidden: !this.state.hidden});
    }

    render() {
        return (
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        Chart
                    </p>
                    <a onClick={this.toggleHidden} className="card-header-icon">
                        <span className="icon">
                            {this.renderArrow()}
                        </span>
                    </a>
                </header>

                {this.renderChart()}

            </div>
        );
    }

    renderArrow() {
        if (this.state.hidden) {
            return (
                <i className="fas fa-angle-left" aria-hidden="true" />
            );
        } else {
            return (
                <i className="fas fa-angle-down" aria-hidden="true" />
            );
        }
    }

    renderChart() {
        if (!this.state.hidden) {
            return (
                <div style={{"height": "200px"}}>
                    <FlexibleXYPlot>
                        <XAxis />
                        <YAxis />
                        <LineSeries data={data} />
                    </FlexibleXYPlot>
                </div>
            );
        }
    }
}

export default DummyChart;
