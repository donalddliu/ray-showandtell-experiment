import React, { Component } from 'react';

class SymbolDisplayResults extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, selected } = this.props;
        return (
            <div className={`symbol-display-container ${selected}`} >
                <img className={`symbol-img ${selected}`} src={`images/symbols/tangrams/${name}.png`} style={{width:"100%"}} />
            </div>
        );
    }
}

export default SymbolDisplayResults;
