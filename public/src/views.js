/**
 All dom definitions and actions
*/
var utils = require('./utils.js');
var consts = require('./consts.js');

var $ = utils.$;

//doms
var scene = $('scene');
var side = $('side');
var info = $('info');
var preview = $('preview');
var level = $('level');
var score = $('score');
var rewardInfo = $('rewardInfo');
var reward = $('reward');
var gameOver = $('gameOver');
var quitGame = $('quitGame');
var survey = $('survey');
var finalScore = $('finalScore');
var quitFinalScore = $('quitFinalScore');
var notification = $('notification');
var imageNotification = $('imageNotification');
var player = $('player');
var leftName = $('leftName');
var distributer = $('distributer');
var quitGamePlayer = $('quitGamePlayer'); 
var partnerQuitPlayer = $('partnerQuitPlayer');
var gameOverPlayer = $('gameOverPlayer');
var partnerOverPlayer = $('partnerOverPlayer');
var turn = $('turn');
var modal = $("modal");
var tetris = $("tetris");
var message = $("message");
var endPairMessage = $('endPairMessage');
var DupPlayerMessage = $('DupPlayerMessage'); 
var AIPairingMessage = $('AIPairingMessage');
var AIPairingImage = $('AIPairingImage');
var playCount = $("play-count");
var turnCount = $("turn-count");
var error = $("error");
// quit button.
var quitButton = $("quitButton");
var leftStatusBar = $("leftStatusBar");
var qualtlink = $("qualtlink");

//defaults
var SIDE_WIDTH = consts.SIDE_WIDTH;


/**
	Caculate the game container size
*/
var getContainerSize = function (maxW, maxH) {
	var dw = document.documentElement.clientWidth;
	var dh = document.documentElement.clientHeight;
	var size = {};
	if (dw > dh) {
		size.height = Math.min(maxH, dh);
		size.width = Math.min((size.height / 2) + SIDE_WIDTH, maxW);
	} else {
		size.width = Math.min(maxW, dw);
		size.height = Math.min(maxH, dh);
	}
	return size;

};


/**
	Layout game elements
*/
var layoutView = function (container, maxW, maxH) {
	// Code without left Status Bar 
	var size = getContainerSize(maxW, maxH);
	var st = container.style;
	st.height = size.height + 'px';
	st.width = size.width + 'px';
	st.marginTop = (-(size.height / 2)) + 'px';
	st.marginLeft = (-(size.width / 2)) + 'px';

	//layout scene
	scene.height = size.height;
	scene.width = (size.height / 2);
	var sideW = size.width - scene.width;
	side.style.width = sideW + 'px';

	if (sideW < SIDE_WIDTH) {
		info.style.width = side.style.width;
	}
	preview.width = 80;
	preview.height = 80;

	gameOver.style.width = scene.width + 'px';


	/* Code with left Status Bar 
	var leftStatusBarWidth = 150; 
	leftStatusBar.style.width = leftStatusBarWidth + "px";

	var size = getContainerSize(maxW, maxH);
	var st = container.style;
	st.height = size.height + 'px';
	st.width = size.width + leftStatusBarWidth + 'px'; 
	st.marginTop = (-(size.height / 2)) + 'px';
	st.marginLeft = (-(size.width / 2)) + 'px';

	//layout scene
	scene.height = size.height;
	scene.width = (size.height / 2);
	scene.style.left = leftStatusBarWidth + "px"; 

	var sideW = size.width - scene.width;
	side.style.width = sideW + 'px';

	if (sideW < SIDE_WIDTH) {
		info.style.width = side.style.width;
	}
	preview.width = 80;
	preview.height = 80;

	gameOver.style.width = scene.width + 'px';
	gameOver.style.left = leftStatusBarWidth+ 'px';

	quitGame.style.width = scene.width + 'px';
	quitGame.style.left = leftStatusBarWidth + 'px'; */


}


