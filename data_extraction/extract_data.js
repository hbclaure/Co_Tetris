var fs = require('fs');
var mongoose = require('mongoose');
var Game = require("../models/Game");
var TurnEntry = require("../models/TurnEntry");
var TurnEntryA = require("../models/TurnEntryAnalysis");
var Message = require("../models/Message");
var BlockEntry = require("../models/BlockEntryAnalysis");
var GhostPieceMovement = require("../models/GhostPieceMovement")
var QuitGame = require("../models/QuitGame");
var PATH = "./data/";


async function generateGameRecords() {
  Game.find()
    .then(async function (games) {
      if (games) {
        for (let i=0; i < games.length; i++) {
          var game = games[i]; 
          var playerString = "";
          var { gameId, players, is_AI } = game;

          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            playerString += playerName + "_";
          }

          var FILENAME = playerString + "_gameInfo.csv"; 
          console.log("<----------START--------->"); 
          console.log(PATH + FILENAME); 
          var content = 'Player0, Player1, gameId, is_Ai, quitPlayer, quitTime, currentPlayer'+ '\n'; 
          // get players 
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            content += playerName + ",";
          }

          content += gameId +","; 
          content += is_AI + ","; 

          // quit game database
          await QuitGame.find({ gameId: gameId })
            .then((entries) => { 
              if (entries) {
                for (let i=0; i < entries.length; i++) {
                  var entry  = entries[i];
                  var {quitPlayer, quitTime, currentPlayer} = entry;
                  content += `${quitPlayer}, ${quitTime}, ${currentPlayer}, '\n'`;
                }
              }
            });

        console.log("game content", content)
        fs.writeFile(PATH + FILENAME, content, (err) => { if (err) console.log("error" + err) });
        console.log(content);
        content = "";
        console.log(" <--------------END------------------>");

        }
      }
    })
}


async function generateRecords() {
  Game.find()
    .then(async function (games) {
      if (games) {
        for (let i = 0; i < games.length; i++) {
          var game = games[i];
          var playerString = "";
          var { gameId, players } = game;

          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            playerString += playerName + "_";
          }

          var FILENAME = playerString + "_gameTurns.csv";
          console.log("<-------------START-------------->");
          console.log(PATH + FILENAME);
          var content = "playCount Number, Turn Count, Reset Count, Current Turn, Time, suggestionTaken, currentShape, matrix, shapeList, timeList, "
          //score
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            content += playerName + " score,";
          }
          //Row Score 
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            content += playerName + " row score,";
          }
          //Turn
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            content += playerName + " turn" + ", ";
          }
          //buttons
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            let end = (i < players.length - 1) ? "," : "\n";
            content += playerName + " left, ";
            content += playerName + " right, ";
            content += playerName + " down, ";
            content += playerName + " bottom ,";
            content += playerName + " rotate" + end;
          }

          await TurnEntryA.find({ gameId: gameId })
            .then((entries) => {
              if (entries) {
                // console.log("entries", entries)
                for (let i = 0; i < entries.length; i++) {
                  var entry = entries[i];

                  var {turnCount, playerScore, playerRowScore, playerTurns, resetCount, currentTurn, time, left, 
                    rotate, right, down, bottom, suggestionTaken, shapeList, timeList, matrix, currentShape} = entry;
                
                  content += `${i + 1}, ${turnCount}, ${resetCount}, ${currentTurn}, ${time}, ${suggestionTaken}, ${currentShape}, `;
               

                  if (matrix !== undefined){
                    matrixString = ""

                    for (let i =0; i < matrix.length; i++) {
                      for (let j =0; j < matrix[i].length; j++){
                        matrixString += matrix[i][j] + "/"
                      }
                    }
                    content += matrixString + ", " 
                    // console.log("matrix string", matrixString)
                  } 

                  shapeListString = ""
                  for (let i = 0; i < shapeList.length; i++) {
                    shapeListString += shapeList[i] + "/"
                  }
                  content += shapeListString  + ", " 


                  timeListString =""
                   for (let i = 0; i < timeList.length; i++) {
                    timeListString += timeList[i] + "/"
                  }
                  content += timeListString  + ", " 


                  for (let i = 0; i < playerScore.length; i++) {
                    content += playerScore[i] + ", ";
                  }

                  for (let i = 0; i < playerRowScore.length; i++) {
                    content += playerRowScore[i] + ", ";
                  }

                  for (let i = 0; i < playerTurns.length; i++) {
                    content += playerTurns[i] + ", ";
                  }

                  // console.log("definition of PlayerTurns.length", playerTurns.length);
                  for (let i = 0; i < playerTurns.length; i++) {
                    let end = (i < players.length - 1) ? "," : "\n";
                    content += left[i] + ", ";
                    content += right[i] + ", ";
                    content += down[i] + ", ";
                    content += bottom[i] + ", ";
                    content += rotate[i] + end;
                  }
                }
                console.log("content", content)
                fs.writeFile(PATH + FILENAME, content, (err) => { if (err) console.log("error" + err) });
                console.log(content);
                content = "";
                console.log(" <-------------- end ------------------>");
              }
            });
        }
      }
    });
}


