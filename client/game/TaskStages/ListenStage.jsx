import React, { Component } from 'react';

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import ListenStageListenerView from './ListenStageListenerView';
import ListenStageAdvisorView from "./ListenStageAdvisorView";

class ListenStage extends Component {
    constructor(props) {
        super(props);  
    }

    handleButtonSelect= (symbolName) => {
        const {game, round, stage, player} = this.props;

        player.round.set("symbolSelected", symbolName)
        stage.append("log", {
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
        stage.append("log", {
            verb: "symbolSubmitted",
            subjectId: player.id,
            object: symbolSelected,
            at: moment(TimeSync.serverTime(null, 1000)),
        })

        if (player.round.get("role") === "Advisor") {
            const requestQueue = player.round.get("requestQueue");
            const removedRequest = requestQueue.shift(); // Removes first element from request queue
            player.round.set("requestQueue", requestQueue);
            const completedRequests = player.round.get("completedRequests"); // Add request and symbolSelected to completed requests array
            const completedRequest = {request: removedRequest, advice: symbolSelected}
            completedRequests.push(completedRequest);
            player.round.set("completedRequests", completedRequests);
            
            // Send advice back to the requestor
            const requestorId = removedRequest.requestorId;
            const requestorPlayer = game.players.find((p) => p.get("nodeId") === requestorId);
            const adviceDict = requestorPlayer.round.get("adviceReceived");
            adviceDict[player.get("nodeId")] = symbolSelected;
            requestorPlayer.round.set("adviceReceived", adviceDict);

            stage.append("log", {
                verb: "completedRequest",
                subjectId: player.id,
                object: completedRequest,
                at: moment(TimeSync.serverTime(null, 1000)),
            })
        }
        if (player.round.get("role") === "Listener") {
            player.set("submitted", true);
        }
    }

    renderSymbolButtons(puzzleSet) {
        const {game, round, stage, player} = this.props;
        // const puzzleSet = player.round.get("puzzleSet");

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
        const puzzleSet = player.round.get("puzzleSet");

        const selected = player.round.get("symbolSelected");
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <header> Choose the symbol that best represents the following description: </header>
                    <header> { symbolDescription } </header>
                </div>
                <div className="task-response-body">
                    <div className="task-response">
                        {this.renderSymbolButtons(puzzleSet)}
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
            const {requestorId, puzzleSet, symbolDescription} = requestQueue[0];

            return (
                <div className="task-response-container">
                    <div className="task-response-header">
                        <header> {requestorId} has asked for your advice on the following puzzle </header>
                        <br></br>
                        <header> Choose the symbol that best represents the following description: </header>
                        <header> {symbolDescription} </header>
                    </div>
                    <div className="task-response-body">
                        <div className="task-response">
                            {this.renderSymbolButtons(puzzleSet)}
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
            return (
                <ListenStageListenerView {...this.props} />
            )
        } else if (player.round.get("role") === "Advisor") {
            console.log(player.round.get("requestQueue"));
            return (
                <ListenStageAdvisorView {...this.props} />
            )
        } else {
            return this.renderWait();
        }      
    }
}

export default ListenStage;
