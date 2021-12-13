// This file allows the players to talk to one another

const uuidv1 = require('uuid/v1');
const Game = require("../models/Game");
const TurnEntry = require("../models/TurnEntry");
const Message = require("../models/Message");
const Player = require("../models/Player");
const TurnEntryA = require("../models/TurnEntryAnalysis");
const BlockEntry = require("../models/BlockEntryAnalysis");
const QuitGame = require("../models/QuitGame");
const GhostPieceMovement = require("../models/GhostPieceMovement");
var consts = require('../public/src/consts');

//Handle New Connection
const newConnection = function (socket, io, options) {
    console.log("Socket ID :: " + socket.id);
    // CHECK PLAYER 
    socket.on("checkPlayer", (data) => checkPlayer(socket, io, data, options));

    //JOIN_GAME
    socket.on("join_game", (data) => {
        joinRoom(socket, io, data, options)
    });
    //STATE
    socket.on("state", (data) => braodcastState(socket, io, data, options));
    //Ghost piece movement
    socket.on("ghostShapeMoved", (data) => braodcastGhostShapeMove(socket, io, data, options));
    //DISCONNECTION
    socket.on('disconnect', (data) => disconnect(socket, io, data, options));
    //TURN_CHANGE
    socket.on("block_landed", (data) => blockLandedHandler(socket, io, data, options));
    //RESET EVENT
    socket.on("game_reset", (data) => resetHandler(socket, io, data, options));
    //SEND MESSAGE
    socket.on('chat message', (data) => messageHandler(socket, io, data, options));
    //QUIT BUTTON
    socket.on("quit game", (data) => quitGameHandler(socket, io, data, options));
    //GHOST PIECE MOVEMENT
    socket.on('record_ghost_movement', (data) => ghostMovementHandler(socket, io, data, options));
}
// GHOST PIECE MOVEMENT 
function ghostMovementHandler(socket,io, data, options) {

        let {
        players,
        games,
        MAX_GAME_PLAYERS,
        NUM_PLAYS
    } = options;

    var gamePlayers = games[data.gameId];

    if (!(data.playCount % NUM_PLAYS)) {
    let recordGhostPiece = new GhostPieceMovement({
        gameId: data.gameId, 
        ghostPlayer: data.ghostPlayer,
        turnCount: data.turnCount, 
        playerTurns: [], 
        ghostLeft: [], 
        ghostRotate: [],
        ghostRight: [], 
        ghostDown: [], 
        ghostBottom:[]
    })

    gamePlayers.forEach((player) => {
        let {
            socketId
        } = player;
        recordGhostPiece.playerTurns.push(data.playersTally[socketId].totalTurns);

        recordGhostPiece.ghostLeft.push(data.playersTally[socketId].ghostButtons.left);
        recordGhostPiece.ghostRight.push(data.playersTally[socketId].ghostButtons.right);
        recordGhostPiece.ghostBottom.push(data.playersTally[socketId].ghostButtons.bottom);
        recordGhostPiece.ghostRotate.push(data.playersTally[socketId].ghostButtons.rotate);
        recordGhostPiece.ghostDown.push(data.playersTally[socketId].ghostButtons.down);
        });
    //put into DB
    recordGhostPiece.save();
    }
}



// QUIT GAME
function quitGameHandler(socket, io, data, options) {
    socket.broadcast.to(data.gameId).emit("quit game", data);

    var quitTime = new Date().getTime() - data.startTime; // interval from the startTime until they decide to quit. 
    // player who quit the game. 
    let quit_game = new QuitGame({
        gameId: data.gameId, 
        quitPlayer: data.playerName,
        currentPlayer: data.currentTurn, 
        quitTime: quitTime
    })
    // put into db
    quit_game.save();
}

//SEND MESSAGE 
function messageHandler(socket, io, data, options) {
    // display msg to players' screens
    io.in(data.gameId).emit('chat message', {
        senderName: data.senderName,
        msg: data.msg
    });
    // create new message object
    let new_msg = new Message({
        gameId: data.gameId,
        senderName: data.senderName,
        senderSocketId: socket.id,
        message: data.msg
    })
    // put into db
    new_msg.save();
}

//CHECK DUPLICATE PLAYER 

function checkPlayer(socket, io, data, options) {
   // retrieve the data from gamaes.  
   console.log("CEHCKS THE PLAYER", data.playerName)

   query = {player: data.playerName}
 
   var hello = Player.find(query, function (err, arr) {
       if (arr.length >0 ) {
           socket.emit("confirmPlayer", {
            duplicate: true })

       } else {
           socket.emit("confirmPlayer", {
            duplicate: false })
       }
   })
} 


