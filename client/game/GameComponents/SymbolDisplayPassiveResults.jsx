import React, { Component } from 'react';

class SymbolDisplayPassiveResults extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, width, selected } = this.props;
        return (
            <div className={`symbol-display-container ${selected}`} style={{width: `${width}`}} >
                <img className={`symbol-img ${selected}`} src={`images/symbols/tangrams/${name}.png`} style={{width:"100%"}} />
            </div>
        );
    }
}

export default SymbolDisplayPassiveResults;
