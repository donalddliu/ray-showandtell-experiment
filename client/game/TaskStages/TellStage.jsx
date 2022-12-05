import React, { Component } from 'react';
import SymbolDisplay from '../GameComponents/SymbolDisplay';

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

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

        return(
            puzzleSet.map((symbol) => {
                return (
                    <SymbolDisplay
                        key={symbol}
                        name={symbol}
                        selected={puzzleAnswer === symbol ? "selected" : ""}
                        {...this.props}
                    />
                )
            })
        )
    }

    renderStage() {
        const {symbolDescription} = this.state;

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
                    <form className="task-description-form-container" onSubmit={this.handleSubmit}>
                        <input
                            className="task-description-form"
                            id="symbolDescripition"
                            name="symbolDescription"
                            value={symbolDescription}
                            onChange={this.handleChange}
                            required
                        />
                    </form>
                </div>
                
            </div>
        );
    }

    renderSpeakerSubmitted() {
        return (
            <div className="task-response-container">
                <div className="task-response-header">
                    <header> Please wait until all Speakers have described their symbol </header>
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
