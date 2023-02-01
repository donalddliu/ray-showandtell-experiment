import React from "react";
import '../../../public/css/intro.css'

import { Centered } from "meteor/empirica:core";

export default class TutorialOverview extends React.Component {

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
              <img src={`images/tutorial-images/Overview Tutorial Circle.png`} width="100%" />
            </div>
            <div className="tutorial-info">
              <div className="intro-heading"> Overview </div>
              <img src={`images/hr-color.png`} width="180px" height="2px"/>
              <div className="tutorial-body">
                Social conventions, like driving on the right side of the road, provide a foundation for social life. Despite their importance, we know very little about how social conventions emerge, especially in the context of newly formed groups. The current experiment provides you with an opportunity to work in a group and develop a social convention, in particular a name for an abstract symbol. The task will last for multiple trials. At the beginning of each trial, you will be randomly assigned to one of three roles on a team (Speaker, Listener, Advisor). 
              </div>
            </div>
          </div>
        </Centered>
        {/* {hasPrev && <button className="arrow-button tutorial-prev-btn" type="button" onClick={onPrev} disabled={!hasPrev}>
          Previous
        </button>} */}
        
        {hasNext &&
        <button className="arrow-button tutorial-next-btn" type="button" onClick={onNext} disabled={!hasNext}>
          Next
        </button>
        }
      </div>
    );
  }
}
