/**
 * The 3D map component
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";

import DeckGL, { ArcLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoicnBvcnRhcyIsImEiOiJlNDRkYjIwYzNlMzIyZjY4YjA0YmIyOTU4MGI3NWJkYiJ9.d7ofM7x51os38ReO9X0E6w";

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // Deck.gl viewport settings
            longitude: 153.021072,
            latitude: -27.470125,
            zoom: 3,
            pitch: 60,
            bearing: 260,

            alpha: 0,
        };

        this.startAnimationTimer = null;
        this.intervalTimer = null;

        this.startAnimate = this.startAnimate.bind(this);
        this.animatePath = this.animatePath.bind(this);
    }

    componentDidMount() {
        this.animate();
    }

    componentWillUnmount() {
        this.stopAnimate();
    }

    animate() {
        this.stopAnimate();

        this.startAnimationTimer = window.setTimeout(this.startAnimate, 3000);
    }

    startAnimate() {
        this.intervalTimer = window.setInterval(this.animatePath, 20);
    }

    stopAnimate() {
        window.clearTimeout(this.startAnimationTimer);
        window.clearTimeout(this.intervalTimer);
    }

    animatePath() {
        if (this.state.alpha == 256) {
            this.stopAnimate();
        } else {
            this.setState({alpha: this.state.alpha + 1});
        }
    }

    render() {
        return (
            <DeckGL
                initialViewState={this.state}
                controller={true}
                layers={this.renderLayers()}
            >
                <StaticMap
                    reuseMaps
                    mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                />
            </DeckGL>

        );
    }

    /**
     * Renders the layers onto the map
     */
    renderLayers() {

        const layers = [];

        if (this.props.ipData.length != 0) {

            let maxBytes = 1;
            for (let i = 0; i < this.props.ipData.length; i++) {
                const bytes = this.props.ipData[i].totalBytes;
                if (bytes > maxBytes) {
                    maxBytes = bytes;
                }
            }

            layers.push(
                new ArcLayer({
                    id: "arc",
                    data: this.props.ipData,
                    getSourcePosition: d => {
                        return [d.srcLon, d.srcLat];
                    },
                    getTargetPosition: d => {
                        return [d.dstLon, d.dstLat];
                    },
                    getSourceColor: d => [0, 255, 0],
                    getTargetColor: d => [255, 0, 0, this.state.alpha],
                    updateTriggers: {
                        getTargetColor: this.state.alpha,
                    },
                    getStrokeWidth: d => (Math.log(d.totalBytes / maxBytes) + 20) / 4,
                })
            );
        }

        return layers;
    }
}

export default Map;
