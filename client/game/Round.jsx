import React from "react";

import PlayerProfile from "./PlayerProfile.jsx";
import SocialExposure from "./SocialExposure.jsx";
import Task from "./Task.jsx";
import ShowStage from "./TaskStages/ShowStage.jsx";
import TellStage from "./TaskStages/TellStage.jsx";
import ListenStage from "./TaskStages/ListenStage.jsx";



export default class Round extends React.Component {
  render() {
    const { round, stage, player, game } = this.props;

    return (
      <div className="round">
        <div className="content">
          <PlayerProfile player={player} stage={stage} game={game} />
          { stage.displayName == "Show" && <ShowStage {...this.props}/> }
          { stage.displayName == "Tell" && <TellStage {...this.props}/> }
          { stage.displayName == "Listen" && <ListenStage {...this.props}/>}
          <SocialExposure stage={stage} player={player} game={game} />
        </div>
      </div>
    );
  }
}
