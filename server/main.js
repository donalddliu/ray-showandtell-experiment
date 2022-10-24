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
      showDuration,
      tellDuration,
      listenDuration,
      chooseDuration,
      networkStructure
    }
  } = game;


  game.players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
    player.set("nodeId", i + 1);
    player.set("neighbors", getNeighbors(networkStructure, player));
    console.log(player.get("neighbors"));
  });

  _.times(numTaskRounds, i => {
    const round = game.addRound();

    // const {symbols, taskName, answer} = testingRounds[0];
    // round.set("answer", answer);
    // round.set("symbolSet", symbols);

    // const showRound = round.addStage({
    //   name: `Show ${i}`,
    //   displayName: `Show`,
    //   durationInSeconds: showDuration
    // });

    const tellRound = round.addStage({
      name: `Tell ${i}`,
      displayName: `Tell`,
      durationInSeconds: tellDuration
    })

    const listenRound = round.addStage({
      name: `Listen ${i}`,
      displayName: `Listen`,
      durationInSeconds: listenDuration
    })
  });
});
