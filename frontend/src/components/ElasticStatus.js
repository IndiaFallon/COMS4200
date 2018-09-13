/**
 * Displays details about the elasticsearch connection
 */

import React, { Component} from "react";
import { getDocumentCount } from "../Elastic";
import Card from "./Card";

class ElasticStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recordCount: 0,
        };
    }

    componentDidMount() {
        if (this.props.elasticReady) {
            getDocumentCount(this.props.client)
                .then(count => {
                    this.setState({recordCount: count});
                });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.elasticReady != prevProps.elasticReady && this.props.elasticReady) {
            getDocumentCount(this.props.client)
                .then(count => {
                    this.setState({recordCount: count});
                });
        }
    }

    render(){
        return (
            <Card title="Elasticsearch Cluster">
                <table className="table is-bordered" style={{width: "100%", marginBottom: "0px"}}>
                    <tbody>
                        <tr>
                            <td>Cluster Status:</td>
                            <td>{this.props.elasticStatus}</td>
                        </tr>
                        <tr>
                            <td>Record Count:</td>
                            <td>{this.state.recordCount}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        );
    }
}

export default ElasticStatus;
