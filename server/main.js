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
      resultsDuration,
      passiveResultsDuration,
      networkStructure,
      slReward,
      slPenalty,
      advisorReward,
      passiveMode,      
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
    player.set("inactive", false);
    const imageHistory = new Array(1500).fill(1.0);
    player.set("imageHistory", imageHistory);
  });

  game.set("inactivePlayers", []);
  game.set("networkArray", networkStructure.split(","));

  // const numTasksPerSurvey = numTaskRounds/numSurveyRounds;
  // let surveyRoundsAdded = 0;
  let taskRoundsAdded = 0;

  _.times(numTaskRounds, i => {
    const taskRound = game.addRound();

    taskRoundsAdded++;
    const tellStage = taskRound.addStage({
      name: `Tell ${taskRoundsAdded}`,
      displayName: `Tell`,
      durationInSeconds: tellDuration
    })

    const listenStage = taskRound.addStage({
      name: `Listen ${taskRoundsAdded}`,
      displayName: `Listen`,
      durationInSeconds: listenDuration
    })

    const resultStage = taskRound.addStage({
      name: `Result  ${taskRoundsAdded}`,
      displayName: `Result`,
      durationInSeconds: resultsDuration,
    })

    if (passiveMode) {
      const passiveStage = taskRound.addStage({
        name: `Passive ${taskRoundsAdded}`,
        displayName: `Passive`,
        durationInSeconds: passiveResultsDuration,
      })
    }

    taskRound.set("roundType", "Task");


    // if (taskRoundsAdded > 0 && taskRoundsAdded % numTasksPerSurvey == 0) {

    //   const surveyRound = game.addRound();
    //   surveyRoundsAdded++;

    //   surveyRound.addStage({
    //     name: `Survey ${surveyRoundsAdded}`,
    //     displayName: `Survey`,
    //     durationInSeconds: surveyDuration
    //   })

    //   surveyRound.set("roundType", "Survey");

    // } 

  });
});