//JOIN ROOM
function joinRoom(socket, io, data, options) {
    let {
        players,
        games,
        MAX_GAME_PLAYERS,
    } = options;
    console.log("Players Length :: " + players.length);



    var player = {
        playerName: data.playerName,
        socket: socket
    } 

    //Add to waiting players list
    players.push(player);

    // delete the player here. 
    socket.on("end_pair", (data) => {
        if (data.end_pair) {
            players.pop()
        }

    })

    if (players.length == MAX_GAME_PLAYERS) {


        // add each of the playuers in the db 

        players.forEach(player => {
       // add player to player db 
         let playerObj = new Player({
             player: player.playerName
         })
         // save to player dat\abase 
         playerObj.save()
        })

        let uniqueGameId = uuidv1();
        data.gameId = uniqueGameId;

        //decide whether 90/10 or 50/50
        var randVar = Math.round(Math.random());
        console.log("CREATING RANDVAR", randVar);

        var gamePlayers = [];
        var playersTally = {};

        players.forEach(player => {
            console.log("joined")
            playersTally[player.socket.id] = {
                playerName: player.playerName,
                gameId: uniqueGameId,
                totalScore: 0,
                lastScore: 0,
                totalTurns: 0,
                buttons: {
                    left: 0,
                    right: 0,
                    down: 0,
                    bottom: 0,
                    rotate: 0,
                }, 
                ghostButtons: {
                    left: 0,
                    right: 0,
                    down: 0,
                    bottom: 0,
                    rotate: 0,
                }
            }
            player.socket.join(uniqueGameId);
            let gamePlayer = {
                playerName: player.playerName,
                socketId: player.socket.id
            };
            gamePlayers.push(gamePlayer);
        });

        // Creating game instance for DB
        // Random is_AI distribution
        //var is_AI = Math.round(Math.random()); 
        var is_AI = 0;
        var decisisonMaker = " ";
        if (is_AI ==0) {
            decisionMaker = "AI";
        } else {
            decisionMaker = "Human";
        }

        let gameObj = new Game({
            gameId: uniqueGameId,
            players: gamePlayers,
            is_AI: decisionMaker
        })

        gameObj.save(); // saving data to db.

        games[data.gameId] = gamePlayers;

        // Reset Options
        options.players = [];

        var currentTurn = gamePlayers[0].playerName;
        var currentPlayerSocketId = gamePlayers[0].socketId;
        
        // quit button activation
        let quitButtonActivate = true; 

        io.in(uniqueGameId).emit("join_room_ack", {
            is_AI: is_AI,
            joinedGame: true,
            gameId: data.gameId,
            status: "paired",
            turnCount: 0,
            currentTurn: currentTurn,
            currentSocketId: currentPlayerSocketId,
            playersTally: playersTally,
            players: gamePlayers, //changed
            quitButtonActivate: quitButtonActivate, //let the quitButton be activated at the same time.
            randVar:randVar // distribution 90/10 or 50/50
        })

    } else {
        socket.emit("join_room_ack", {
            joinedGame: false,
            status: "waiting"
        });
    }
}


//BROADCAST GAME STATE
function braodcastState(socket, io, data) {
    //console.log("DATA FROM :: " + data.playerName + ", currentTurn :: " + data.currentTurn);
    socket.broadcast.to(data.gameId).emit("state", data);
}

//BROADCAST ghost piece movement
function braodcastGhostShapeMove(socket, io, data) {
    socket.broadcast.to(data.gameId).emit("ghostShapeMoved", data);
}

//DISCONNECT
function disconnect(socket, io, data, options) {
    let {
        players,
        games
    } = options;
    let socketId = socket.id;
    for (var i = 0; i < players.length; i++) {
        if (players[i].socket.id == socket.id) {
            players.splice(i, 1);
        }
    }
    let disconnectGameId;
    for (var gameId in games) {
        let players = games[gameId]
        players.forEach((player) => {
            if (player.socketId == socketId) {
                //deleting game from games
                delete games[gameId];
                disconnectGameId = gameId;
                //Removing All Players from room
                //console.log(games);
            }
        });
    }
    socket.leave();
    io.in(disconnectGameId).emit("disconnect_ack", {
        disconnect: true
    })

    console.log("disconnected");
}

