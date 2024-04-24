# Customizing Gameplay in Co-Tetris

## Adjusting the Number of Tetris Blocks per Player

The Co-Tetris game is designed with flexibility in mind, allowing easy customization of how many Tetris blocks each player receives before the turn rotates. This feature is controlled by the `NUM_PLAYS` variable found in the `socket.js` file.

### Constants Configuration

The following settings in `public/src/consts.js` manage various gameplay aspects:

```javascript
module.exports = {
   NUM_PLAYS: 5,  // Number of blocks per player per turn
   NUM_PLAYERS: 2,  // Maximum number of players in a game
   MAX_SCORE: 300  // Used for calculating Average Reward
};
```


**Modifying Block Distribution:**
- **`NUM_PLAYS`**: Adjust this value to increase or decrease the number of blocks each player receives per turn. Higher values give a single player more blocks before rotating turns, affecting game difficulty and strategy.

### Turn Management Logic

Turn rotation is managed in the `blockLandedHandler` function, which is triggered every time a block lands. This function checks if the current number of blocks a player has received matches the quota set by `NUM_PLAYS`, and if so, it selects which palyer has the next turn.

## Turn Management in Co-Tetris

### Overview

The turn management system in Co-Tetris uses a dynamic allocation method that supports both random and strategic distributions. This system helps maintain balance and fairness in competitive gameplay.

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
