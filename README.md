# Co-Tetris :video_game:
![tetrisGIF](https://github.com/hbclaure/Co_Tetris_n_2021/assets/16567310/bf8dd158-aaa5-48af-9919-0ed996113f57)


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

## Research Papers Using Co-Tetris
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

8. ** Running the Application on Heroku:** Navigate to your application's URL provided by Heroku to see your Co-Tetris game live.