/**
	Main tetris game view
*/
var tetrisView = {

	init: function (id, maxW, maxH) {
		this.container = $(id);
		this.scene = scene;
		this.preview = preview;
		//this.btnRestart = btnRestart;
		layoutView(this.container, maxW, maxH);
		this.scene.focus();

		rewardInfo.addEventListener('animationEnd', function (e) {
			rewardInfo.className = 'invisible';
		});
	},
	// Update the score 
	setScore: function (scoreNumber) {
		console.log("setScore", scoreNumber);
		score.innerHTML = scoreNumber;
		score.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
	},
	// Update the finnal score
	setFinalScore: function (scoreNumber) {
		console.log("set final score");
		finalScore.innerHTML = scoreNumber;
	},

	setQuitFinalScore: function(scoreNumber) {
		quitFinalScore.innerHTML = scoreNumber;
	},
	// Update the level
	setLevel: function (levelNumber) {
		level.innerHTML = levelNumber;
	},
	// Update the extra reward score
	setReward: function (rewardScore) {
		if (rewardScore > 0) {
			reward.innerHTML = rewardScore;
			rewardInfo.className = 'fadeOutUp animated';
		} else {
			rewardInfo.className = 'invisible';
		}
	},
	// Set game over view
	setGameOver: function (isGameOver) {
		console.log("set game over", isGameOver);
		survey.style.display = isGameOver ? 'block' : 'none';
		if (isGameOver == true) {
			tetris.style.display = 'none';
		}
	},

	setQuitGame: function(isGameOver) {
		survey.style.display = isGameOver ? 'block': 'none';
		if (isGameOver == true) {
			tetris.style.display = 'none';
		}
	}, 

	setPlayer: function (playerName) {
		player.innerHTML = playerName;
		player.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
		player.style.display = 'none';
		leftName.style.display = 'none';
	},

	setDistributer: function(dist) {
		distType = "";
		if (dist ==0 ) {
			distType = "Aritificial Intelligence"; 
		} else {
			distType = "MTurk Worker";
		}
		distributer.innerHTML = distType;
		distributer.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
	},

	setQuitGamePlayer: function (playerName, partnerName) {
		quitGamePlayer.innerHTML = playerName;
		partnerQuitPlayer.innerHTML = partnerName; 
		player.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
	},

	setGameOverPlayer: function (playerName, partnerName) {
		gameOverPlayer.innerHTML = playerName;
		partnerOverPlayer.innerHTML = partnerName; 
		player.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
	},
	
	setTurn: function (playerName,currentTurn) {

		if (playerName == 0 && currentTurn == 0){
			console.log('DistributerTurn  EOIHOAJ')
			turn.innerHTML = 'Distributer';
		}

		else if (playerName  == currentTurn){
			turn.innerHTML = 'Your Turn';

		}else {
			turn.innerHTML = "Other Player";
		}
		turn.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
		turn.style.color = '#40bfc1';
	},
	setQualtLink: function (playerName,partnerName,is_AI,distribution) {
		distribution_var = '';
		if (distribution == 0){
			distribution_var = "50/50";
		} else{
			distribution_var = "90/10";
		}


		dist_new='';

		if (is_AI == 0){
			dist_new= "AI";

		} else {
			dist_new = "Human";
		}

	},


	setPlayCount: function (count) {
		playCount.innerHTML = count;
		playCount.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
	},
	setTurnCount: function (count) {
		turnCount.innerHTML = count;
		turnCount.style.fontFamily = 'Lucida Sans Unicode', 'Lucida Grande';
	},
	setPairingMessage: function (value) {
		let x = value ? 1 : 0;
		message.style.opacity = x;
		message.style.top = "50%";
		message.style.left = "50%";
	},

	setDupPlayerMessage: function(value) {
		// set Dup Player Message 
		let x = value ? 1 : 0; 
		if (value) {
			DupPlayerMessage.innerHTML = 'You can only play the game once.\
			Please contact us if there are any questions'
			DupPlayerMessage.style.opacity = x
		}
	},

	setEndPairingMessage: function(value) {
		let x = value ? 1 : 0;
		endPairMessage.style.opacity = x; 
		endPairMessage.style.top = "50%"; 
		endPairMessage.style.left = "50%";
	},
	
	setNotification: function (text) {
		notification.innerHTML = text;
		notification.style.opacity = 1;
		setTimeout(function () {
			document.getElementById("notification").style.opacity = 0;
		}, consts.WAIT_TIME * 2000);
	},
/*
	setNotification: function (number,Ai_Human) {
		//notification.innerHTML = text;
		//Ai_Human == 0 => Ai
		//Ai_Human == 1 => Human

		//number == 1 =>your turn
		//number ==0 => partner's turn
		if(Ai_Human == 0){

			if (number ==0){
			imageNotification.innerHTML = "<img src=\"../images/AI_PartnerTurn.png\" id=\"imageNotification\">";
		} else {
			imageNotification.innerHTML = "<img src=\"../images/Ai_YourTurn.png\" id=\"imageNotification\">";

		}


		} else{
			if (number ==0){
			imageNotification.innerHTML = "<img src=\"../images/Human_PartnerTurn.png\" id=\"imageNotification\">";
		} else {
			imageNotification.innerHTML = "<img src=\"../images/Human_YourTurn.png\" id=\"imageNotification\">";


		}
	}
		
		imageNotification.style.opacity = 1
		setTimeout(function () {
			console.log("entering set")
			var imageId = document.getElementById("imageNotification").style.opacity = 0
		}, consts.WAIT_TIME * 1500);
	}, */

	setDecideNotification: function (text) {
		notification.innerHTML = text; 
		notification.style.opacity = 1;
		setTimeout(function () {
			document.getElementById("notification").style.opacity = 0;
		}, consts.WAIT_TIME * 2000);
	},

	setAIPairingImage: function(is_AI) {
		if (is_AI ==0){
			AIPairingMessage.innerHTML = '<font size = "5"> <u> The Distributer is a(n) Artificial Intelligence... Please Wait for Game to Start </u> </font>'
			AIPairingImage.innerHTML = "<img src=\"../images/AI_Distributer.png\" id=\"AIPairingImage\">"
		} else {
			AIPairingMessage.innerHTML = '<font size = "5"> <u> The Distributer is a(n) MTurk Worker... Please Wait for Game to Start </u> </font>'
			AIPairingImage.innerHTML = "<img src=\"../images/MTurkWorker_Distributer.png\" id=\"AIPairingImage\">"
		}

		AIPairingImage.style.opacity = 1 
	},
	
	setImageNotification: function(is_AI) {
		// logic to check whether the ai or human decision-maker is randomly assigned
		if (is_AI ==1){

			imageNotification.innerHTML = "<img src=\"../images/human_decisionmaking.png\" id=\"imageNotification\">";
		} else {
		 	imageNotification.innerHTML = "<img src=\"../images/ai_decisionmaking.png\" id=\"imageNotification\">";
		}

		imageNotification.style.opacity = 1
		setTimeout(function () {
			console.log("entering set")
			var imageId = document.getElementById("imageNotification").style.opacity = 0
		}, consts.WAIT_TIME * 2000);
	},

	hideModal: function () {
		modal.style.display = "none";
	},
	showTetris: function(){
		tetris.style.display = "flex";
		//setTimeout(function () => {console.log("hello")}, 1000);
	},

	activateQuitButton: function(){
		console.log("enter activate quitButton");
    	quitButton.style.display = "none";
    	function displayBtn() {
    		quitButton.style.display = "inline";
		}
		// time used for developement purposes
		//setTimeout(displayBtn, 2000);
		// actual time used for production purposes 5 minutes
		setTimeout(displayBtn, 1); //300000 - 5 mins, 420000 - 7 min
	}
};

module.exports = tetrisView;