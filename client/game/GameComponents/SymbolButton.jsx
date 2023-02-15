import React, { Component } from 'react';

class SymbolButton extends Component {
    constructor(props) {
        super(props);
    }

    // When button is selected, player sets the id of the button he selected
    handleClick = () => {
        const { game, round, stage, player, name, handleButtonSelect } = this.props;
        handleButtonSelect(name);
    }

    render() {
        const { name, selected } = this.props;
        return (
            <div className={`symbol-container`} >
                <button className={`${selected ? "symbolButtonSelected" : "symbolButtonUnselected"}`} onClick={this.handleClick}>
                    <img className={`symbol-img ${selected ? "selected" : ""}`}src={`images/symbols/tangrams/${name}.png`} style={{width: "100%"}} />
                </button>
            </div>
        );
    }
}

export default SymbolButton;