//BLOCK LANDED
function blockLandedHandler(socket, io, data, options) {
    var {
        NUM_PLAYS,
        games,
        players,
        MAX_GAME_PLAYERS,
        MAX_SCORE
    } = options;

    var gamePlayers = games[data.gameId];
    //console.log(gamePlayers);
    data.playCount  = data.turnCount;
    console.log("Data.playCOUNT", data.playCount);


    // turn change!
    if (!(data.playCount % NUM_PLAYS)) {
        console.log("TURN_COUNT :: " + data.turnCount + " RESET_COUNT :: " + data.resetCount + " TIME :: " + (data.turnEnd - data.turnStart));
        let nextPlayerId = null;
    
        //update the data in the db
        var turnDataObj = {
            currentTurn: data.currentTurn,
            gameId: data.gameId,
            players: [], 
            turnCount: data.turnCount,
            resetCount: data.resetCount,
            time: data.turnEnd - data.turnStart
        }
        gamePlayers.forEach((player) => {
            let {
                socketId
            } = player;
            turnDataObj.players.push(data.playersTally[socketId]);
        });

        //Updating Game object from db
        let turnEntry = new TurnEntry(turnDataObj);
        turnEntry.save();

        var turnObj = {
            currentTurn: data.currentTurn,
            nextPlayerId: data.nextPlayerId,  
            gameId: data.gameId,
            playerRowScore: [],
            playerScore: [],
            playerTurns: [],
            turnCount: data.turnCount,
            resetCount: data.resetCount,
            left: [],
            right: [],
            bottom: [],
            rotate: [],
            down: [],
            time: data.turnEnd - data.turnStart,
            suggestionTaken: data.suggestionTaken,
            shapeList: data.shapeList,
            currentShape: data.currentShape, 
            timeList: data.timeList,
            matrix: data.matrix
        }
        gamePlayers.forEach((player) => {
            let {
                socketId
            } = player;
            turnObj.playerTurns.push(data.playersTally[socketId].totalTurns);
            turnObj.playerRowScore.push(data.playersTally[socketId].totalScore);
            turnObj.playerScore.push(data.playersTally[socketId].lastScore);

            turnObj.left.push(data.playersTally[socketId].buttons.left);
            turnObj.right.push(data.playersTally[socketId].buttons.right);
            turnObj.bottom.push(data.playersTally[socketId].buttons.bottom);
            turnObj.rotate.push(data.playersTally[socketId].buttons.rotate);
            turnObj.down.push(data.playersTally[socketId].buttons.down);
        });
        //Updating Game object from db
        console.log("before entering db", data.turnCount);
        console.log("before entiring db", data.nextPlayerId);
        let turnEntryA = new TurnEntryA(turnObj);
        turnEntryA.save();


        console.log("Player's Total Turns", turnObj.playerTurns);

        if ((data.turnCount < MAX_GAME_PLAYERS) || !(consts.USE_TURN_CALC)) {
            console.log("Total game turns :: " + data.turnCount + " index " + (data.turnCount) % MAX_GAME_PLAYERS);

            // Randomize but equal distribution
            if (consts.USE_RANDOM_CALC){
                nextPlayerId = randomCalculator(turnObj, MAX_GAME_PLAYERS, data);

            // Precomputed List
            } else if (consts.USE_LIST_CALC) {
                nextPlayerId =  precomputeTurn(data, gamePlayers, MAX_GAME_PLAYERS);

            } else if (consts.USE_CONSTRAINT_CALC) {
                console.log("WHAT IS RANDVAR", data.randVar)

                if (data.randVar == 0){
                    console.log("50/50 Distribution")
                    //50/50 dist
                    // Randomize with constraints but equal distribution
                    nextPlayerId = randomConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS);
                }
                else{
                    console.log("90/10 Distribution")

                    
                    // Randomize with 90/10 constraint
                    nextPlayerId = NinetyTenConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS);
                    // Randomize with 70/30 constraint
                    //nextPlayerId = SeventyThirtyConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS);

                }
               
               
            // Each Person gets the Same Number of Turns
            } else {
                nextPlayerId = gamePlayers[((data.turnCount) % MAX_GAME_PLAYERS)].socketId;
            }
        // Algorithm Distribution
        } else {
            nextPlayerId = turnCalulator(data.playersTally, data.playCount, NUM_PLAYS, MAX_SCORE); //change this to make it a turn by turn thing
            console.log("TURN CALULATOR ON!", nextPlayerId);
        }

        // End of If Statement
        data.currentTurn = data.playersTally[nextPlayerId].playerName;
        data.nextPlayerId = nextPlayerId;

        io.in(data.gameId).emit("turn_change", data);
    } 

    // still the same active player's turn
    else {
        // if turn is 1 block based it does not get entered
        var blockObj = {
            currentTurn: data.currentTurn,
            gameId: data.gameId,
            currentPlayerScore: [],
            left: [],
            right: [],
            bottom: [],
            rotate: [],
            down: [],
            currentSuggestionTaken: data.suggestionTaken,
            currentShape: data.currentShape,
            matrix: data.matrix,
            shapeList: data.shapeList
        }

        gamePlayers.forEach((player) => {
            let {
                socketId
            } = player;
            blockObj.currentPlayerScore.push(data.playersTally[socketId].totalScore);
            blockObj.left.push(data.playersTally[socketId].buttons.left);
            blockObj.right.push(data.playersTally[socketId].buttons.right);
            blockObj.bottom.push(data.playersTally[socketId].buttons.bottom);
            blockObj.rotate.push(data.playersTally[socketId].buttons.rotate);
            blockObj.down.push(data.playersTally[socketId].buttons.down);
        });

        let blockEntry = new BlockEntry(blockObj);
        blockEntry.save();
        
        io.in(data.gameId).emit("turn_state", data);
    }
}

