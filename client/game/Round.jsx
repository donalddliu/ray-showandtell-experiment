import React from "react";

import PlayerProfile from "./PlayerProfile.jsx";
import SocialExposure from "./SocialExposure.jsx";
import Task from "./Task.jsx";
import ShowStage from "./TaskStages/ShowStage.jsx";
import TellStage from "./TaskStages/TellStage.jsx";
import ListenStage from "./TaskStages/ListenStage.jsx";
import ChooseAdvisorsStage from "./TaskStages/ChooseAdvisorsStage.jsx";
import AdvisorList from "./GameComponents/AdvisorList.jsx";

// Mid Survey Imports
import MidSurveyOne from "../mid-survey/MidSurvey1.jsx";
import MidSurveyTwo from "../mid-survey/MidSurvey2.jsx";
import MidSurveyThree from "../mid-survey/MidSurvey3.jsx";
import MidSurveyFour from "../mid-survey/MidSurvey4.jsx";
import MidSurveyFive from "../mid-survey/MidSurvey5.jsx";
import Results from "./GameComponents/results/Results.jsx";





export default class Round extends React.Component {

  renderTaskRound() {
    const { round, stage, player, game } = this.props;

    if (stage.displayName == "Result") {
      return (
        <div className="round">
          <Results {...this.props} />
        </div>
      )
    } else {
      return (
        <div className="round">
          <div className="content">
            <PlayerProfile player={player} stage={stage} game={game} />
            {/* Display the stage for each type of role */}
            { stage.displayName == "Choose" && <ChooseAdvisorsStage {...this.props} />}
            { stage.displayName == "Show" &&  <ShowStage {...this.props}/> }
            { stage.displayName == "Tell" &&  <TellStage {...this.props}/> }
            { stage.displayName == "Listen" &&  <ListenStage {...this.props}/>}
            { stage.displayName == "Listen" && player.round.get("role") == "Listener" && <AdvisorList {...this.props}/>}

            {/* Add empty advisor list column to make game symmetric */}
            { stage.displayName != "Listen" && player.round.get("role") == "Listener" && <div className="advisor-list-container"> </div>}
            { player.round.get("role") != "Listener" && <div className="advisor-list-container" > </div>}
          </div>
        </div>
      );
    }
  }

  onNextSurveyStage = () => {
    const { round, stage, player, game } = this.props;
    const currentSurveyStage = player.round.get("surveyStageNumber");
    player.round.set("surveyStageNumber", currentSurveyStage + 1);
  }

  renderSurveyRound() {
    const { round, stage, player, game } = this.props;

    const currentSurveyStage = player.round.get("surveyStageNumber");
    const surveyStageNumber = stage.name.split("_")[1]; // Survey 1_1 -> [Survey 1, 1]

    return (
      <div className="round">
        {currentSurveyStage == 1 && <MidSurveyOne {...this.props} onNext={this.onNextSurveyStage}/>}
        {currentSurveyStage == 2 && <MidSurveyTwo {...this.props} onNext={this.onNextSurveyStage}/>}
        {currentSurveyStage == 3 && <MidSurveyThree {...this.props} onNext={this.onNextSurveyStage}/>}
        {currentSurveyStage == 4 && <MidSurveyFour {...this.props} onNext={this.onNextSurveyStage}/>}
        {currentSurveyStage == 5 && <MidSurveyFive {...this.props}/>}
      </div>
    )
  }


  render() {
    const { round, stage, player, game } = this.props;

    if (stage.displayName == "Survey") {
      return (
        this.renderSurveyRound()
      )
    }  else {
      return (
        this.renderTaskRound()
      )
    }
  }
}
