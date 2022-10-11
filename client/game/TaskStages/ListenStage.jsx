import React, { Component } from 'react';
import SymbolButton from '../GameComponents/SymbolButton';

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

class ListenStage extends Component {
    constructor(props) {
        super(props);  
    }

    handleButtonSelect= (symbolName) => {
        const {game, round, stage, player} = this.props;

        round.set("symbolSelected", symbolName)
        round.append("log", {
          verb: "symbolSelected",
          subjectId: player.id,
          object: symbolName,
          at: moment(TimeSync.serverTime(null, 1000)),
        });
    
      }

    handleSubmit = event => {
        const {game, round, stage, player} = this.props;
        event.preventDefault();

        const symbolSelected = round.get("symbolSelected");
        round.set("symbolSubmitted", symbolSelected); 
        round.append("log", {
            verb: "symbolSubmitted",
            subjectId: player.id,
            object: symbolSelected,
            at: moment(TimeSync.serverTime(null, 1000)),
        })
        
        stage.set("submitted", true);
    }

    renderSymbolButtons() {
        const {game, round, stage, player} = this.props;
        const symbolSet = round.get("symbolSet");

        const selectedSymbol = round.get("symbolSelected");
        return(
            symbolSet.map((symbol) => {
                return (
                    <SymbolButton
                        key={symbol}
                        name={symbol}
                        handleButtonSelect={(symbolName) => this.handleButtonSelect(symbolName)}
                        selected={selectedSymbol === symbol}
                        {...this.props}
                    />
                )
            })
        )
    }


    render() {
        const {game, round, stage, player} = this.props;
        const symbolDescription = round.get("symbolDescription");
        const selected = round.get("symbolSelected");
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <header> Choose the symbol that best represents the following description: </header>
                    <header> { symbolDescription } </header>
                </div>
                <div className="task-response-body">
                    <div className="task-response">
                        {this.renderSymbolButtons()}
                    </div>
                </div>
                <div className="task-response-footer">
                    {/* Submit Button */}
                    <div className="button-container">
                        <form onSubmit={this.handleSubmit}>
                            <button 
                            className={!selected ? "arrow-button button-submit-disabled" : "arrow-button button-submit"} 
                            disabled= {!selected ? true : false} type="submit"> Submit </button> 
                        </form>
                    </div>

                </div>
                
            </div>
        );
    }
}

export default ListenStage;
