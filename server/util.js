  import _, { update } from 'lodash';

  function updateRecentSLConnections(player, connectionId) {
    const recentSLConnections = new Set(player.get("recentSLConnections"));
    recentSLConnections.add(connectionId);
    player.set("recentSLConnections", [...recentSLConnections]);
  }

  function updateAllRecentConnections(player, connectionId) {
    const allRecentConnections = new Set(player.get("allRecentConnections"));
    allRecentConnections.add(connectionId);
    player.set("allRecentConnections", [...allRecentConnections]);
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
      listenerPlayer.round.set('puzzleSet', _.shuffle(puzzleSet));
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
      // Randomly pick a connection from the total network
      var slPair = network[_.random(network.length-1)].split("-");
      // Randomly assign one of the two players in the connection to speaker and the other to listener
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

        // Add SL pair to each player's recent sl connections (no advisors)
        updateRecentSLConnections(speakerPlayer, listenerId);
        updateRecentSLConnections(listenerPlayer, speakerId);

        // Add SL pair to eahc player's overall recent connections (will include advisors)
        updateAllRecentConnections(speakerPlayer, listenerId);
        updateAllRecentConnections(listenerPlayer, speakerId);

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
        const speakerColor = speakerPlayer.get("anonymousName");
        const symbolDescription = speakerPlayer.round.get("symbolDescription");
        const listenerPlayer = game.players.find((p) => p.get("nodeId") === listener);
        const listenerColor = listenerPlayer.get("anonymousName");

        const listenerPuzzleSet = listenerPlayer.round.get("puzzleSet");
        // const puzzleSet = team.puzzleSet;
        const request = {requestorId: listener, requestorColor: listenerColor, speakerId: speaker, speakerColor: speakerColor, puzzleSet: listenerPuzzleSet, symbolDescription: symbolDescription, received: false}

        requestQueue.push(request);
        advisorPlayer.round.set("requestQueue", requestQueue);

        // Add advisors to player's recent connections
        // updateRecentSLConnections(speakerPlayer, advisor);
        // updateRecentSLConnections(listenerPlayer, advisor);

        // updateRecentSLConnections(advisorPlayer, speaker);
        // updateRecentSLConnections(advisorPlayer, listener);

        // Add SL pair to each player's overall recent connections (will include advisors)
        updateAllRecentConnections(listenerPlayer, advisor);
        updateAllRecentConnections(advisorPlayer, listener);
      }
    }

    // Shuffle the request queue
    game.players.forEach((player) => {
      if (player.round.get("role") === "Advisor") {
        const requestQueue = player.round.get("requestQueue");
        const shuffledRequestQueue = _.shuffle(requestQueue);
        player.round.set("requestQueue", shuffledRequestQueue);
      }
    })
  }

  export function assignPassiveOutcomes(game, round) {
    const numAdvisorsPerPair = game.treatment.numAdvisorsPerPair;
    const allRolesPerRound = round.get("allRoles");
    const allPairs = []
    for (let team of allRolesPerRound) {
      const {speaker, listener, availableAdvisors, chosenAdvisors} = team;

      allPairs.push({speaker: speaker, listener: listener});
    }

    // Get a random shift to shift the elements of allPairs
    // allPairs[i] and allPairsShifted[i:numAdvisorsPerPair] correlate to the passive outcomes
    const shift = _.random(numAdvisorsPerPair, allPairs.length-1);
    const allPairsShifted = allPairs.slice(-shift).concat(allPairs.slice(0,-shift)) // Shift numbers to the right

    console.log("Compare pairs and shifted pairs");
    console.log(shift);
    console.log(allPairs);
    console.log(allPairsShifted);
    const passiveOutcomes = {}

    for (const [i, pair] of allPairs.entries()) {
      passiveOutcomes[pair] = []
      console.log("Pair")
      console.log(pair);
      for (const j of Array(numAdvisorsPerPair).keys()) {
        passiveOutcomes[pair].push(allPairsShifted[(i+j) % allPairs.length]);
        console.log("Passive Outcomes");
        console.log(allPairsShifted[(i+j) % allPairs.length]);
      }
    }

    for (let team of allRolesPerRound) {
      const {speaker, listener, availableAdvisors, chosenAdvisors} = team;

      const pair = {speaker: speaker, listener: listener};
      const speakerPlayer = game.players.find((p) => p.get("nodeId") === speaker);
      const listenerPlayer = game.players.find((p) => p.get("nodeId") === listener);
      team.passiveOutcomes = passiveOutcomes[pair];
      speakerPlayer.round.set("passiveOutcomes", passiveOutcomes[pair]);
      listenerPlayer.round.set("passiveOutcomes", passiveOutcomes[pair]);

    }

    round.set("allRoles", allRolesPerRound);

  }

  export function getRandomNumber(min, max) {
      return Math.random() * (max - min) + min;    
  }

  export function checkToGoNextStage(allPlayers, role) {
    let allSimilarRoleSubmitted = true;

    allPlayers.forEach((player) => {
      if (player.round.get("role") === role) {
        allSimilarRoleSubmitted = player.stage.get("submitted") && allSimilarRoleSubmitted;
      }
    })

    if (allSimilarRoleSubmitted) {
      allPlayers.forEach((player) => {
        player.stage.submit();
      })
    }
  }

  export function checkEveryoneFinishedSurvey(allPlayers, round) {
    let allSubmitted = true;
    let numPlayersSubmitted = 0;


    allPlayers.forEach((player) => {
      if (player.stage.get("submitted")) {
        numPlayersSubmitted += 1;
      }
      allSubmitted = player.stage.get("submitted") && allSubmitted;
    })

    round.set("numPlayersSubmitted", numPlayersSubmitted);

    if (allSubmitted) {
      allPlayers.forEach((player) => {
        player.stage.submit();
      })
    }
  }

  export function updateScore(game, round) {
    const prevGameScore = game.get("score");
    const scoreChanges = [];
    for (let pair of round.get("allRoles")) {
      const {speaker, listener, availableAdvisors, chosenAdvisors, puzzleSet, puzzleAnswer} = pair;

      const speakerPlayer = game.players.find((p) => p.get("nodeId") === speaker);
      const listenerPlayer = game.players.find((p) => p.get("nodeId") === listener);
      
      // If listener selects correct answer, give them points, otherwise deduct points
      let taskCorrect = false;
      if (listenerPlayer.round.get("symbolSelected") === puzzleAnswer) {
        scoreChanges.push(0.10);
        taskCorrect = true;
      } else {
        scoreChanges.push(-0.01);
      }

      // If advisor selects correct answer, give them points
      const adviceReceivedDict = listenerPlayer.round.get("adviceReceived");
      for (let [advisorId, symbolSelected] of Object.entries(adviceReceivedDict)) { // adviceDict[advisorId] = symbolSelected
        if (symbolSelected === puzzleAnswer) {
          scoreChanges.push(0.05);
        }
      }


      speakerPlayer.round.set("taskCorrect", taskCorrect);
      listenerPlayer.round.set("taskCorrect", taskCorrect);

    }

    const finalScoreChange = scoreChanges.reduce((sum,value)=> sum + value);
    console.log(scoreChanges);
    const newGameScore = Math.max(prevGameScore + finalScoreChange, 0);
    game.set("score", newGameScore);
  }