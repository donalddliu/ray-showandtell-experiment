import React from "react";

import PlayerProfile from "./PlayerProfile.jsx";
import SocialExposure from "./SocialExposure.jsx";
import Task from "./Task.jsx";
import ShowStage from "./TaskStages/ShowStage.jsx";
import TellStage from "./TaskStages/TellStage.jsx";
import ListenStage from "./TaskStages/ListenStage.jsx";
import ChooseAdvisorsStage from "./TaskStages/ChooseAdvisorsStage.jsx";
import AdvisorList from "./GameComponents/AdvisorList.jsx";



export default class Round extends React.Component {
  render() {
    const { round, stage, player, game } = this.props;

    return (
      <div className="round">
        <div className="content">
          <PlayerProfile player={player} stage={stage} game={game} />
          { stage.displayName == "Choose" && <ChooseAdvisorsStage {...this.props} />}
          { stage.displayName == "Show" &&  <ShowStage {...this.props}/> }
          { stage.displayName == "Tell" &&  <TellStage {...this.props}/> }
          { stage.displayName == "Listen" &&  <ListenStage {...this.props}/>}
          { stage.displayName == "Listen" && player.round.get("role") == "Listener" && <AdvisorList {...this.props}/>}
        </div>
        <div>
          {/* { stage.displayName == "Listen" &&  <SocialExposure {...this.props}/>} */}

        </div>
      </div>
    );
  }
}