async function generateBlockRecords(){
  console.log("Extracting block messages")
  Game.find()
    .then(async function(games){
      if (games){
        for (var i =0 ; i < games.length; i++) {
          var game = games[i];
          var { gameId, players } = game;
          var FILENAME = gameId + "_blockData.csv"; 
          console.log("<-----------START BLOCK ENTRY ------------->"); 
          console.log(PATH + FILENAME); 
          var content = "blockCountNumber, currentTurn, currentSuggestionTaken, currentShape, matrix, shapeList, " 

          // player score for current block
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            content += playerName + " score,";
          }

          // player buttons for current block
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            let end = (i < players.length - 1) ? "," : "\n";
            content += playerName + " left, ";
            content += playerName + " right, ";
            content += playerName + " down, ";
            content += playerName + " bottom, ";
            content += playerName + " rotate" + end;
          }

          await BlockEntry.find({ gameId: gameId })
            .then((entries) => {
              if (entries) {
                for (let i =0; i < entries.length; i++) {
                  var entry = entries[i];

                  var {currentTurn, currentShape, currentPlayerScore,left, 
                    rotate, right, down, bottom, currentSuggestionTaken, shapeList, matrix} = entry;
                
                  content += `${i + 1}, ${currentTurn}, ${currentSuggestionTaken}, ${currentShape},  `;

                  // matrix 
                  if (matrix !== undefined){
                    matrixString = ""
                    for (let i =0; i < matrix.length; i++) {
                      for (let j =0; j < matrix[i].length; j++){
                        matrixString += matrix[i][j] + "/"
                      }
                    }
                    content += matrixString + ", " 
                  }

                  // shapeList
                  shapeListString = ""
                  for (let i = 0; i < shapeList.length; i++) {
                    shapeListString += shapeList[i] + "/"
                  }
                  content += shapeListString  + ", " 

                  // player score 
                 for (let i = 0; i < currentPlayerScore.length; i++) {
                  content += currentPlayerScore[i] + ", ";
                  }
              
                  // player turns
                  for (let i = 0; i < 2; i++) {
                    let end = (i < players.length - 1) ? "," : "\n";
                    content += left[i] + ", ";
                    content += right[i] + ", ";
                    content += down[i] + ", ";
                    content += bottom[i] + ", ";
                    content += rotate[i] + end;
                  }
                }

                console.log("block content", content)
                fs.writeFile(PATH + FILENAME, content, (err) => { if (err) console.log("error" + err) });
                console.log(content);
                content = "";
                console.log(" <--------------END------------------>");

              }
            });
          }
        }
      });
    }

async function generateGhostPieceMovement() {
  console.log("Extracting Ghost Piece Movement");
  Game.find() 
    .then(async function (games) {
      if (games) {
        for (let i=0; i < games.length; i++) {
          var game = games[i];
          var { gameId, players } = game; 
          var playerString = "";
          for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            playerString += playerName + "_";
          }

          var FILENAME = playerString + " _ghostPieceMovement.csv"; 
          console.log("<-------------START-------------->");
          console.log(PATH + FILENAME);
          var content =  "turnCount, ghostPlayer,  " 

        // ghost buttons
        for (let i = 0; i < players.length; i++) {
            let { playerName } = players[i];
            content += playerName + " left, ";
            content += playerName + " right, ";
            content += playerName + " down, ";
            content += playerName + " bottom, ";
            content += playerName + " rotate, ";
          }

        //Turn
        for (let i = 0; i < players.length; i++) {
          let end = (i < players.length - 1) ? "," : "\n";
          let { playerName } = players[i];
          content += playerName + " turn" + end;
        }

        await GhostPieceMovement.find({ gameId: gameId })
          .then((entries) => {
            if (entries) {
              for (let i=0; i<entries.length; i++) {
                  var entry = entries[i];

                  var {ghostLeft, ghostRotate, ghostRight, ghostDown, ghostBottom, ghostPlayer,
                   turnCount, playerTurns} = entry;
                
                  content += `${i + 1}, ${ghostPlayer}, `;

                  //Ghost player buttons
                  for (let i = 0; i < players.length; i++) {
                    content += ghostLeft[i] + ", ";
                    content += ghostRight[i] + ", ";
                    content += ghostDown[i] + ", ";
                    content += ghostBottom[i] + ", ";
                    content += ghostRotate[i] + ", "; 
                  }

                //Ghost player turns
                 for (let i = 0; i < playerTurns.length; i++) {
                    let end = (i < players.length - 1) ? "," : "\n";
                    content += playerTurns[i] + end;
                  } 
                }

                console.log("ghost piece movement content", content)
                fs.writeFile(PATH + FILENAME, content, (err) => { if (err) console.log("error" + err) });
                console.log(content);
                content = "";
                console.log(" <--------------END------------------>");
              }
            });
          }
        }
      });
    }

async function generateMessageFile() {
  console.log("Extracting messages")
  Game.find()
    .then(async function (games) {
      if (games) {
        for (let i = 0; i < games.length; i++) {
          var game = games[i];
          var { gameId } = game;
          var FILENAME = gameId + "_messages.csv";
          console.log("<-------------START-------------->");
          console.log(PATH + FILENAME);
          var content = "Sender,Content,Time\n"
          await Message.find({ gameId: gameId })
            .then((messages) => {
              if (messages) {
                for (let i = 0; i < messages.length; i++) {
                  var msg = messages[i];
                  var { senderName, message, time } = msg;
                  content += `${senderName},${message},${time}\n`;
                }
                fs.writeFile(PATH + FILENAME, content, (err) => { if (err) console.log("error" + err) });
                console.log(content);
                content = "";
                console.log(" <--------------END------------------>");
              }
            });
        }
      }
    });
}

// Connect to DB and extract data 
console.log("proncess env", process.env)
console.log("process env mong uri", process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
})
  .then(() => {
    console.log("DB CONNECTED")
    if (!fs.existsSync(PATH)){
        fs.mkdirSync(PATH);
    }
    generateGameRecords();
    generateRecords();
    generateBlockRecords();
    generateMessageFile();
    generateGhostPieceMovement();
  })
  .catch(err => console.log("Error :: " + err));

