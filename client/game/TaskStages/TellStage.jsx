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
        round.set("symbolDescription", symbolDescription); 
        round.append("log", {
            verb: "symbolDescription",
            subjectId: player.id,
            object: symbolDescription,
            at: moment(TimeSync.serverTime(null, 1000)),
        })

        stage.set("submitted", true);
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
}

export default TellStage;