//TURN DECIDE RANDOM BUT 50/50 DISTRIBUTION
function randomCalculator(turnObj, MAX_GAME_PLAYERS, data) {
    //turnObj, MAX_GAME_PLAYERS, data
    var randomNumber = Math.floor(Math.random() * 10 +1); 
    var nextPlayerIdx = 0; 

    if (randomNumber % MAX_GAME_PLAYERS == 0) {
        if (turnObj.playerTurns[0] == data.maxTurns/2) {
            nextPlayerIdx = 1; 
        } else {
            nextPlayerIdx = 0;  
        }
    } else { 
        if (turnObj.playerTurns[1] == data.maxTurns/2) {
            nextPlayerIdx = 0;  
        } else {
            nextPlayerIdx = 1;  
        }
    }
    return nextPlayerId = gamePlayers[nextPlayerIdx].socketId;
}

//PRECOMPUTED TURN
function precomputeTurn (data, gamePlayers) {

    let list = [0,0,1,0,1,0,1,0,1,0,0,1,1,0,1,1,0,1,1,0,1,0,0,1,1,0,0,1,1,0,1,0,1,0,0,1
        ,0,1,1,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,1,0,0,1,1,0,0,1,0,0,1,0,1,0,1,1,0,
        1,0,0,1,0,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0,0,1,1,0,1,1,0,1,0,0
        ,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,1,0,1,1,0,1,1,0,0,1,1,0,0,1,0,0,1,0,1,0,0
        ,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,0,1,1,0,1,1,0,0,0,0,1,1,0,1,0,1];

    return nextPlayerId = gamePlayers[list[data.playCount]].socketId;
}

//RANDOM BUT WITH CONSTRAINT 50/50 DISTRIBUTION
function randomConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS) {
    let playerOne = turnObj.playerTurns[0]; 
    let playerTwo = turnObj.playerTurns[1];
    let nextPlayerIdx = 0; 

    let currentPlayer = data.currentTurn; 
    let currentPlayerIdx = 0 
    if (gamePlayers[0].playerName == currentPlayer) {
        currentPlayerIdx = 0
    } else {
        currentPlayerIdx = 1 
    }

    if (Math.abs(playerOne-playerTwo) >=2) {
        if (playerOne < playerTwo && playerOne !== data.maxTurns/2) {
            nextPlayerIdx = 0;
        } else {
            if (playerTwo !== data.maxTurns/2) {
                nextPlayerIdx = 1; 
            }
        }
    } else if (playerOne == playerTwo) {
        if (currentPlayerIdx == 0 && playerTwo !== data.maxTurns/2) {
            nextPlayerIdx = 1
        } else if (currentPlayerIdx == 1 && playerOne !== data.maxTurns/2) {
            nextPlayerIdx = 0 
            }

    } else {
        let randomNumber = Math.floor(Math.random() * 10 +1);
        console.log("randomize");
        if (randomNumber % MAX_GAME_PLAYERS == 0 && playerOne !== data.maxTurns/2) {
            nextPlayerIdx = 0;
        } else {
            if (playerTwo !== data.maxTurns/2) {
                nextPlayerIdx = 1;
            }
        }
    }

    return nextPlayerId = gamePlayers[nextPlayerIdx].socketId;; 
}


