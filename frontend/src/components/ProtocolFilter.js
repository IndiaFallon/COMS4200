/**
 * A component to allow filtering of protocols
 *
 * @author Roy Portas <royportas@gmail.com>
 */

import React, { Component } from "react";
import Card from "./Card";

import "./ProtocolFilter.scss";

const L7_PROTO_NAME = [
    "NONE",
    "SSL",
    "DNS",
    "SSL.Apple",
    "HTTP",
    "DNS.Google",
];

const PROTOCOL_MAP = [
    "NONE",
    "tcp",
    "udp",
    "icmp",
];

class ProtocolFilter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            protocolName: undefined,
            protocolMap: undefined,
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value != "NONE" ? event.target.value : undefined;

        const state = Object.assign({}, this.state);
        state[name] = value;
        if (this.props.onChange) {
            this.props.onChange(state);
        }

        this.setState({[name]: value});
    }

    render() {
        return (
            <Card title="Protocol Filter">
                <div className="field">
                    <label className="ProtocolFilter-label">L7_PROTO_NAME</label>
                    <br />
                    <div className="ProtocolFilter-select select is-info">
                        <select
                            name="protocolName"
                            value={this.state.protocolName}
                            onChange={this.handleChange}
                        >
                            { L7_PROTO_NAME.map(p =>
                                <option key={p} value={p}>{p}</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="field">
                    <label className="ProtocolFilter-label">PROTOCOL_NAME</label>
                    <br />
                    <div className="ProtocolFilter-select select is-info">
                        <select
                            name="protocolMap"
                            value={this.state.protocolMap}
                            onChange={this.handleChange}
                        >
                            { PROTOCOL_MAP.map(p =>
                                <option key={p} value={p}>{p}</option>
                            )}

                        </select>
                    </div>
                </div>
            </Card>
        );
    }
}

export default ProtocolFilter;

