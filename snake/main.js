

var grid = {
	row: 30,
	col: 20,
	wide: 20,
	els : []
};

var snake = {
	color: '#3483BD',
	curPos: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x:4, y: 0}],
	length: 5,
	PassedPos: [],
	food: {x: 7, y: 7},
	direction: 3, // 0: up , 1: down, 2: left, 3: right;
	speed : 400,
	isDied: false,
	timeId: 0
};

var scoreData = {
	food: 0,
	score: 0,
	price: 10,
};

var touchData = {
	startx: 0,
	starty: 0,
	endx: 0,
	endy: 0
};

function initGrid(grid) {
	var fragEl = document.createDocumentFragment(),
		gridEl = document.createElement('span'),
		color = snake.color,
		gridElClone = null,
		els = grid.els,
		wide = grid.wide, i, j, ilen ,jlen;
	gridEl.className = 'grid_cell';
	for ( i = 0, ilen = grid.col; i < ilen ; i++ ) {
		for ( j = 0, jlen = grid.row; j < jlen; j++ ) {
			gridElClone = gridEl.cloneNode();
			gridElClone.style.top = i * wide + 'px';
			gridElClone.style.left = j * wide + 'px';
			fragEl.appendChild(gridElClone);
		}
	}

	gridEl.className = 'num_cell';
	for ( i = 0, ilen = grid.col; i < ilen ; i++ ) {
		for ( j = 0, jlen = grid.row; j < jlen; j++ ) {
			gridElClone = gridEl.cloneNode();
			gridElClone.id = 'num_cell_' + i + '_' + j;
			gridElClone.style.backgroundColor = color;
			gridElClone.style.top = i * wide + 'px';
			gridElClone.style.left = j * wide + 'px';
			fragEl.appendChild(gridElClone);
			els.push(gridElClone);
		}
	}
	document.getElementById('grid').appendChild(fragEl);
}

function initRender(snake, grid) {
	var curPos = snake.curPos,
		PassedPos = snake.PassedPos,
		rowCount = grid.row,
		els = grid.els,
		wide = grid.wide,
		el, item;
	for ( var i = 0, len = curPos.length; i < len ; i ++ ) {
		item = curPos[i];
		//计算在 els 中的位置 col * rowCount + row
		el = els[item.y * rowCount + item.x];
		//el.style.backgroundColor = getColor();
		el.style.width = wide + 'px';
		el.style.height = wide + 'px';
	}

}

function init() {
	snake.color = getColor();
	grid.row = getRow(grid);
	grid.col = getCol(grid);
	initGrid(grid);
	initRender(snake, grid);
	snakeMove();
	bindEvent();
	generatorFood();
}

init();


//爬行
function snakeMove() {
	if ( snake.timeId ) {
		clearTimeout(snake.timeId);
	}
	snake.timeId = setTimeout(move , snake.speed);
}


function move() {
	switch( snake.direction ) {
		case 0 :
			moveUp();
			break;
		case 1 :
			moveDown();
			break;
		case 2 :
			moveLeft();
			break;
		case 3 :
			moveRight();
			break;
	}
	if ( !snake.isDied ) {
		snake.timeId = setTimeout(move , snake.speed);
	} else {
		clearTimeout(snake.timeId);
	}
}

function moveUp() {
	if ( !isGameOver() ) {
		var snakeHead = snake.curPos[snake.length - 1],
			snakeTail = snake.curPos[0];
		snake.curPos.push({x: snakeHead.x, y: snakeHead.y - 1 });
		snake.PassedPos = isEat() ? [] : [snake.curPos.shift()];
		moveRender(snake, grid);
	}
}

function moveDown() {
	if ( !isGameOver() ) {
		var snakeHead = snake.curPos[snake.length - 1],
			snakeTail = snake.curPos[0];
		snake.curPos.push({x: snakeHead.x, y: snakeHead.y + 1 });
		snake.PassedPos = isEat() ? [] : [snake.curPos.shift()];
		moveRender(snake, grid);
	}
}

