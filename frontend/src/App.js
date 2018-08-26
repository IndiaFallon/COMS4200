import React, { Component} from "react";
import "./App.scss";

import Elastic from "./components/Elastic";

class App extends Component{
    render(){
        return(
            <div className="App">
                <div style={{width: '400px'}}>
                    <Elastic />
                </div>
            </div>
        );
    }
}

export default App;
