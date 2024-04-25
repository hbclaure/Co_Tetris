//colors for shapes
var colors = ['#00af9d', '#ffb652', '#cd66cc', '#66bc29', '#0096db', '#3a7dda', '#ffe100', '#46ffff', '#ff8200', ];

//inactive player color
var inactive = '#C0C0C0';

//sidebar width
var sideWidth = 200;

//scene column count
var columnCount = 10;

//scene row count;
var rowCount = 20;

//previewCount
var previewCount = 6;

//scene gradient start color 
var sceneBgStart = '#8e9ba6';

//scene gradient end color 
var sceneBgEnd = '#5c6975';

//preview background color
var previewBg = '#2f2f2f';

//grid line color
var gridLineColor = 'rgba(255,255,255,0.2)';

//box border color
var boxBorderColor = 'rgba(255,255,255,0.5)';

// Default Shape color
var DEFAULT_COLOR = 8;

// Level update interval (milliseconds)
var levelInterval = 120 * 1000;

//VARIABLES YOU MIGHT LIKE TO CHANGE

//waitTime (seconds)
var waitTime = 0.8;

//number of turns per player
var numplays = 1;

//number of players allowed in a game
var numplayers = 2;

//use turn calculator (true or false. true to use, false otherwise)
var useTurnCalc = false;

// Turn on/off ghost shape
var useGhostShape = true;

// Game speed (milliseconds)
var defaultInterval = 600;
var defaultGhostInterval = 450;

// Random Distribution for blocks  (true or false. true to use, false otherwise)
var useRandomNumDist = false; 

// List Distribution for blocks (true or false. true to use, false otherwise) 
var useListNumDist = false;

// Random Distribution with Constraints for blocks (true or false. true to use, false otherwise)
var useRandomConstraint = true; 

var exports = module.exports = {};

exports.DEFAULT_COLOR = DEFAULT_COLOR;

exports.COLORS = colors;

exports.SIDE_WIDTH = sideWidth;

exports.ROW_COUNT = rowCount;

exports.COLUMN_COUNT = columnCount;

exports.SCENE_BG_START = sceneBgStart;

exports.SCENE_BG_END = sceneBgEnd;

exports.PREVIEW_BG = previewBg;

exports.PREVIEW_COUNT = previewCount;

exports.GRID_LINE_COLOR = gridLineColor;

exports.BOX_BORDER_COLOR = boxBorderColor;

exports.DEFAULT_INTERVAL = defaultInterval;

exports.DEFAULT_GHOST_INTERVAL = defaultGhostInterval;

exports.LEVEL_INTERVAL = levelInterval;

exports.WAIT_TIME = waitTime;

exports.NUM_PLAYS = numplays;

exports.NUM_PLAYERS = numplayers;

exports.USE_TURN_CALC = useTurnCalc;

exports.USE_GHOST_SHAPE = useGhostShape;

exports.USE_RANDOM_CALC = useRandomNumDist;

exports.USE_LIST_CALC = useListNumDist;

exports.USE_CONSTRAINT_CALC = useRandomConstraint;

exports.INACTIVE = inactive;