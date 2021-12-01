var utils = require('./utils.js');
var consts = require('./consts.js');
var socketFunc = require('./socket.js');
var shapes = require('./shapes.js');
var views = require('./views.js');
var canvas = require('./canvas.js');

/**
	Init game matrix
*/
var initMatrix = function (rowCount, columnCount) {
	var result = [];
	for (var i = 0; i < rowCount; i++) {
		var row = [];
		result.push(row);
		for (var j = 0; j < columnCount; j++) {
			row.push(0);
		}
	}
	return result;
};

/**
  Clear game matrix
*/
var clearMatrix = function (matrix) {
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			matrix[i][j] = 0;
		}
	}
};

/**
	Check all full rows in game matrix
	return rows number array. eg: [18,19];
*/
var checkFullRows = function (matrix) {
	var rowNumbers = [];
	for (var i = 0; i < matrix.length; i++) {
		var row = matrix[i];
		var full = true;
		for (var j = 0; j < row.length; j++) {
			full = full && row[j] !== 0;
		}
		if (full) {
			rowNumbers.push(i);
		}
	}
	return rowNumbers;
};

/**
	Remove one row from game matrix. 
	copy each previous row data to  next row  which row number less than row;
*/
var removeOneRow = function (matrix, row) {
	var colCount = matrix[0].length;
	for (var i = row; i >= 0; i--) {
		for (var j = 0; j < colCount; j++) {
			if (i > 0) {
				matrix[i][j] = matrix[i - 1][j];
			} else {
				matrix[i][j] = 0;
			}
		}
	}
};
/**
	Remove rows from game matrix by row numbers.
*/
var removeRows = function (matrix, rows) {
	for (var i in rows) {
		removeOneRow(matrix, rows[i]);
	}
};

/**
	Check game data to determin wether the  game is over
*/
var checkGameOver = function (matrix) {
	var firstRow = matrix[0];
	for (var i = 0; i < firstRow.length; i++) {
		if (firstRow[i] !== 0) {
			return true;
		};
	}
	return false;
};


/**
	Calculate  the extra rewards add to the score
*/
var calcRewards = function (rows) {
	// if (rows && rows.length > 1) {
	// 	return Math.pow(2, rows.length - 1) * 100;
	// }
	return 0;
};

/**
	Calculate game score
*/
var calcScore = function (rows) {
	if (rows && rows.length) {
		switch (rows.length) {
			case 1:
				return 40;
				break;
			case 2:
				return 100;
				break;
			case 3:
				return 300;
				break;
			case 4:
				return 1200;
				break;
			default:
				return 0;
		}
	}
	return 0;
};

/**	 
	Check if the inactive and active pieceves are the same 
*/
var checkSame = function (active, inactive) {
	return (JSON.stringify(active) === JSON.stringify(inactive));
}


/**
	Calculate time interval by level, the higher the level,the faster shape moves
*/
// var calcIntervalByLevel = function (level) {
// 	return consts.DEFAULT_INTERVAL; //In order to return default interval - (level - 1) * 60;
// };


// Default max scene size
var defaults = {
	maxHeight: 500,
	maxWidth: 900
};

/**
	Tetris main object definition
*/
function Tetris(id, socket, options) {
	/** Configuration fields */
	this.id = id; // container Id (from index.html)
	this.MAX_TURNS = 200; // game end condition (turnCount == MAX_TURNS)
	this.config = utils.extend(options, defaults); // game config for accessing maxWidth and maxHeight
	/** per-game based fields */
	this.gameId = options.gameId || ""; // game id assigned in the beginning
	this.playerName = options.playerName; // player name
	views.setPlayer(this.playerName);
	this.socket = socket; // socket object
	/** per-turn based fields */
	this.currentTurn = this.playerName; // name of the player playing current turn
	this.turnCount = 0; // number of times turn changed
	this.nextPlayerId  = 0; // the next player's socketId 
	/** per-block based fields */
	this.playCount = 0; // number of times either player played a block
	this.suggestionTaken = 0; // number of times current player has taken the suggestion made by the inactive player during this turn
	this.playersTally = null; // object that records players' game playing (key-inputs used, etc)
	this.interval = consts.DEFAULT_INTERVAL; // time interval used to drop the active shape by one row 
	this.ghostShapeInterval = consts.DEFAULT_GHOST_INTERVAL; // time interval used to drop the ghost shape by one row 
	views.init(this.id, this.config.maxWidth, this.config.maxHeight);
	canvas.init(views.scene, views.preview);
	this.matrix = initMatrix(consts.ROW_COUNT, consts.COLUMN_COUNT);
	/** etc */
	this.resetCount = 0; // number of times the matrix gets cleaned out bc a block touched the top of the matrix
	this.init();
}

