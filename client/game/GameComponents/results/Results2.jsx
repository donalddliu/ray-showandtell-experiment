import React from "react";
import ResultsTimer from "./ResultsTimer.jsx";


import { Centered } from "meteor/empirica:core";
import SymbolDisplay from "../SymbolDisplay.jsx";


export default class Results extends React.Component {

  renderListenerResults = () => {
    const { stage, round, player, game } = this.props;

    const correctMessage = "Your team was correct, congratulations!";
    const incorrectMessage = "Your team was not correct, better luck on the next one.";

    const result = player.round.get("taskCorrect");

    const listenerPuzzleSet = player.round.get("puzzleSet");
    const listenerPuzzleAnswer = player.round.get("puzzleAnswer");
    const listenerAnswer = player.round.get("symbolSubmitted");
    const adviceReceived = player.round.get("adviceReceived"); // {advisorId: symbolSelected}
    
    return (
      <div className="results-container">
        <div className="results-content">
            <h1 className="results-text"> {result ? correctMessage : incorrectMessage} </h1>
            <img src={`images/hr-color.png`} width="200px" height="3px" />
            <div className="results-symbol-display">
              {
                listenerPuzzleSet.map((symbol) => {
                  return(
                    <div>
                      <div className="players-selected-container">
                        <div className="listeners-selected">
                          {symbol === listenerAnswer ? 
                            <div>{player.get("anonymousName")}(You) </div> : ""
                          }
                        </div>
                        <div className="advisors-selected">
                          {
                            Object.keys(adviceReceived).map((a) => {
                              const selected = adviceReceived[a] === symbol;
                              const advisorPlayer = game.players.find((p) => p.get("nodeId") === parseInt(a));
                              if (selected) {
                                return <div> {advisorPlayer.get("anonymousName")} </div>
                              } else {
                                return <div></div>
                              }
                            })
                          }
                        </div>
                      </div>  
                      <SymbolDisplay
                        key={symbol}
                        name={symbol}
                        selected={symbol == listenerAnswer && result || Object.values(adviceReceived).includes(symbol) && symbol == listenerPuzzleAnswer ? "correct" : "wrong"} 
                        {...this.props}
                      />
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


  renderSpeakerResults = () => {
    const { stage, round, player, game } = this.props;

    const correctMessage = "Your team was correct, congratulations!";
    const incorrectMessage = "Your team was not correct, better luck on the next one.";

    const result = player.round.get("taskCorrect");

    const speakerPuzzleSet = player.round.get("puzzleSet");
    const speakerPuzzleAnswer = player.round.get("puzzleAnswer");
    const listenerId = player.round.get("pairedListener");
    const listenerPlayer = game.players.find((p)  => p.get("nodeId") === listenerId);
    const listenerAnswer = listenerPlayer.round.get("symbolSubmitted");

    return(
      <div className="results-container">
          <div className="results-content">
              <h1 className="results-text"> {result ? correctMessage : incorrectMessage} </h1>
              <img src={`images/hr-color.png`} width="200px" height="3px" />
              <div className="results-symbol-display">
                {
                  speakerPuzzleSet.map((symbol) => {
                    return(
                      <div>
                        <div className="players-selected-container">
                          <div className="listeners-selected">
                            {symbol === listenerAnswer ? 
                              <div>{player.get("anonymousName")}</div> : ""
                            }
                          </div>
                          <div className="advisors-selected">
                            
                          </div>
                        </div>  
                        <SymbolDisplay
                          key={symbol}
                          name={symbol}
                          selected={symbol == listenerAnswer && result ? "correct" : "wrong"} 
                          {...this.props}
                        />
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

    const correctMessage = "Your team was correct, congratulations!";
    const incorrectMessage = "Your team was not correct, better luck on the next one.";


    if (player.round.get("role") === "Listener") {
      return this.renderListenerResults();
    } else if (player.round.get("role") === "Speaker") {
      return this.renderSpeakerResults();
    } else if (player.round.get("role") === "Advisor") {

    }

    return null;
      
    // return (
    //   <div className="results-container">
    //     <div className="results-content">
    //         <h1 className="results-text"> {result ? correctMessage : incorrectMessage} </h1>
    //         <img src={`images/hr-color.png`} width="200px" height="3px" />


    //         <ResultsTimer stage={stage}/>
    //     </div>
    //   </div>
    // );
  }
}
