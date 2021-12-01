var consts = require('./consts.js');
var COLORS = consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;

/**
	Defined all shapes used in Tetris game. 
	You can add more shapes if you wish.
*/
function ShapeL(color) {
	var state1 = [
		[1, 0],
		[1, 0],
		[1, 1]
	];

	var state2 = [
		[0, 0, 1],
		[1, 1, 1]
	];

	var state3 = [
		[1, 1],
		[0, 1],
		[0, 1]
	];

	var state4 = [
		[1, 1, 1],
		[1, 0, 0]
	];


	this.states = [state1, state2, state3, state4];
	this.x = 4;
	this.y = -3;
	this.flag = 'L';
	this.color = COLORS[color];
}

function ShapeLR(color) {
	var state1 = [
		[0, 1],
		[0, 1],
		[1, 1]
	];

	var state2 = [
		[1, 1, 1],
		[0, 0, 1]
	];

	var state3 = [
		[1, 1],
		[1, 0],
		[1, 0]
	];

	var state4 = [
		[1, 0, 0],
		[1, 1, 1]
	];


	this.states = [state1, state2, state3, state4];
	this.x = 4;
	this.y = -3;
	this.flag = 'LR';
	this.color = COLORS[color];
}

function ShapeO(color) {

	var state1 = [
		[1, 1],
		[1, 1]
	];


	this.states = [state1];
	this.x = 4;
	this.y = -2;
	this.flag = 'O';
	this.color = COLORS[color];
}

function ShapeI(color) {
	var state1 = [
		[1],
		[1],
		[1],
		[1]
	];

	var state2 = [
		[1, 1, 1, 1]
	];

	this.states = [state1, state2];

	this.x = 4;
	this.y = -4;
	this.flag = 'I';
	this.color = COLORS[color];
}

function ShapeT(color) {
	var state1 = [
		[1, 1, 1],
		[0, 1, 0]
	];

	var state2 = [
		[1, 0],
		[1, 1],
		[1, 0]
	];

	var state3 = [
		[0, 1, 0],
		[1, 1, 1]
	];

	var state4 = [
		[0, 1],
		[1, 1],
		[0, 1]
	];

	this.states = [state1, state2, state3, state4];
	this.x = 3;
	this.y = -2;
	this.flag = 'T';
	this.color = COLORS[color];
}

function ShapeZ(color) {
	var state1 = [
		[1, 1, 0],
		[0, 1, 1]
	];

	var state2 = [
		[0, 1],
		[1, 1],
		[1, 0]
	];

	this.states = [state1, state2];
	this.x = 3;
	this.y = -2;
	this.flag = 'Z';
	this.color = COLORS[color];
}

function ShapeZR(color) {
	var state1 = [
		[0, 1, 1],
		[1, 1, 0]
	];

	var state2 = [
		[1, 0],
		[1, 1],
		[0, 1]
	];

	this.states = [state1, state2];
	this.x = 3;
	this.y = -2;
	this.flag = 'ZR';
	this.color = COLORS[color];
}
// Default shape object to copy the shape from backend; 
function ShapeDefault(payload) {

}

/**
Is shape can move
@param shape: tetris shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isShapeCanMove = function (shape, matrix, action) {
	var rows = matrix.length;
	var cols = matrix[0].length;

	var isBoxCanMove = function (box) {

		var x = shape.x + box.x;
		var y = shape.y + box.y;
		if (y < 0) {
			return true;
		}
		if (action === 'left') {
			x -= 1;
			return x >= 0 && x < cols && matrix[y][x] == 0;
		} else if (action === 'right') {
			x += 1;
			return x >= 0 && x < cols && matrix[y][x] == 0;
		} else if (action === 'down') {
			y += 1;
			return y < rows && matrix[y][x] == 0;
		} else if (action === 'rotate') {
			return y < rows && !matrix[y][x];
		}
	};

	var boxes = action === 'rotate' ? shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);


	for (var i in boxes) {
		if (!isBoxCanMove(boxes[i])) {
			return false;
		}
	}
	return true;
};

/**
 All shapes shares the same method, use prototype for memory optimized
*/

