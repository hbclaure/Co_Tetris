# Co-Tetris :video_game:
<p align="center">
  <img src="https://github.com/hbclaure/Co_Tetris_n_2021/assets/16567310/bf8dd158-aaa5-48af-9919-0ed996113f57" alt="tetrisGIF">
</p>




<p align="center"><i>Co-Tetris is a research platform designed to study cooperative and competitive strategies in multiplayer scenarios, using the classic Tetris game as a framework for analyzing interactions between humans and AI agents. [![Logo]([https://github.com/hbclaure/Co_Tetris/CoTetris_logo.png](https://img.youtube.com/vi/gu6kT1MdXkU/0.jpg)](https://youtu.be/gu6kT1MdXkU) </i></p>

### Introduction

The objective of the Co-Tetris is for multiple players to collaborate (or compete) to obtain the highest possible score. A third preprogrammed player is charged with decididng who gets access to the falling Tetris block. This repository enables you to run your own version of the game, either locally or online. Co-Tetris has been utilized for deploying reinforcement learning algorithms and studying how humans respond to AI-driven allocation decisions.

A live version of the game can be found here. Note that gameplay requires two people to log in simultaneously:
```
https://cotetris2.herokuapp.com/
```
This game was developed at Cornell University by [Houston Claure](https://www.houstonclaure.com), [Seyun Kim](https://www.seyunkim.com), Winnice Hui, Obinna Abbi, Hyun Kyo Jung, and [Malte Jung](https://mjung.infosci.cornell.edu), in collaboration with Jignesh Modi and [Stefanos Nicholaidis](http://www.stefanosnikolaidis.net) from the University of Southern California. 

### Co-Tetris Video


## Research Papers Using Co-Tetris
- Claure, H., Kim, S., Kizilcec, R. F., & Jung, M. (2023). The social consequences of machine allocation behavior: Fairness, interpersonal perceptions and performance. Computers in Human Behavior. [[Paper]](public/papers/CIHB_SocialConsequences.pdf) 

- Claure, H., Chen, Y., Modi, J., Jung, M., & Nikolaidis, S. (2020). Multi-armed bandits with fairness constraints for distributing resources to human teammates. In Proceedings of the 2020 ACM/IEEE International Conference on Human-Robot Interaction. [[Paper]](public/papers/MAB_HRI.pdf) [[Code]](https://github.com/icaros-usc/MAB_Fairness)

### Co-Tetris Research Demonstration

<p align = "center">
<video src="https://github.com/hbclaure/Co_Tetris/assets/16567310/f745fc3a-d39a-4021-98b8-b55f8b7715b4" width="600"/> 
<br> </br>
</p>



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
1. **Clone repository onto local machine.**
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

### Running Locally
6. **Run Co-Tetris on your local computer:**
```
npm run dev
```
Navigate to `localhost:3000` in your web browser to see the application running locally. You will need to log in on at least two tabs to connect to the game.

## Deploying the Game Online
### 1. Follow the installation steps for running the game on your local computer.
### Heroku Deployment
2. **Log in to your Heroku account via CLI:**
Run `heroku login` to open the login prompt in your browser. Log in using your Heroku credentials or create a new account if necessary.
3. **Set up Heroku remote:**
After logging in and creating a new Heroku app in your dashboard (if you haven't already), set the remote for your app using:
### Heroku Deployment
4. **Log in to your Heroku account via CLI:**
Run `heroku login` to open the login prompt in your browser. Log in using your Heroku credentials or create a new account if necessary.
5. **Set up Heroku remote:**
After logging in and creating a new Heroku app in your dashboard (if you haven't already), set the remote for your app using:
```
heroku git:remote -a your-heroku-app-name
```
Replace `your-heroku-app-name` with the name of your app on Heroku.

6. **Push to Heroku:**
Deploy your application by pushing the local repository to the Heroku remote:

```
git push heroku master
```

7. **Ensure the MongoDB URI is set in Heroku:**
Set your environment variables (s`MONGO_URI`) in Heroku's settings under "Config Vars" to match those in your `.env` file.

8. **Running the Application on Heroku:** Navigate to your application's URL provided by Heroku to see your Co-Tetris game live.

## Customizing Gameplay
[Click here](CustomizingGamePlay.md) to learn how to customize the Co-Tetris game. 


## Contact
Questions? Contact Houston Claure at houston.claure@yale.edu. 


