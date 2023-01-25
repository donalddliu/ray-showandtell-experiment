import React from "react";
import '../../../public/css/intro.css'

import { Centered } from "meteor/empirica:core";

export default class TutorialProfile extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, game } = this.props;

    return (
      <div className="tutorial-container">
        <div className="title-static-image">
          <img src={`images/title-tut3.png`} />
        </div>
        <Centered>
          <div className="two-col">
            <div className="tutorial-static-image">
              <img src={`images/tut3-slide2.png`} width="100%" />
            </div>
            <div className="tutorial-info">
              <div className="intro-heading"> THIS IS MY PROFILE </div>
              <img src={`images/hr-color.png`} width="180px" height="2px"/>
              <div className="tutorial-body">
                On the left hand of the screen, there will be a profile section that describes your player card. Under “Name”, you will have a designated color throughout the game in which people can refer to you by. For each trial, your new role will be listed under “Role”. Your total score accumulated through this game will be displayed under “Total Score”. Lastly, there is a timer for each stage in the trial. If the timer reaches 0, you will automatically move onto the next stage.              </div>
            </div>
          </div>
        </Centered>
        {hasPrev && <button className="arrow-button tutorial-prev-btn" type="button" onClick={onPrev} disabled={!hasPrev}>
          Previous
        </button>}
        
        {hasNext &&
        <button className="arrow-button tutorial-next-btn" type="button" onClick={onNext} disabled={!hasNext}>
          Next
        </button>
        }
      </div>
    );
  }
}
