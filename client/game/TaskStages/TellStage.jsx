import React, { Component } from 'react';
import SymbolDisplay from '../GameComponents/SymbolDisplay';

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

import Timer from "../Timer.jsx";


class TellStage extends Component {
    constructor(props) {
        super(props);  
        this.state = {
          symbolDescription: "",
        }
    }

    handleChange = event => {
        const el = event.currentTarget;
        this.setState({ [el.name]: el.value.trim() });
    };

    handleSubmit = event => {
        const {game, round, stage, player} = this.props;
        event.preventDefault();

        const symbolDescription = this.state.symbolDescription;
        player.round.set("symbolDescription", symbolDescription); 
        stage.append("log", {
            verb: "symbolDescription",
            subjectId: player.id,
            object: symbolDescription,
            at: moment(TimeSync.serverTime(null, 1000)),
        });

        player.stage.set("submitted", true);

    }

    renderSymbols() {
        const {game, round, stage, player} = this.props;
        const puzzleAnswer = player.round.get("puzzleAnswer");
        const puzzleSet = player.round.get("puzzleSet");
        const {symbolDescription} = this.state;


        return(
            puzzleSet.map((symbol) => {
                return (
                    <div className="task-description-symbol-container">
                        <SymbolDisplay
                            key={symbol}
                            name={symbol}
                            selected={puzzleAnswer === symbol ? "selected" : ""}
                            {...this.props}
                        />
                        {puzzleAnswer === symbol ? 
                            <form className="task-description-form-container" onSubmit={this.handleSubmit}>
                                <input
                                    className="task-description-form"
                                    id="symbolDescripition"
                                    name="symbolDescription"
                                    value={symbolDescription}
                                    onChange={this.handleChange}
                                    required
                                />
                                <button className="task-description-submit" type="button" onClick={this.handleSubmit}>
                                    Submit
                                </button>
                            </form> :
                            null
                        }
                    </div>
                )
            })
        )
    }

    renderStage() {
        // const {symbolDescription} = this.state;
        const {stage} = this.props;

        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    {/* <header> Type a message into the box to get your teammate to select the highlighted symbol </header> */}
                    <div className="task-instruction-text"> Ask your partner to click on this shape by sending them a name or a label: </div>
                </div>
                <div className="task-response-body">
                    <div className="task-response">
                        {this.renderSymbols()}
                    </div>
                </div>
                <div className="task-response-footer-timer">
                    <Timer stage={stage}/>
                    {/* <form className="task-description-form-container" onSubmit={this.handleSubmit}>
                        <input
                            className="task-description-form"
                            id="symbolDescripition"
                            name="symbolDescription"
                            value={symbolDescription}
                            onChange={this.handleChange}
                            required
                        />
                    </form> */}
                </div>
                
            </div>
        );
    }

    renderSpeakerSubmitted() {
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <div className="task-instruction-text"> Please wait until all Speakers have described their symbol </div>
                </div>
            </div>
        )
    }

    renderWait() {
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <div className="task-instruction-text"> Please wait </div>
                </div>
            </div>
        )
    }


    render() {
        const {game, round, stage, player} = this.props;

            if (player.round.get("role") === "Speaker") {
                if (player.stage.get("submitted")) {
                    return this.renderSpeakerSubmitted();
                } else {
                    return this.renderStage();
                }
            } else {
                return this.renderWait();
            }
    }
}

export default TellStage;