function moveLeft() {
	if ( !isGameOver() ) {
		var snakeHead = snake.curPos[snake.length - 1],
			snakeTail = snake.curPos[0];
		snake.curPos.push({x: snakeHead.x - 1, y: snakeHead.y });
		snake.PassedPos = isEat() ? [] : [snake.curPos.shift()];
		moveRender(snake, grid);
	}
}

function moveRight() {
	if ( !isGameOver() ) {
		var snakeHead = snake.curPos[snake.length - 1],
			snakeTail = snake.curPos[0];
		snake.curPos.push({x: snakeHead.x + 1, y: snakeHead.y });
		snake.PassedPos = isEat() ? [] : [snake.curPos.shift()];
		moveRender(snake, grid);
	}
}

//是否撞到边界或撞到自己
function isGameOver() {
	var _snake = snake, _grid = grid, curPos = _snake.curPos,
		isCrashBoundary, isCrash = false, willPos;

	switch( _snake.direction ) {
		case 0 ://up
			posEqual.pos = willPos = {x: curPos[_snake.length - 1].x, y: curPos[_snake.length - 1].y - 1};
			isCrashBoundary = willPos.y < 0 ? true : false;
			if ( !isCrashBoundary ) {
				isCrash = curPos.some(posEqual);
			}
			break;
		case 1 ://down
			posEqual.pos = willPos = {x: curPos[_snake.length - 1].x, y: curPos[_snake.length - 1].y + 1};
			isCrashBoundary = willPos.y >= _grid.col ? true : false;
			if ( !isCrashBoundary ) {
				isCrash = curPos.some(posEqual);
			}
			break;
		case 2 ://left
			posEqual.pos = willPos = {x: curPos[_snake.length - 1].x - 1, y: curPos[_snake.length - 1].y};
			isCrashBoundary = willPos.x < 0 ? true : false;
			if ( !isCrashBoundary ) {
				isCrash = curPos.some(posEqual);
			}
			break;
		case 3 ://right
			posEqual.pos = willPos = {x: curPos[_snake.length - 1].x + 1, y: curPos[_snake.length - 1].y};
			isCrashBoundary = willPos.x >= _grid.row ? true : false;
			if ( !isCrashBoundary ) {
				isCrash = curPos.some(posEqual);
			}
			break;
	}
	if ( isCrashBoundary || isCrash) {
		_snake.isDied = true;
		GameOver();
	}
	return isCrashBoundary || isCrash;
}


function moveRender(snake, grid) {
	var curPos = snake.curPos,
		PassedPos = snake.PassedPos,
		snakeLength = snake.length - 1,
		rowCount = grid.row,
		els = grid.els,
		wide = grid.wide,
		el;

		//计算在 els 中的位置 col * rowCount + row
		el = els[curPos[snakeLength].y * rowCount + curPos[snakeLength].x];
		el.style.borderRadius = 0;
		el.style.width = wide + 'px';
		el.style.height = wide + 'px';
	
	if ( PassedPos.length > 0 ) {
		//计算在 els 中的位置 col * rowCount + row
		el = els[PassedPos[0].y * rowCount + PassedPos[0].x];
		el.style.width = 0;
		el.style.height = 0;
	}
}




//@绑定控制事件------------------------------------------------------------------

function bindEvent() {
	document.addEventListener('keydown', keyBoardDown, false);
	document.addEventListener('touchstart', touchStart, false);
	document.addEventListener('touchmove', touchMove, false);
	document.addEventListener('touchend', touchEnd, false);
}

function touchStart(evt) {
	touchData.startx = evt.touches[0].pageX;
	touchData.starty = evt.touches[0].pageY;
}

function touchMove(evt) {
	evt.preventDefault();
}

