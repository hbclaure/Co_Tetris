# Understanding and Customizing Gameplay in Co-Tetris

## Overview

The `Co-Tetris` project uses two critical JavaScript files to manage the game's functionality and appearance: `socket.js` and `consts.js`. Here's how they contribute to the game:

- **`socket.js`**: This file is central to the multiplayer functionality of Co-Tetris. It manages real-time interactions between players through WebSocket connections. Key game functions like joining a game, handling game state updates, and processing player actions (e.g., block placements, messages) are implemented here.
  
- **`consts.js`**: This configuration file defines a wide range of constants that affect the gameplay and visual aspects of Co-Tetris. It includes settings for UI elements, game mechanics, and player options which are used across the game to maintain consistency and ease of management.

## Customizing Game Settings

### Game Mechanics

To modify how the game behaves, you can change values in `consts.js`. Here are some of the adjustable parameters and their impacts:

- **`NUM_PLAYS`**: Controls how many turns each player gets before the turn rotates.
- **`NUM_PLAYERS`**: Sets the maximum number of players allowed in a game.
- **`USE_TURN_CALC`**: Determines whether to use a complex algorithm for turn distribution among players.

### Visual Settings

Visual aspects like colors and sizes are also defined in `consts.js`, allowing for easy customization of the game's look and feel:

- **`COLORS`**: An array of colors used for Tetris blocks.
- **`SIDE_WIDTH`**: The width of the sidebar in the game interface.
- **`SCENE_BG_START` and `SCENE_BG_END`**: Colors defining the background gradient of the play area.

### Usage in `socket.js`

The constants from `consts.js` are incorporated into `socket.js` through a `require` statement, making them accessible throughout the file. These constants are used to control game logic and respond to player interactions effectively. For example, the game uses `NUM_PLAYS` to determine if a player's turn is over or if the ghost piece functionality (`USE_GHOST_SHAPE`) should be enabled.



## Turn Management in Co-Tetris

### Overview

Turn rotation is managed in the `blockLandedHandler` function (in `socket.js`), which is triggered every time a block lands. This function checks if the current number of blocks a player has received matches the quota set by `NUM_PLAYS`, and if so, it selects which player has the next turn.


### Configuration Options

Turn allocation can be adjusted in `consts.js`:
- **Random Allocation (`USE_RANDOM_CALC`)**: Randomly distributes turns among players.
- **Precomputed Order (`USE_LIST_CALC`)**: Follows a pre-determined sequence for turns.
- **Constraint-based Distribution (`USE_CONSTRAINT_CALC`)**: Manages turns based on defined constraints like 50/50 or 90/10 distributions.

### Mechanics

Turn distribution is orchestrated in the `blockLandedHandler` function, which uses the configured strategy to decide turn rotation.

```javascript

if ((data.turnCount < MAX_GAME_PLAYERS) || !(consts.USE_TURN_CALC)) {
    nextPlayerId = chooseTurnStrategy(turnObj, MAX_GAME_PLAYERS, data);
} else {
    nextPlayerId = turnCalculator(data.playersTally, data.playCount, NUM_PLAYS, MAX_SCORE);
}
```

### Customization

You can modify the logic by changing parameters in `consts.js` or by adjusting decision algorithms within `blockLandedHandler` to accommodate different gameplay styles or research needs.

## Configuring the Allocator Agent

You can customize whether the allocator of blocks is presented as an AI agent or a human. This can be adjusted in the `socket.js` file. The `is_AI` variable can be adjusted as follows:
- `var is_AI = 0` . This sets the allocator to be presented as an AI agent
- `var is_AI = 1` . This sets the allocator to presented as a human

If you want to adjust the images or insert your own custom images, this can be done by changing the following files:
- `../images/AI_Distributer.png` for the AI allocator
- `../images/MTurkWorker_Distributer.png` for the human allocator

## Adjusting Gameplay Duration 

You can customize how long the "Quit Game" button remains hidden by adjusting `setTimeout` in the `views.js` file: 
```javascript
activateQuitButton: function(){
    console.log("enter activate quitButton");
    quitButton.style.display = "none";
    function displayBtn() {
        quitButton.style.display = "inline";
    }
    // time used for developement purposes
    setTimeout(displayBtn, 100); //Adjust how long before the quit button is programmed to appear 
```

## Ghost Player Feature
![ghost_feature](https://github.com/hbclaure/Co_Tetris_n_2021/assets/16567310/39af902e-c8ff-430d-8c3a-aa52da2e6de4)

You can active the Ghost Player feature which allows the inactive player to give recommendations on where the active player should drop the falling Tetris block. This can be activated by switching the `var useGhostShape = false` to `var useGhostShape = true;` in the `consts.js` file. 
