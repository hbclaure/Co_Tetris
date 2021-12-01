# Fairness Games- Collaborative Tetris
Co-Tetris is a Collaborative Tetris Game for understanding fairness in human-agent teams.  
The game is played by two players whom are logged into the system at the same time.

This is authored by Houston Claure, Se Yun Kim, Winnice Hui, Obinna Abbi, Hyun Kyo Jung and Malte Jung (PI) at Cornell University. 
[Members from USC] 

### Game Visuals 

<p align = "center">
<img src="public/images/player1.gif" width="300"> <img src="public/images/player2.gif" width="300">
<br>Player 1  & Player 2  </br>
</p>


### Online Link 
The URL of Co-Tetris:
```
cooptetris.herokuapp.com
```

## Set-up

### Requirements
1. Node.js & NPM <br>
https://nodejs.org/en/download/ <br> 
https://www.npmjs.com/get-npm
2. Heroku CLI (if deploying to herokuapp)  <br>
https://devcenter.heroku.com/articles/heroku-cli#download-and-install

### Installation
1. Clone repository onto local machine.
2. Navigate to local respository folder 'Final_Tetris_Jan2020' in Terminal.
3. Create .env file in top folder of local repository. <br> 
Copy the following into the .env file. <br> 
#Mongo DB connection information <br> 
MONGO_URI  = mongodb+srv://hbclaure:Tetrisgame123@cluster0-uygx4.mongodb.net/collab_tetris_dev?retryWrites=true&w=majority
4. Install dependencies by running  "npm install"

### Heroku Set-up (for deployment purposes)
1. Sign in to Heroku account. You may use below information, or your own account.  <br>
If you are using your own account, make sure you have collaborator access to 'cooptetris'. <br> 
      Run: "heroku login"  <br>
      Username: hbclaure@gmail.com  <br>
      Password: Tetrisgame123  
Make sure to download heroku dependencies https://devcenter.heroku.com/articles/heroku-cli
2. Add remote to local repository.  <br>
      Run: "heroku git:remote -a cooptetris"
3. Check that the heroku remote has 4 outputs.  <br>
      Run: "git remote -v"

### Run Project Locally
1. Navigate to respository folder 'Final_Tetris_Jan2020' in Terminal.
2. Run: "npm run dev". 
3. Navigate to "localhost:5000" on local web browser. You should be able to see the application running locally on your machine.

## Pushing Edits

### To push edits to Github respository: 
1. Add files you would like to push, or run: "git add ."
2. Run: "git commit -m "commit-message""
3. Run: "git push"

### To push edits to HEROKU SERVER:
1. Push edits to github repository (above).
2. Run: "git push heroku master". This pushes code from local repository's master branch to heroku remote.  

## Changing Constants and Variables
 
### [ Update 09/26/2021- Seyun ] Change Turn Taking Condition 
1. Navigate to ./socket/socket.js 
2. Go to function blockLandedHandler  
3. Only change the nextPlayerId (uncomment/comment based on the desired distributing setting) Example is currently set to randomize with constraints meaning 50/50 setting but the order of the player during each turn is randomized. Constraint includes ensuring that the 50/50 distribution remains consistent at different points during the game. This constraint ensures that the resources are not focused to just one player during the beginning of the game. 

              else if (consts.USE_CONSTRAINT_CALC) {
               // Randomize with constraints but equal distribution
               nextPlayerId = randomConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS);
               // Randomize with 90/10 constraint
              //nextPlayerId = NinetyTenConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS);
               // Randomize with 70/30 constraint
               //nextPlayerId = SeventyThirtyConstraint(turnObj, gamePlayers, data, MAX_GAME_PLAYERS);

4. Ensure to 'git push origin master' 
5. Ensure to push to heroku through "git push heroku master" 

### Changing Algorithm constant
1. Navigate to ./socket/socket.js
2. function turnCalulator() do the changes then repeate the above steps to run it. 

### Changing User variables
1. Navigate to ./public/src/consts.js
2. Change the variables as you see fit.<br>
Note: Don't forget the semicolon (;) at the end!

## Tetris game fields not related to DB fields 
### configuration (set in consts.js or index.html)
<b>id:</b> the id of the main div element in index.html<br>
<b>config:</b> tuple containing maxHeight and maxWidth<br>
<b>MAX_TURNS:</b> game ends when <b>turnCount</b> == <b>MAX_TURNS</b> <br>

### per-game based fields (set in the beginning of the game)
<b>gameId:</b> game id assigned in the beginning <br>
<b>playerName:</b> player name <br>
<b>socket:</b> socket object for this player <br>

### per-turn based fields (updated every turn)
<b>turnCount:</b> number of times turn changed <br>
<b>currentTurn:</b> name of the player playing current turn<br>

### per-block based fields (updated every block-land)
<b>playCount:</b> number of times either player played a block <br>
<b>suggestionTaken:</b> number of times current player has taken the suggestion made by the inactive player during this turn <br>
<b>playersTally:</b> object that records players' game playing (key-inputs used, etc) <br>
<b>matrix:</b> current status of the game board. it is represented as a 20 by 10 2D array. 0 represents empty cell and a string of hexadecimal color value represents a filled cell. <br>
<b>turnStart:</b> JavaScript Date object representing the moment this turn (just the current block) started <br>
<b>isGameOver:</b> boolean indicating game over status <br>
<b>level:</b> level <br>
<b>interval:</b> time interval used to drop the active shape by one row <br>
<b>score:</b> score <br>
<b>shape:</b> shape object for the active shape <br>
<b>preparedShape:</b> shape object for the prepared shape <br>
<b>ghostShape:</b> shape object for the ghost shape <br>
<b>startTime:</b> (Deprecated) seems to indicate start time of the game, but seems deprecated. It isn't deleted as some commented out codes use it. <br>
<b>currentTime:</b> JavaScript Date object representing current time (literally) <br>
<b>prevTime:</b> JavaScript Date object representing the last time _update() was called. <br>
<b>time:</b> data.turnEnd - data.turnStart : the time it takes during each turn <br> 
<b> timelist: </b> this.roundStart - this.roundEnd: this.roundStart = this.turnStart, previous this.roundEnd, this.roundEnd: new time. <br>

### etc 
<b>resetCount:</b> number of times the matrix gets cleaned out bc a block touched the top of the matrix <br>
<b>running:</b> true if game running, false otherwise<br>

## Game FLow Diagram 
### <b> Player 1 && Player 2 Socket Relationship  </b> 
![](public/images/readme/socket_players.png)
### <b> Player 1 && Player 2 Detailed Data Flow  </b> 
![](public/images/readme/communication_flow.png)
### <b> Player 1 && Player 2 Example of Data Communication  </b> 
![](public/images/readme/socket_activeinactive.png)
### <b> Game Start Flow and General Structure, Socket Relationship  </b> 
![](public/images/readme/general_idea.png)

## Citation Publicationss 
