import React, { Component } from 'react';
import SymbolButton from '../GameComponents/SymbolButton';
import SymbolDisplay from '../GameComponents/SymbolDisplay';

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import AdvisorList from '../GameComponents/AdvisorList';

import Timer from "../Timer.jsx";


class ListenStageListenerView extends Component {
    constructor(props) {
        super(props);  
    }


    handleButtonSelect= (symbolName) => {
        const {game, round, stage, player} = this.props;

        player.round.set("symbolSelected", symbolName)
        stage.append("log", {
          verb: "listenerSymbolSelected",
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
            verb: "listenerSymbolSubmitted",
            subjectId: player.id,
            object: symbolSelected,
            at: moment(TimeSync.serverTime(null, 1000)),
        })

        player.stage.set("submitted", true);


    }

    renderSymbolButtons(puzzleSet, selected) {
        const {game, round, stage, player} = this.props;
        return(
            puzzleSet.map((symbol) => {
                return (
                    <SymbolButton
                        key={symbol}
                        name={symbol}
                        handleButtonSelect={(symbolName) => this.handleButtonSelect(symbolName)}
                        selected={selected === symbol}
                        {...this.props}
                    />
                )
            })
        )
    }

    renderAdviceList() {
        return (
            <AdvisorList {...this.props}/>
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

    renderListenerStage() {
        const {game, round, stage, player} = this.props;
        if (player.stage.get("submitted")) {
            return this.renderListenerSubmitted();
        } else {
            const speakerId = player.round.get("pairedSpeaker");
            const speakerPlayer = game.players.find((p) => p.get("nodeId") === speakerId);
            const speakerColor = speakerPlayer.get("anonymousName");
    
            const symbolDescription = speakerPlayer.round.get("symbolDescription");
            const puzzleSet = player.round.get("puzzleSet");
    
            const selected = player.round.get("symbolSelected");
            return (
                <div className="task-response-container">
                    <div className="task-response-header">
                        <header> Choose the symbol that best represents the following description given by Player {speakerColor}: </header>
                        <header> { symbolDescription } </header>
                    </div>
                    <div className="task-response-body">
                        <div className="task-response">
                            {this.renderSymbolButtons(puzzleSet, selected)}
                            {/* {this.renderAdviceList()} */}
                        </div>
                    </div>
                    <div className="task-response-footer">
                        {/* Submit Button */}
                        <div className="button-container">
                            <form onSubmit={this.handleSubmit}>
                                <button 
                                className={!selected ? "arrow-button button-submit-disabled" : "arrow-button button-submit"} 
                                disabled= {!selected ? true : false} 
                                style={{marginTop: "20px"}}
                                type="submit"> Submit </button> 
                            </form>
                        </div>
                    </div>
                    <div className="task-response-footer-timer">
                        <Timer stage = {stage} />
                    </div>
                </div>
            );
        }


    }


    render() {
        const {game, round, stage, player} = this.props;

        return this.renderListenerStage();
    }
}

export default ListenStageListenerView;
