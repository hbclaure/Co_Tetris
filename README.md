# Co-Tetris :video_game:
Co-Tetris is a multiplayer game based on the popular arcade game Tetris.

The objective of the Co-Tetris is for multiple players to collaborate (or compete) to obtain the highest possible score. A third preprogrammed player is charged with decididng who gets access to the falling Tetris block. This repository enables you to run your own version of the game, either locally or online.

A live version of the game can be found here. Note that gameplay requires two people to log in simultaneously:
```
cooptetris.herokuapp.com
```
This game was developed at Cornell University by Houston Claure, Seyun Kim, Winnice Hui, Obinna Abbi, Hyun Kyo Jung, and Malte Jung, in collaboration with Jignesh Modi and Stefanos Nicholaidis from the University of Southern California. 

### Game Video 
https://github.com/hbclaure/Co_Tetris_n_2021/assets/16567310/86e6811b-2243-4a03-acbb-2e6b408fbb32


<p align = "center">
<video src="public/video/tetris_vid.mp4" width="600"/> 
<br> </br>
</p>

## Research Paper Using Co-Tetris
- Claure, H., Kim, S., Kizilcec, R. F., & Jung, M. (2023). The social consequences of machine allocation behavior: Fairness, interpersonal perceptions and performance. Computers in Human Behavior.

- Claure, H., Chen, Y., Modi, J., Jung, M., & Nikolaidis, S. (2020). Multi-armed bandits with fairness constraints for distributing resources to human teammates. In Proceedings of the 2020 ACM/IEEE International Conference on Human-Robot Interaction. 


## Running the Game on Your Local Computer

### Requirements
1. **Node.js & NPM** - Required for running the server and installing dependencies.
   - [Download Node.js](https://nodejs.org/en/download/)
   - [Get NPM](https://www.npmjs.com/get-npm)
2. **Heroku CLI** - Required if deploying to Heroku.
   - [Download and Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
3. **MongoDB** - A MongoDB database is essential for storing game data like player scores and game states.
   - [Sign up or Log in to MongoDB](https://account.mongodb.com/account/login?signedOut=true)

### Installation
1. **Clone the repository onto your local machine:**

### Installation
1. Clone repository onto local machine.
```
git clone CoTetris
```
2. Navigate to local respository folder.

3. Create a `.env` file in the top directory of your local repository

4. **Set up your MongoDB connection:**
Add the following to your `.env` file, replacing `username`, `password`, `appName`, and `your-database-url` with your MongoDB credentials:
```
MONGO_URI= 'mongodb+srv://username:password@your-database-url/appName?retryWrites=true&w=majority'
```
- `username`: Your MongoDB username
- `password`: Your MongoDB password
- `your-database-url`: The URL provided by MongoDB when you set up your cluster
- `appName`: Your database name 

5. **Install dependencies:**
```
npm install
```

6. **Run the application:**
Navigate to `localhost:3000` in your web browser to see the application running locally on your machine. You will need to log in on at least two tabs to connect to the game. 


## Deploying the Game Online

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
