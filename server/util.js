  import _ from 'lodash';
  
  // Shuffling arrays:
  // https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
  export function shuffle(symbolSet) {
    for (i = symbolSet.length -1 ; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [symbolSet[i], symbolSet[j]] = [symbolSet[j], symbolSet[i]];
    }
    return symbolSet;
  }

  
  export function getNeighbors(structure, player) {
    const neighbors = [];
    let network = structure.split(",");
    const playerIndex = player.get("nodeId");

    network.forEach((n) => {
      const connection = n.split("-");

      if (playerIndex === parseInt(connection[0])) {
        neighbors.push(parseInt(connection[1].replace(/\s/g, '')));
      } else if (playerIndex === parseInt(connection[1])) {
        neighbors.push(parseInt(connection[0].replace(/\s/g, '')));
      }
    });
  
    return [... new Set(neighbors)];
  }

  export function getPuzzles(game, round) {
    const allRoles = round.get("allRoles");
    const numAdvisorsPerPair = game.treatment.numAdvisorsPerPair;

    for (let team of allRoles) {
      const {speaker, listener, availableAdvisors, chosenAdvisors} = team;

      const symbolPool = ["t1", "t2", "t3", "t4", "t5", "t6", "t7","t8","t9","t10","t11","t12"];
      const puzzleSet = [];
      for (let i = 0; i < 3; i++) { //TODO: Update with symbolSetSize
        var randomSymbol = symbolPool[_.random(symbolPool.length-1)];
        var removedSymbol = _.remove(symbolPool, (s) => s === randomSymbol);
        puzzleSet.push(randomSymbol);
      }
      const puzzleAnswer = puzzleSet[_.random(puzzleSet.length-1)];


      // Set puzzle and puzzle answer to each pair and each speaker/listener player
      const speakerPlayer = game.players.find((p) => p.get("nodeId") === speaker);
      const listenerPlayer = game.players.find((p) => p.get("nodeId") === listener);
      team.puzzleSet = puzzleSet;
      team.puzzleAnswer = puzzleAnswer;
      speakerPlayer.round.set('puzzleSet', puzzleSet);
      listenerPlayer.round.set('puzzleSet', puzzleSet);
      listenerPlayer.round.set('adviceReceived', {});
      speakerPlayer.round.set('puzzleAnswer', puzzleAnswer);
      listenerPlayer.round.set('puzzleAnswer', puzzleAnswer);
      listenerPlayer.round.set('adviceReceived', {});

      const advisorPool = [...availableAdvisors];
      for (let i = 0; i < numAdvisorsPerPair; i++) {
        var randomAdvisor = advisorPool[_.random(advisorPool.length-1)];
        var usedAdvisor = _.remove(advisorPool, (p) => p === randomAdvisor);
        chosenAdvisors.push(randomAdvisor);
      }
      listenerPlayer.round.set("chosenAdvisors", chosenAdvisors);

    }
    round.set("allRoles", allRoles);
  }


  export function randomizeRoles(game, round, structure, numSLPairs, reqMutual) {
    // Player pool contains nodeId of all players in game
    const playerPool = [];
    for (var i = 1; i <= game.players.length; i++) {
      playerPool.push(i);
    }

    let network = structure.split(",");

    const speakerListenerPairs = [];
    const allRolesPerRound = [];
    while (speakerListenerPairs.length < numSLPairs) {
      var slPair = network[_.random(network.length-1)].split("-");
      var randomNum = Math.round(Math.random());
      var speakerId = parseInt(slPair[randomNum]);
      var listenerId = parseInt(slPair[1-randomNum]);

      // If speaker-listener pair not chosen yet, remove them from pool and add the pair 
      if (playerPool.includes(speakerId) && playerPool.includes(listenerId)){
        var removedSpeakerId = _.remove(playerPool, (id) => id === speakerId);
        var removedListenerId = _.remove(playerPool, (id) => id === listenerId);
        speakerListenerPairs.push({speaker: speakerId, listener: listenerId, availableAdvisors: [], chosenAdvisors: []})

        // Set the role and their respective pair in player fields
        const speakerPlayer = game.players.find((p) => p.get("nodeId") === speakerId);
        const listenerPlayer = game.players.find((p) => p.get("nodeId") === listenerId);
        speakerPlayer.round.set("role", "Speaker");
        speakerPlayer.round.set("pairedListener", listenerId);
        listenerPlayer.round.set("role", "Listener");
        listenerPlayer.round.set("pairedSpeaker", speakerId);
      }
    }
    
    for (let pair of speakerListenerPairs) {
      const {speaker, listener, availableAdvisors, chosenAdvisors} = pair;
      const speakerNeighbors = game.players.find((p) => p.get("nodeId") === speaker).get("neighbors");
      const listenerNeighbors = game.players.find((p) => p.get("nodeId") === listener).get("neighbors");
      for (let advisor of playerPool) {
        const advisorPlayer = game.players.find((p) => p.get("nodeId") === advisor);
        if (reqMutual) {
          if (speakerNeighbors.includes(advisor) && listenerNeighbors.includes(advisor)) {
            availableAdvisors.push(advisor);
            if (advisorPlayer.round.get("role") === "None") {
              advisorPlayer.round.set("role", "Advisor");
              advisorPlayer.round.set("requestQueue", []);
              advisorPlayer.round.set("completedRequests", []);
            }
          } 
        } else {
          if (listenerNeighbors.includes(advisor)) {
            availableAdvisors.push(advisor);
            if (advisorPlayer.round.get("role") === "None") {
              advisorPlayer.round.set("role", "Advisor");
              advisorPlayer.round.set("requestQueue", []);
              advisorPlayer.round.set("completedRequests", []);
            }
          }
        }
      }
      const listenerPlayer = game.players.find((p) => p.get("nodeId") === listener);
      listenerPlayer.round.set("availableAdvisors", availableAdvisors);
      listenerPlayer.round.set("chosenAdvisors", []);
      allRolesPerRound.push(pair);
    }

    console.log(allRolesPerRound);
    round.set("allRoles", allRolesPerRound);
    
  }

  export function assignRequestsToAdvisors(game, round) {
    const allRolesPerRound = round.get("allRoles");
    for (let team of allRolesPerRound) {
      const {speaker, listener, availableAdvisors, chosenAdvisors} = team;
      for (let advisor of chosenAdvisors) {
        const advisorPlayer = game.players.find((p) => p.get("nodeId") === advisor);
        const requestQueue = advisorPlayer.round.get("requestQueue");
        const speakerPlayer = game.players.find((p) => p.get("nodeId") === speaker);
        const symbolDescription = speakerPlayer.round.get("symbolDescription");
        const puzzleSet = team.puzzleSet;
        const request = {requestorId: listener, puzzleSet: puzzleSet, symbolDescription: symbolDescription, received: false}

        requestQueue.push(request);
        advisorPlayer.round.set("requestQueue", requestQueue);
      }
    }

  }

  export function checkToGoNextStage(allPlayers, role) {
    let allSimilarRoleSubmitted = true;

    allPlayers.forEach((player) => {
      if (player.round.get("role") === role) {
        allSimilarRoleSubmitted = player.get("submitted") && allSimilarRoleSubmitted;
      }
    })

    if (allSimilarRoleSubmitted) {
      allPlayers.forEach((player) => {
        player.stage.submit();
      })
    }
  }

  export function checkCorrect(allPlayers) {
    for (let pair of round.get("allRoles")) {
      const {speaker, listener, availableAdvisors, chosenAdvisors} = pair;
      // If 
    }
  }