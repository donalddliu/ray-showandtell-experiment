import React from "react";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import { Centered } from "meteor/empirica:core";

import "../../public/css/intro.css";


const Radio = ({ selected, name, value, label, playerIsOnline, onChange }) => (
    <label className="questionnaire-radio">
        <input
        className="quiz-button"
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={onChange}
        />
        {label} {playerIsOnline ? "" : " (offline)"}
    </label>
);

export default class MidSurveyOne extends React.Component {
  state = { };

  handleChange = event => {
    const { player } = this.props;

    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

  };

  handleSubmit = event => {
    const { onNext, player, stage } = this.props;
    const currentSurveyStage = player.round.get("surveyStageNumber");

    event.preventDefault();
    // TODO: log player response to survey question
    player.round.set(`survey_${currentSurveyStage}`, this.state);
    stage.append("log", {
        verb: `survey_${currentSurveyStage}`,
        subjectId: player.id,
        object: this.state,
        at: moment(TimeSync.serverTime(null, 1000)),
    })

    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

    onNext();
  };

  render() {
    const { game, round, stage, player } = this.props;
    const { response } = this.state;

    const recentSLConnections =  player.get("recentSLConnections");

    const currentSurveyStage = player.round.get("surveyStageNumber");
    const completedWidth = 590/5 * currentSurveyStage
    const uncompletedWidth = 590 - completedWidth;
    const offset = 590/5 * 0.5;
    const stageNumPosition = completedWidth - offset;
    return (
      <Centered>
        <div className="intro-heading questionnaire-heading"> To complete the challenge, please fill in the following questionnaire </div>
            <div className="questionnaire-content-container">
                <div className="progress-bar">
                    <div className="completed-bar">
                        <div className="completed-heading" style={{marginLeft: stageNumPosition }}> {currentSurveyStage} </div>
                        <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="7px" />
                    </div>
                    <img src={`images/hr-color-dark.png`} width={`${uncompletedWidth} px`} height="7px" />
                </div>
                <div className="questionnaire-body">
                    <label className="questionnaire-question"> Did your group have a leader? If so, who?</label>
                    {recentSLConnections.map(otherNodeId => {
                        const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
                        const otherPlayerId = otherPlayer.get("anonymousName");
                        const playerIsOnline = !otherPlayer.get("inactive");

                        return (
                            <Radio
                                selected={response}
                                key={otherPlayerId}
                                name="response"
                                value={otherPlayerId}
                                label={otherPlayerId}
                                playerIsOnline={true}
                                onChange={this.handleChange}
                            />
                        )
                        })
                    }
                    <Radio
                        selected={response}
                        name="response"
                        value="myself"
                        label="Myself"
                        playerIsOnline={true}
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="team"
                        label="We worked as a team"
                        playerIsOnline={true}
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="none"
                        label="Our team did not have a leader"
                        playerIsOnline={true}
                        onChange={this.handleChange}
                    />
                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!response} type="submit"> Submit </button> 
                </form>
            </div>
      </Centered>
    );
  }
}