Tetris.prototype = {

	init: function (options) {
		console.log("in init");
		// Ask to join the game
		// how to check whether the player is a previousy played person or not. 
		this.socket.emit("checkPlayer", {
			playerName: this.playerName
		});

		this.socket.on("confirmPlayer", (data) => {

			if (!data.duplicate) {
				console.log("PLAYER JOINED GAME", this.playerName)

				// how does this go along at this point 
				this.socket.emit("join_game", {
					socketId: socket.id,
					gameId: this.gameId,
					playerName: this.playerName
				});

			} else{
				views.setDupPlayerMessage(data.duplicate);
				console.log(" DUPLICATED DATA ", data.duplicate)
			}
		})


		// Receive response for its join-room request
		this.socket.on("join_room_ack", (data) => {
			console.log("JOINED ROOM ACK", data);
			console.log("join_room_ack :: " + data.joinedGame + " :: gameId ::" + data.gameId);
			this.gameId = data.gameId;
			this.playersTally = data.playersTally;
			this.shapeList = [];
			this.timeList = [];
			this.is_AI = 0;
			this.nextPlayerId = data.currentSocketId;

			console.log("this.nextplayerid join", this.nextPlayerId);

			if (!data.joinedGame) {
				views.setPairingMessage(true);
				setTimeout(() => {
					views.setEndPairingMessage(true); 

					// end pairing message 
					this.socket.emit("end_pair", {
						end_pair: true
					})

				}, 600000 );
			} else {
				views.setPairingMessage(false);

				this.is_AI = data.is_AI;

				if (this.is_AI == 0) {
					views.setAIPairingImage(false); 
				} else {
					views.setAIPairingImage(true); 
				}

				setTimeout(() => {
					views.hideModal();
					views.showTetris();
				}, 10000); //10000 change

				// activate the button 
				views.activateQuitButton();
				// partner name and current player name
				if (data.players[0].playerName == this.playerName) {
					this.partnerName = data.players[1].playerName;
				} else {
					this.partnerName = data.players[0].playerName;
				}
				//remove if you want IDs to show  

				//views.setQuitGamePlayer(this.playerName, this.partnerName); 
				//views.setGameOverPlayer(this.playerName, this.partnerName);
				views.setQualtLink(this.playerName, this.partnerName, this.is_AI)

			}

			if (data.currentTurn && data.joinedGame) {

				this.currentTurn = data.currentTurn;
				// pair not matched in 5 minutes
				if (this.isMyTurn()) {
					views.setNotification(1,this.is_AI);//your turn
					this._fireShape();
				} else {
					views.setNotification(0,this.is_AI);//other player's turn
				}

				views.setTurn(this.currentTurn,this.playerName);

				this.reset();
				this._initEvents();
				setTimeout(() => {
					console.log("Game Resume");
					this.turnStart = new Date().getTime();
					this.roundStart = this.turnStart;

					if (this.isMyTurn()) {
						this.running = true;
						this._refresh();
					} else {
						this.running = false;
					}
				}, consts.WAIT_TIME * 1000); 
			}
		})

		//GAME STATE
		this.socket.on("state", (data) => {
			this._setStatePayload(data);
			this._draw();
		});

		// Emitted by the inactive player after moving its ghost piece
		this.socket.on('ghostShapeMoved', (data) => {
			this._moveGhostShape(data);
			this._draw();
		});

		// Players listen to see if anyone presses the quit button
		this.socket.on('quit game', (data) => {
			this.gameOver(false);
			this._draw();
		});

		//TURN CHANGED
		this.socket.on("turn_change", (data) => {
			console.log("Game Freeze");
	
			this.shapeList = [];
			this.timeList = [];
			// this.pause();
			console.log("turn_change :: " + this.currentTurn);
			this.playCount = data.playCount;
			this.turnCount = data.turnCount;
			this.nextPlayerId = data.nextPlayerId;
			views.setTurnCount(this.turnCount);
			
			// Ghost movements are updated to database whenever a turn changes
			if (!this.isMyTurn()) {
			this.socketEmit("record_ghost_movement", {
				gameId: this.gameId,
				playersTally: this.playersTally,
				ghostPlayer: this.playerName,
				turnCount: this.turnCount,
				playCount: this.playCount
				})
			} 

			this.playersTally = data.playersTally;

			//changing current players last score to zero
			console.log("play Count in the game", this.playCount);

			console.log("TURN:::::::::playerName :: " + this.playerName + ", playCount :: " + this.playCount + ", currentTurn ::" + this.currentTurn);

			views.setImageNotification(this.is_AI);
			views.setDistributer(this.is_AI);
			views.setTurn(0,0);


			setTimeout(() => {
				console.log("Game Resume");
				this.turnStart = new Date().getTime();
				this.currentTurn = data.currentTurn;
				views.setTurn(this.currentTurn,this.playerName);

				if (this.isMyTurn()) {
					this.running = true;
					this._refresh();
					views.setNotification("YOUR TURN"); 
					} else {
					this.running = false;
					views.setNotification("OTHER PLAYER'S TURN"); 
				}
			}, consts.WAIT_TIME * 3000);

			this.suggestionTaken = 0;

		})
		//TURN STATE
		this.socket.on("turn_state", (data) => {
			console.log(data)
			this.currentSuggestionTaken = 0 
			this.playersTally = data.playersTally;
			this.playCount = data.playCount;
			console.log("TURN_STATE:::::::::playCount :: " + this.playCount);
		})
		//DISOCNNECT ACK
		this.socket.on("disconnect_ack", (data) => {
			console.log(data)
			if (data.disconnect) {
				views.setNotification("Other player left please start a new game");
				this.pause();
			}
		});
	},

	//Reset game
	reset: function () {
		console.log("RESET");
		this.running = false;
		this.isGameOver = false;
		this.level = 1;
		this.score = 0;
		this.startTime = new Date().getTime();
		this.currentTime = this.startTime;
		this.individualScore = 0;
		//this.prevTime = this.startTime;
		//this.levelTime = this.startTime;
		clearMatrix(this.matrix);
		//setLevel(this.level);
		views.setScore(this.score);
		views.setGameOver(this.isGameOver);

		this._draw();
	},

	//Start game
	start: function () {
		console.log("in start");
		this.running = true;
		window.requestAnimationFrame(utils.proxy(this._refresh, this));
		if (this.isMyTurn()) {
			this.socketEmit(this._getStatePayload());
		}
	},

	//Pause game
	pause: function () {
		this.running = false;
		this.currentTime = new Date().getTime();
		this.prevTime = this.currentTime;
		this.prevGhostUpdateTime = this.currentTime;
		if (this.isMyTurn()) {
			this.socketEmit("state", this._getStatePayload());
		}
	},

	// game finishes from a player pressing the quit button
	// NOTE: this is not the routine that gets called when MAX_TURN has reached
	gameOver: function (notifyOtherPlayers) {
		this.running = false; 
		this.isGameOver = true; 
		views.setQuitFinalScore(this.score);
	 	views.setQuitGame(this.isGameOver);
	 	// notify other players that the game is over.
		if (notifyOtherPlayers) {
			this.socketEmit("quit game", this._getStatePayload())
		}
	},

	//isMyTurn =>
	isMyTurn: function () {
		return (this.playerName === this.currentTurn);
	},

	//state Payload
	_getStatePayload: function () {
		let currState = {
			gameId: this.gameId,
			playerName: this.playerName,
			currentTurn: this.currentTurn,
			matrix: this.matrix,
			running: this.running,
			isGameOver: this.isGameOver,
			shape: this.shape,
			preparedShape: this.preparedShape,
			//level: this.level,
			interval: this.interval,
			ghostShapeInterval: this.ghostShapeInterval,
			score: this.score,
			startTime: this.startTime,
			resetCount: this.resetCount
			//levelTime: this.levelTime
		}
		if (consts.USE_GHOST_SHAPE) currState.ghostShape = this.ghostShape
		return currState;
	},
	// set state payload
	_setStatePayload: function (data) {
		console.log("Inside Set State");

		this.matrix = data.matrix || this.matrix;
		if (this.running != data.running) {
			this.running = data.running;
			if (this.running) {
				this.start();
			}
		}

		this.isGameOver = data.isGameOver || this.isGameOver;
		//Shape
		if (this.shape) this.shape.updateShape(data.shape);
		else this.shape = shapes.generateShape(data.shape);

		//prepared Shape
		if (this.preparedShape) this.preparedShape.updateShape(data.preparedShape);
		else this.preparedShape = shapes.generateShape(data.preparedShape); //TODO: This else branch is never called. 
		canvas.drawPreviewShape(this.preparedShape);

		//first ghost
		if (!this.ghostShape) this.ghostShape = shapes.generateShape(data.shape);

		//change level in view on level change
		// if (this.level != data.level) {
		// 	this.level = data.level;
		// 	views.setLevel(this.level);
		// }

		// this.interval = data.interval || this.interval;
		if (this.score != data.score) {
			this.score = data.score;
			views.setScore(this.score);
		}
		this.score = data.score || this.score;
	
		this.resetCount = data.resetCount || this.resetCount;

		//this.levelTime = data.levelTime || this.levelTime;
	},

	// The active player calls this when inactive player has moved his ghost piece
	_moveGhostShape: function (data) {
		console.log("in moveGhostShape");
		this.ghostShape.updateShape(data.ghostShape);
	},

	//socketEmit()
	socketEmit: function (event, message) {
		this.socket.emit(event, message);
	},


	// All key event handlers
	_keydownHandler: function (e) {
		var matrix = this.matrix;
		var myTurn = this.isMyTurn();
		if (!e) {
			var e = window.event;
		}
		if (this.isGameOver || !this.shape || document.activeElement.id === "textInput") {
			return;
		}

		// active player key input control
		if (myTurn) {
			switch (e.keyCode) {
				case 37: {
					if (!this.running) return;
					if (this.shape.canLeft(matrix)) {
						this.playersTally[this.socket.id].buttons.left += 1; //add to the left tally
					}
					this.shape.goLeft(matrix);
					this._draw();
				}
				break;
			case 39: {
				if (!this.running) return;
				if (this.shape.canRight(matrix)) {
					this.playersTally[this.socket.id].buttons.right += 1; //add to the right tally
				}
				this.shape.goRight(matrix);
				this._draw();
			}
			break;
			case 38: {
				if (!this.running) return;
				this.shape.rotate(matrix);
				this.playersTally[this.socket.id].buttons.rotate += 1; //add to the rotate tally
				this._draw();
			}
			break;
			case 40: {
				if (!this.running) return;
				if (this.shape.canDown(matrix)) {
					this.playersTally[this.socket.id].buttons.down += 1; //add to the down tally
					if (this.isMyTurn) {
						this.score += 1;
						this.individualScore +=1; 

						console.log("soft drop score = " + this.score);
					}
				}
				this.shape.goDownBut(matrix);
				this._draw();
			}
			break;
			//pause - remove 'p' functionality
			// case 80: {
			// 	if (this.running) {
			// 		this.pause();
			// 	} else {
			// 		this.start();
			// 	}
			// 	this._draw();
			// }
			// break;
			case 32: {
				if (!this.running) return;
				if (this.shape.canDown(matrix)) {
					this.playersTally[this.socket.id].buttons.bottom += 1;
				} //add to the bottom tally

				matrixBottom = this.shape.goBottom(matrix);
				this.score += matrixBottom; 
				this.individualScore += matrixBottom;
				views.setScore(this.score);

				console.log("drop score matrixBottom = " + matrixBottom);
				console.log("drop score = " + this.score);
				this._update();
			}
			break;
			}
		}

		// key event handlers for the inactive player (control over the ghost piece is allowed)
		else {
			if (consts.USE_GHOST_SHAPE) {
				switch (e.keyCode) {
					case 37: {
						if (!this.running) return;
						if (this.ghostShape.canLeft(matrix)) {
							this.playersTally[this.socket.id].ghostButtons.left += 1; //add to the left tally
						}
						this.ghostShape.goLeft(matrix);
						this._draw();
					}
					break;
				case 39: {
					if (!this.running) return;
					if (this.ghostShape.canRight(matrix)) {
							this.playersTally[this.socket.id].ghostButtons.right += 1; //add to the right tally
						}
					this.ghostShape.goRight(matrix);
					this._draw();
				}
				break;
				case 38: {
					if (!this.running) return;
					this.playersTally[this.socket.id].ghostButtons.rotate += 1; //add to the rotate tally	
					this.ghostShape.rotate(matrix);
					this._draw();
				}
				break;
				case 40: {
					if (!this.running) return;
					if (this.ghostShape.canDown(matrix)) {
							this.playersTally[this.socket.id].ghostButtons.down += 1; //add to the dowm tally
						}
					this.ghostShape.goDownBut(matrix);
					this._draw();
				}
				break;
				case 32: {
					if (!this.running) return;
					if (this.ghostShape.canDown(matrix)) {
							this.playersTally[this.socket.id].ghostButtons.bottom += 1; 
						}
					this.ghostShape.goBottom(matrix);
					this._update();
				}
				break;
				}
			}
		}
		if (this.isMyTurn()) {
			this.socketEmit("state", this._getStatePayload());
		} else {
			if (consts.USE_GHOST_SHAPE) {
				this.socketEmit("ghostShapeMoved", this._getStatePayload());
				// this.socketEmit("state", this._getStatePayload());
			}
		}

	},

	// Restart game
	_restartHandler: function () {
		this.reset();
		this.start();
	},
	// Bind game events
	_initEvents: function () {
		window.addEventListener('keydown', utils.proxy(this._keydownHandler, this), false);
		//views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
	},


	// Fire a new random shape
	_fireShape: function () {
		console.log("in fireshape");
		this.shape = this.preparedShape || shapes.generateShape(); //changed
		if (consts.USE_GHOST_SHAPE) {
			this.ghostShape = shapes.generateShape(this.shape); //ghostShape is always equal to our main piece;
		}
		if (this.isMyTurn()) {
			this.preparedShape = shapes.generateShape(); //changed
		}
		this._draw();
		this.socketEmit("state", this._getStatePayload());
		this.socketEmit("ghostShapeMoved", this._getStatePayload());
		canvas.drawPreviewShape(this.preparedShape);
	},

	// Draw game data
	_draw: function () {
		canvas.drawScene();
		canvas.drawShape(this.shape, this.isMyTurn(), isGhost = false);

		// update GhostShape if shapes not equal
		if (this.ghostShape!== undefined && this.ghostShape.flag !== this.shape.flag) {
			console.log("Ghost Shape and Main Shape not Equal");
			this.ghostShape = shapes.generateShape(this.shape);
		}

		canvas.drawShape(this.ghostShape, this.isMyTurn(), isGhost = true); // drawShape just returns when ghost shape feature is off.
		canvas.drawMatrix(this.matrix, this.isMyTurn());
	},
	// Refresh game canvas
	_refresh: function () {
		if (!this.running) {
			return;
		}

		this.currentTime = new Date().getTime();
		//	console.log("refresh :: " + (this.currentTime - this.prevTime > this.interval));
		if (this.currentTime - this.prevTime > this.interval) {
			this._update();
			this.prevTime = this.currentTime;
			//this._checkLevel();
		}

		if (this.currentTime - this.prevGhostUpdateTime > this.ghostShapeInterval) {
			this._updateGhostShape();
			this.prevGhostUpdateTime = this.currentTime;
		}

		if (!this.isGameOver) {
			window.requestAnimationFrame(utils.proxy(this._refresh, this));
		}
	},

	// update ghost shape
	_updateGhostShape: function () {
		if (!this.isMyTurn() && consts.USE_GHOST_SHAPE && this.ghostShape.canDown(this.matrix)) {
			this.ghostShape.goDown(this.matrix);
			this.socketEmit("ghostShapeMoved", this._getStatePayload());
		}
		this._draw();
	},

	// Update game data
	_update: function () {
		if (this.isMyTurn()) {
			if (this.shape.canDown(this.matrix)) {

				this.shape.goDown(this.matrix);
			} else {
				// Trying to debug
				// This is needed because when a block lands, 
				// We want to pause the game ASAP and disallow any more incoming keyboard inputs
				this.pause();
				this.shape.copyTo(this.matrix);
				if (consts.USE_GHOST_SHAPE) {
					var ghostm = this.ghostShape.shapeLoc(this.matrix);
					var activem = this.shape.shapeLoc(this.matrix);
					if (checkSame(activem, ghostm)) this.suggestionTaken += 1;
				}

				this.roundEnd = new Date().getTime();
				
				this.shapeList.push(this.shape.flag);
				var addedShape = this.shape.flag;

				this.timeList.push(this.roundEnd - this.roundStart);
				this.roundStart = this.roundEnd;

				//update turnCount here!
				this.turnCount +=1;  

				// update each players turn
				this.playersTally[this.nextPlayerId].totalTurns +=1;

				//timeList gets updated two 2 when there is an update in reset count
				if (this.timeList.length ==2 ) {
					this.timeList = this.timeList.slice(0,1);
				}

				// this.currentTurn 
				this._check();
				this._fireShape();
				this.socketEmit("block_landed", {
					gameId: this.gameId,
					playerName: this.playerName,
					currentShape: addedShape,
					suggestionTaken: this.suggestionTaken,
					currentTurn: this.currentTurn,
					nextPlayerId: this.nextPlayerId,
					playCount: this.playCount,
					turnCount: this.turnCount,
					score: this.score,
					resetCount: this.resetCount,
					playersTally: this.playersTally,
					turnStart: this.turnStart,
					shapeList: this.shapeList,
					turnEnd: new Date().getTime(),
					timeList: this.timeList,
					matrix: this.matrix, 
					maxTurns: this.MAX_TURNS

				})
				views.setTurnCount(this.turnCount);
			}
			if (this.isMyTurn()) {
				this.socketEmit("state", this._getStatePayload());
			}
		} 

		this._draw();

		let endGame = checkGameOver(this.matrix);
		if (this.turnCount < this.MAX_TURNS) {
			if (this.isMyTurn() && endGame === true) {
				clearMatrix(this.matrix);

				this.resetCount = this.resetCount + 1;
				this.socketEmit("game_reset", this._getStatePayload());
			}
		} else {
			endGame = true;
			this.isGameOver = endGame;
			views.setGameOver(this.isGameOver);
		}

		if (this.isGameOver) {
			views.setFinalScore(this.score);
		}
	},
	// Check and update game data
	_check: function () {
		var rows = checkFullRows(this.matrix);
		if (rows.length) {
			removeRows(this.matrix, rows);
			var score = calcScore(rows);
			var reward = calcRewards(rows);
			this.score += score + reward;
			this.playersTally[this.socket.id].totalScore += (score + reward);
			this.playersTally[this.socket.id].lastScore += (score + reward);
			views.setReward(reward);
		}
		// score calculation including the row and soft drop and harddrop;
		this.playersTally[this.socket.id].lastScore += this.individualScore;
		this.individualScore  = 0;
		views.setScore(this.score);
	},

	// Check and update game level
	// _checkLevel: function () {
	// 	var currentTime = new Date().getTime();
	// 	if (currentTime - this.levelTime > consts.LEVEL_INTERVAL) {
	// 		this.level += 1;
	// 		this.interval = calcIntervalByLevel(this.level);
	// 		views.setLevel(this.level);
	// 		this.levelTime = currentTime;
	// 	}
	// }
}


window.Tetris = Tetris;