ShapeL.prototype =
	ShapeLR.prototype =
	ShapeO.prototype =
	ShapeI.prototype =
	ShapeT.prototype =
	ShapeZ.prototype =
	ShapeZR.prototype =
	ShapeDefault.prototype = {

		init: function () {
			this.state = 0;
			this.allBoxes = {};
			this.y = 0;
		},
		//set the instance variable of the function
		updateShape: function (payload) {
			this.states = payload.states;
			this.state = payload.state;
			this.flag = payload.flag;
			this.x = payload.x;
			this.y = payload.y;
			this.color = payload.color;
			this.allBoxes = payload.allBoxes;
		},

		// Get boxes matrix which composite the shape
		getBoxes: function (state) {
			var boxes = this.allBoxes[state] || [];

			if (boxes.length) {
				return boxes;
			}
			var matrix = this.matrix(state);

			for (var i = 0; i < matrix.length; i++) {
				var row = matrix[i];
				for (var j = 0; j < row.length; j++) {
					if (row[j] === 1) {
						boxes.push({
							x: j,
							y: i
						});
					}
				}
			}
			this.allBoxes[state] = boxes;
			return boxes;
		},
		//Get matrix for specified state
		matrix: function (state) {
		
			var st = state !== undefined ? state : this.state;
			return this.states[st];
		},
		//Rotate shape
		rotate: function (matrix) {
			if (isShapeCanMove(this, matrix, 'rotate')) {
				this.state = this.nextState();
				//fix position if shape is out of right border
				var right = this.getRight();
				if (right >= COLUMN_COUNT) {
					this.x -= right - COLUMN_COUNT + 1;
				}
			}
		},
		//Caculate the max column of the shape
		getColumnCount: function () {
			var mtx = this.matrix();
			var colCount = 0;
			for (var i = 0; i < mtx.length; i++) {
				colCount = Math.max(colCount, mtx[i].length);
			}
			return colCount;
		},
		//Caculate the max row of the shape
		getRowCount: function () {
			return this.matrix().length;
		},
		//Get the right pos of the shape
		getRight: function () {
			var boxes = this.getBoxes(this.state);
			var right = 0;

			for (var i in boxes) {
				right = Math.max(boxes[i].x, right);
			}
			return this.x + right;
		},
		//Return the next state of the shape
		nextState: function () {
			return (this.state + 1) % this.states.length;
		},
		//Check if the shape can move down
		canDown: function (matrix) {
			return isShapeCanMove(this, matrix, 'down');
		},
		//Check if the shape can move left
		canLeft: function (matrix) {
			return isShapeCanMove(this, matrix, 'left');
		},
		//Check if the shape can move right
		canRight: function (matrix) {
			return isShapeCanMove(this, matrix, 'right');
		},
		//Move the shape down 
		goDown: function (matrix) {
			if (isShapeCanMove(this, matrix, 'down')) {
				this.y += 1;
			}
		},
		//Move the shape down 
		goDownBut: function (matrix) {
			if (isShapeCanMove(this, matrix, 'down')) {
				this.y += 1;
			}
		},
		//Move the shape to the Bottommost
		goBottom: function (matrix) {
			x = 0;
			if (isShapeCanMove(this, matrix, 'down')) {
				while (isShapeCanMove(this, matrix, 'down')) {
					this.y += 1;
					x += 2;
				}
			}
			return x;
		},
		//Move the shape to the left
		goLeft: function (matrix) {
			if (isShapeCanMove(this, matrix, 'left')) {
				this.x -= 1;
			}
		},
		//Move the shape to the right
		goRight: function (matrix) {
			if (isShapeCanMove(this, matrix, 'right')) {
				this.x += 1;
			}
		},
		//Find the location of piece and return a location list
		shapeLoc: function(matrix) {
				var smatrix = this.matrix(); 
				var list = []; 
				for (var i = 0; i < smatrix.length; i++) {
				var row = smatrix[i];
				for (var j = 0; j < row.length; j++) {
					if (row[j] === 1) {
						var x = this.x + j;
						var y = this.y + i;
						list.push(x);
						list.push(y);
					}
				}
			}
			return list;
		},
		//Copy the shape data to the game data
		copyTo: function (matrix) {
			var smatrix = this.matrix();
			for (var i = 0; i < smatrix.length; i++) {
				var row = smatrix[i];
				for (var j = 0; j < row.length; j++) {
					if (row[j] === 1) {
						var x = this.x + j;
						var y = this.y + i;
						if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
							matrix[y][x] = this.color;
						}
					}
				}
			}
		}
	}

/**
	Create  a random shape for game
*/
function generateShape(payload) {
	if (payload) {
		shape = new ShapeDefault(payload);
		shape.init();
		shape.updateShape(payload);
	} else {
		var result = Math.floor(Math.random() * 7);
		switch (result) {
			case 0:
				shape = new ShapeL(0);
				break;
			case 1:
				shape = new ShapeO(1);
				break;
			case 2:
				shape = new ShapeZ(2);
				break;
			case 3:
				shape = new ShapeT(3);
				break;
			case 4:
				shape = new ShapeLR(4);
				break;
			case 5:
				shape = new ShapeZR(5);
				break;
			case 6:
				shape = new ShapeI(6);
				break;
		}
		shape.init();
	}
	return shape;
}

module.exports.generateShape = generateShape;


/*
Shape: {
	color:    //int

}
*/