function touchEnd(evt) {
	var _touchData = touchData;
	_touchData.endx = evt.changedTouches[0].pageX;
	_touchData.endy = evt.changedTouches[0].pageY;
	var detalx = _touchData.endx - _touchData.startx;
	var detaly = _touchData.endy - _touchData.starty;

	if ( Math.abs(detaly) < 0.1 * documentWidth && Math.abs(detalx) < 0.1 * documentWidth){
		return;
	}

	if (Math.abs(detalx) > Math.abs(detaly) ) {
		if( detalx > 0 ){
			//right
			turnRight();
		} else {
			//left
			turnLeft();
		}
	} else {
		if( detaly > 0 ){
			//down
			turnDown();
		} else {
			//up
			turnUp();
		}
	}


}

function keyBoardDown(evt) {
	switch(evt.keyCode){
		case 37://left
			evt.preventDefault();
			turnLeft();
			break;
		case 38://up
			evt.preventDefault();
			turnUp();
			break;
		case 39://right
			evt.preventDefault();
			turnRight();
			break;
		case 40://down
			evt.preventDefault();
			turnDown();
			break;
		default:
			break;
	}
}

function turnUp() {
	if ( canTurnTo(snake.direction, 0) ) {
		snake.direction = 0;
		moveUp();
		snakeMove();
	}
}

function turnDown() {
	if ( canTurnTo(snake.direction, 1) ) {
		snake.direction = 1;
		moveDown();
		snakeMove();
	}
}

function turnLeft() {
	if ( canTurnTo(snake.direction, 2) ) {
		snake.direction = 2;
		moveLeft();
		snakeMove();
	}
}

function turnRight() {
	if ( canTurnTo(snake.direction, 3) ) {
		snake.direction = 3;
		moveRight();
		snakeMove();
	}
}




function canTurnTo( oldDirection, newDirection ) {
	if ( oldDirection === newDirection ||
		( oldDirection === 0 && newDirection === 1 ||
		oldDirection === 1 && newDirection === 0 ) ||
		( oldDirection === 2 && newDirection === 3 ||
		oldDirection === 3 && newDirection === 2 ) ) {
		return false;
	}
	return true;
}


//@eat ---------------------------------------------------------------------------------------

function isEat() {
	var mousePos = snake.curPos[snake.length - 1], foodPos = snake.food;
	if ( mousePos.x === foodPos.x && mousePos.y === foodPos.y ) {
		snake.length++;
		scoreData.food++;
		generatorFood();
		return true;
	}
	return false;
}

function generatorFood() {
	var snakePos = snake.curPos, snakePosItem,
		snakePosNum = [],
		_grid = grid,
		rowCount = _grid.row,
		colCount = _grid.col,
		randomX, randomY, randomNum, times = 0;
	var now = Date.now();
	for ( var i = 0, len = snakePos.length; i < len; i++ ) {
		snakePosItem = snake.curPos[i];
		snakePosNum.push(snakePosItem.y * rowCount + snakePosItem.x);
	}
	do{
		randomX = parseInt(Math.floor(Math.random() * _grid.row),10);
		randomY = parseInt(Math.floor(Math.random() * _grid.col),10);
		randomNum = randomY * rowCount + randomX;
		if( times == 50){
			for( i = 0; i < colCount; i++ ){
				for(var j = 0; j < rowCount; j++ ){
					randomNum = i * rowCount + j;
					if( snakePosNum.indexOf(randomNum) < 0 ){
						randomX = i;
						randomY = j;
						break;
					}
				}
			}
			break;
		}
		times++;
	}while( snakePosNum.indexOf(randomNum) > -1 );
	snake.food = {x: randomX, y: randomY};
	foodRender(snake.food);
}

function foodRender(foodPos) {
	var _grid = grid;
	el = _grid.els[foodPos.y * _grid.row + foodPos.x];
	el.style.borderRadius = grid.wide + 'px';
	//el.style.backgroundColor = getColor();
	el.style.width = _grid.wide + 'px';
	el.style.height = _grid.wide + 'px';
}



function GameOver() {
	scoreData.score = scoreData.food * scoreData.price;
	alert('游戏结束，总分：' + scoreData.score );
}














