import React, { Component } from 'react';

class SymbolDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, selected } = this.props;
        return (
            <div className={`symbol-display-container ${selected}`} >
                <img src={`images/symbols/tangrams/${name}.png`} style={{maxWidth:"100%", maxHeight:"100%"}} />
            </div>
        );
    }
}

export default SymbolDisplay;
