import React, { Component } from 'react';

class SymbolDisplayResults extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, selected } = this.props;
        return (
            <div className={`symbol-display-container ${selected ? "selected" : ""}`} >
                <img src={`images/symbols/tangrams/${name}.png`} style={{maxWidth:"100%", maxHeight:"100%"}} />
            </div>
        );
    }
}

export default SymbolDisplayResults;