//70-30 Condition PlayerZero PlayerOne 
function SeventyThirtyConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS) {
    let playerZero = turnObj.playerTurns[0];
    let playerOne = turnObj.playerTurns[1];
    let nextPlayerId = 0;

    let currentPlayer = data.currentTurn; 
    let currentPlayerIdx = 0; 

    if (gamePlayers[0].playerName == currentPlayer) {
        currentPlayerIdx = 0;
    } else {
        currentPlayerIdx = 1;
    }

    let randomNumber = Math.round(Math.random());
    totalTurns = playerZero + playerOne; 

    if (totalTurns % 10 == 0) {
       nextPlayerId = randomNumber;
       return nextPlayerIdx = gamePlayers[nextPlayerId].socketId;
    }

    var roundTurns = Math.ceil(totalTurns/10) * 10;

    // player One 3times  
    if (randomNumber == 1) { 
        if (roundTurns/10 *3 == playerOne) {
            nextPlayerId = 0
        } else {
            nextPlayerId = 1 
        }

    //player Zero 7 turns per round 
    } else {
       if (roundTurns/10 * 7 == playerZero) {
           nextPlayerId = 1 
       } else {
           nextPlayerId = 0 
       }
    }

    return nextPlayerIdx = gamePlayers[nextPlayerId].socketId; 
} 


// 90-10 Condition playerZero: 90 condition  playerOne: 10 condition
function NinetyTenConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS) {
    let playerZero = turnObj.playerTurns[0]; 
    let playerOne = turnObj.playerTurns[1];
    let nextPlayerId = 0; 

    let currentPlayer = data.currentTurn; 
    let currentPlayerIdx = 0; 

    if (gamePlayers[0].playerName == currentPlayer) {
        currentPlayerIdx = 0;
    } else {
        currentPlayerIdx = 1;
    }

    let randomNumber = Math.round(Math.random());
    totalTurns = playerZero + playerOne; 

    if (totalTurns % 10 == 0) {
       nextPlayerId = randomNumber;
       return nextPlayerIdx = gamePlayers[nextPlayerId].socketId;
    }

    var roundTurns = Math.ceil(totalTurns/10) * 10; 
    
    // Random Number = 1 if playerone already gone once, go to player zero 
    if (randomNumber == 1) {
        if (roundTurns/10  == playerOne) {
            nextPlayerId = 0;

        } else {
            nextPlayerId = 1;

        }
    } else {
        if ((roundTurns - playerZero)  > roundTurns/10) { 
            nextPlayerId = 0;
         } else {
             nextPlayerId = 1; 
         }
    }

    return nextPlayerIdx = gamePlayers[nextPlayerId].socketId;
}

//GAME RESET
function resetHandler(socket, io, data, options) {
    socket.broadcast.to(data.gameId).emit("state", data);
}

//PROBABILITY FUNCTION
function get(input) {
    var array = [];
    for (var item in input) {
        if (input.hasOwnProperty(item)) { // Safety
            for (var i = 0; i < input[item]; i++) {
                array.push(item);
            }
        }
    }
    // Probability Fun
    return array[Math.floor(Math.random() * array.length)];
}

function turnCalulator(players, playCount, NUM_PLAYS, MAX_SCORE) {
    // players, playersScore, playersTurn, playCount, numPlayers,50/50
    let arrayIds = Object.keys(players);
    let maxTrend = Number.MIN_SAFE_INTEGER;
    let upperBound = -200;
    let maxPlayerId;
    let lowerPlayer;

    //performance learning algorithm
    for (let i = 0; i < arrayIds.length; i++) {
        let id = arrayIds[i];
        let player = players[id];
        let trend = Math.exp((-.01) * player.totalTurns);
        let delta = Math.sqrt(((2 * Math.log(playCount / NUM_PLAYS) / player.totalTurns)));
        let averageReward = ((player.totalScore / player.totalTurns) / MAX_SCORE);
        let upperBound = ((averageReward + delta)); //* trend;
        console.log("AVG_SCORE :: " + averageReward);
        if (upperBound > maxTrend) {
            maxTrend = upperBound;
            maxPlayerId = id;

        }
    }
    return maxPlayerId;
}


//SOCKET MAIN
const main = function (io) {
    var options = {
        players: [],
        games: {},
        MAX_GAME_PLAYERS: consts.NUM_PLAYERS,
        NUM_PLAYS: consts.NUM_PLAYS,
        MAX_SCORE: 300,
    }
    io.sockets.on('connection', (socket) => {
        console.log(`OPTIONS :: NUM_PLAYS :: ${options.NUM_PLAYS}, MAX_SCORE :: ${options.MAX_SCORE}`);
        newConnection(socket, io, options)
    });
}

module.exports = main;