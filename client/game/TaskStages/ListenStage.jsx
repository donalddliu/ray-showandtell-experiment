import React, { Component } from 'react';
import SymbolButton from '../GameComponents/SymbolButton';
import SymbolDisplay from '../GameComponents/SymbolDisplay';

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import AdvisorList from '../GameComponents/AdvisorList';

class ListenStage extends Component {
    constructor(props) {
        super(props);  
    }

    handleButtonSelect= (symbolName) => {
        const {game, round, stage, player} = this.props;

        player.round.set("symbolSelected", symbolName)
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

        const symbolSelected = player.round.get("symbolSelected");
        player.round.set("symbolSubmitted", symbolSelected); 
        round.append("log", {
            verb: "symbolSubmitted",
            subjectId: player.id,
            object: symbolSelected,
            at: moment(TimeSync.serverTime(null, 1000)),
        })
        
        player.set("submitted", true);
    }

    renderSymbolButtons() {
        const {game, round, stage, player} = this.props;
        const puzzleSet = player.round.get("puzzleSet");

        const selectedSymbol = player.round.get("symbolSelected");
        return(
            puzzleSet.map((symbol) => {
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

    renderSymbolDisplay(puzzleSet) {
        const {game, round, stage, player} = this.props;

        return(
            puzzleSet.map((symbol) => {
                return (
                    <SymbolDisplay
                        key={symbol}
                        name={symbol}
                        selected={false}
                        {...this.props}
                    />
                )
            })
        )
    }

    
    renderListenerSubmitted() {
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <header> Please wait until all Listeners have chosen their symbol </header>
                </div>
            </div>
        )
    }

    renderWait() {
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <header> Please wait </header>
                </div>
            </div>
        )
    }

    renderListenerStage() {
        const {game, round, stage, player} = this.props;
        const speakerId = player.round.get("pairedSpeaker");
        const speakerPlayer = game.players.find((p) => p.get("nodeId") === speakerId);

        const symbolDescription = speakerPlayer.round.get("symbolDescription");
        const selected = player.round.get("symbolSelected");
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

    renderAdvisorStage() {
        const {game, round, stage, player} = this.props;
        const requestQueue = player.round.get("requestQueue");
         
        if (requestQueue.length === 0) {
            return this.renderWait();
        } else {
            const {requestorId, message, puzzleSet, symbolDescription} = requestQueue[0];

            return (
                <div className="task-response-container">
                    <div className="task-response-header">
                        <header> {requestorId} has asked for your advice on the following puzzle </header>
                        <header> Choose the symbol that best represents the following description: </header>
                        <header> {symbolDescription} </header>
                    </div>
                    <div className="task-response-body">
                        <div className="task-response">
                            {this.renderSymbolDisplay(puzzleSet)}
                        </div>
                    </div>
                    <div className="task-response-footer">
                    </div>
                    
                </div>
            );
        }

    }


    render() {
        const {game, round, stage, player} = this.props;
        if (player.round.get("role") === "Listener"){
            if (player.get("submitted")) {
                return this.renderListenerSubmitted();
            } else {
                return (
                    <div className="listen-container"> 
                        {this.renderListenerStage()}
                        <AdvisorList {...this.props} />
                    </div>
                )
            }
        } else if (player.round.get("role") === "Advisor"){
            return this.renderAdvisorStage();
            
        } else {
            return this.renderWait()
        }
        
    }
}

export default ListenStage;
