import React, { Component } from 'react';
import SymbolDisplay from '../GameComponents/SymbolDisplay';


class ShowStage extends Component {
    constructor(props) {
        super(props);  
    }

    renderSymbols() {
        const {game, round, stage, player} = this.props;
        const answer = round.get("answer");
        const symbolSet = round.get("symbolSet");

        return(
            symbolSet.map((symbol) => {
                return (
                    <SymbolDisplay
                        key={symbol}
                        name={symbol}
                        selected={answer === symbol}
                        {...this.props}
                    />
                )
            })
        )
    }


    render() {
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <header> Type a message into the box to get your teammate to select the highlighted symbol </header>
                </div>
                <div className="task-response-body">
                    <div className="task-response">
                        {this.renderSymbols()}
                    </div>
                </div>
                <div className="task-response-footer">
                </div>
                
            </div>
        );
    }
}

export default ShowStage;
