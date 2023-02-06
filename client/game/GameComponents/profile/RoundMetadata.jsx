import React from "react";

import "../../../../public/css/profiletab.css";

export default class RoundMetadata extends React.Component {
  renderProfile() {
    const { player, game } = this.props;
    const role = player.round.get("role");
    const pairedSpeakers = role === "Advisor" ? player.round.get("pairedSpeakers") : player.round.get("pairedSpeaker");
    const pairedListeners = role === "Advisor" ? player.round.get("pairedListeners") : player.round.get("pairedListener");
    const advisors = role === "Listener" ? Object.keys(player.round.get("chosenAdvisors")) : "";
    return (
      <div className="profile-score">
        {/* <h4> Name : {player.get("anonymousName")} </h4> */}
        <h4> Role : {player.round.get("role")}</h4>
        {/* <div className="profile-tab-icon">
          <div div className="profile-icon">
            <img className={`${player.get("anonymousName").toLowerCase()}`}src={`images/profile-icons/profile-${player.round.get("role").toLowerCase()}.svg`} />
          </div>
        </div> */}
      </div>
    );
  }

  renderScore() {
    const { player, game } = this.props;
    return (
      <div className="profile-score">
        <h4>Earnings: <span>{(game.get("score") || 0).toFixed(2)}</span> </h4>
      </div>
    );
  }

  renderTrials() {
    const {stage, game} = this.props;
    const stageNum = stage.name.split(" ")[1];
    const totalTaskRounds = game.treatment.numTaskRounds;
    return (
        <h4 className="round-number-container">
            Task {stageNum} of {totalTaskRounds}
        </h4>
    )
    console.log(stage.name.split(" ")[1]);

  }

  render() {
    const { stage } = this.props;

    return (
      <div className="round-metadata-container">
        {this.renderTrials()}
        {this.renderProfile()}
        {this.renderScore()}
        {/* <Timer stage={stage} /> */}
      </div>
    );
  }
}
