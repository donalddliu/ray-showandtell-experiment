import React from "react";
import ResultsTimer from "./ResultsTimer.jsx";


import { Centered } from "meteor/empirica:core";
import SymbolDisplay from "../SymbolDisplay.jsx";
import SymbolDisplayResults from "../SymbolDisplayResults.jsx";


export default class PassiveResults extends React.Component {


    renderPassiveResults = () => {
        const {stage, round, player, game} = this.props;

        const message = "These are some outcomes from other teams";

        const completedRequests = player.round.get("completedRequests");
        const passiveOutcomes = []
        const passivePairs = player.round.get("passiveOutcomes");
        passivePairs.forEach((pair) => {
            const {speaker, listener} = pair;
            const speakerPlayer = game.players.find((p) => p.get("nodeId") === speaker);
            const listenerPlayer = game.players.find((p)  => p.get("nodeId") === listener);
            
            const correctAnswer = speakerPlayer.round.get("puzzleAnswer");
            const speakerDescription = speakerPlayer.round.get("symbolDescription");
            const listenerSubmission = listenerPlayer.round.get("symbolSubmitted");

            passiveOutcomes.push({answer: correctAnswer, description: speakerDescription, submission: listenerSubmission});
        })

        return(
          <div className="results-container">

              <div className="results-content">
                  <div className="results-text"> Passive Results </div>
                  <img src={`images/hr-color.png`} width="200px" height="3px" />
                    <div className="results-symbol-set-container">
                    {
                      passiveOutcomes.map((outcome) => {
                        const {answer, description, submission} = outcome;
    
                        const resultImg = answer === submission ? "images/symbols/circle-checkmark.svg" : "images/symbols/circle-cancel.svg";
    
                        return (
                        <div>
                            <div className="results-symbol-description">
                              Symbol Description: {description}
                            </div>
                            <div className="results-symbol-display">
                                <div className="results-side-symbol">
                                    Team choice
                                    <SymbolDisplayResults
                                        key={submission}
                                        name={submission}
                                        {...this.props}
                                    />
                                    </div>
    
                                <img className="results-img" src={`${resultImg}`}/>
    
                                <div className="results-side-symbol">
                                    Correct Answer
                                    <SymbolDisplayResults
                                        key={answer}
                                        name={answer}
                                        {...this.props}
                                    />
                                </div>
                            </div>
                            <img className="results-bar-separator" src={`images/hr-color.png`} width="200px" height="3px" />                           
                        </div>
                        )
                      }) 
                    }  
                    </div>
                  <ResultsTimer stage={stage}/>
              </div>
            </div>
        );
        
    }


  render() {
    const { stage, round, player, game } = this.props;
    
    return this.renderPassiveResults();
  }
}
