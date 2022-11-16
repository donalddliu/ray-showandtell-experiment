import _ from "lodash";
import Empirica from "meteor/empirica:core";
import "./bots.js";
import "./callbacks.js";

import {testingRounds, taskRounds} from "./constants";
import {getNeighbors} from "./util";

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit(game => {
  const {
    treatment: {
      playerCount,
      numTaskRounds,
      numSurveyRounds,
      tellDuration,
      listenDuration,
      surveyDuration,
      networkStructure
    }
  } = game;

  let colors = ["Green", "Red", "Yellow", "Blue", "Purple", "White", "Black"]
  colors = _.shuffle(colors);


  game.players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
    player.set("nodeId", i + 1);
    player.set("neighbors", getNeighbors(networkStructure, player));
    player.set("anonymousName", colors[i]);
    console.log(player.get("neighbors"));
  });

  const numTasksPerSurvey = numTaskRounds/numSurveyRounds;
  let surveyRoundsAdded = 0;
  let taskRoundsAdded = 0;

  _.times(numTaskRounds, i => {
    const round = game.addRound();

    if (taskRoundsAdded > 0 && taskRoundsAdded % numTasksPerSurvey == 0) {

      surveyRoundsAdded++;

      round.addStage({
        name: `Survey ${surveyRoundsAdded}`,
        displayName: `Survey`,
        durationInSeconds: surveyDuration
      })

      round.set("roundType", "Survey");

    } else {
      taskRoundsAdded++;

      const tellStage = round.addStage({
        name: `Tell ${taskRoundsAdded}`,
        displayName: `Tell`,
        durationInSeconds: tellDuration
      })
  
      const listenStage = round.addStage({
        name: `Listen ${taskRoundsAdded}`,
        displayName: `Listen`,
        durationInSeconds: listenDuration
      })

      round.set("roundType", "Task");
    }
  });
});
