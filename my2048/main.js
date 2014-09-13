var board = [];//每个格子所保存的数字
var score = 0;//当前分数
var hasConflicted = [];//本次移动后当前格子是否已经发生过碰撞，发生后，不能再次碰撞
var startx,starty,endx,endy;//手机滑动的坐标

$(function(){
	prepareForMobile();
	newGame();
});

//初始化样式大小
function prepareForMobile(){
	if( documentWidth > 500 ){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}
	$('#grid_container').css('width',gridContainerWidth - 2*cellSpace)
						.css('height',gridContainerWidth - 2*cellSpace)
						.css('padding',cellSpace)
						.css('border-radius',0.01*gridContainerWidth);
	$('.grid_cell').css('width',cellSideLength)
					.css('height',cellSideLength)
					.css('border-radius',0.02*cellSideLength);
}

function newGame(){
	//初始化格子
	init();
	//随机生成两个数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			var gridCell = $('#grid_cell_'+i+'_'+j);
			gridCell.css('top',getPosTop(i)).css('left',getPosLeft(j));
		}
	}
	for(var i = 0; i < 4; i++){
		board[i] = [];
		hasConflicted[i] = [];
		for(var j = 0; j < 4; j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	updateBoardView();
	updateScore(0);
}

function updateBoardView(){
	$('.number_cell').remove();
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			$('#grid_container').append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
			var numCell = $('#number_cell_'+i+'_'+j);
			if(board[i][j] === 0){
				numCell.css('width',0)
					.css('height',0)
					.css('top',getPosTop(i)+cellSideLength/2)
					.css('left',getPosLeft(j)+cellSideLength/2);
			}else{
				numCell.css('width',cellSideLength)
					.css('height',cellSideLength)
					.css('top',getPosTop(i))
					.css('left',getPosLeft(j))
					.css('background-color',getNumBackgroundColor(board[i][j]))
					.css('color',getNumColor(board[i][j]))
					.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
	$('.number_cell').css('line-height',cellSideLength+'px')
					.css('font-size',cellSideLength*0.4+'px');
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}
	//随机一个位置
	var randomX,randomY,times = 0;
	do{
		randomX = parseInt(Math.floor(Math.random() * 4),10);
		randomY = parseInt(Math.floor(Math.random() * 4),10);

		if( times == 50){
			for( var i = 0; i < 4; i++ ){
				for(var j = 0; j < 4; j++ ){
					if( board[i][j] === 0){
						randomX = i;
						randomY = j;
						break;
					}
				}
			}
			break;
		}
		times++;
	}while( board[randomX][randomY] );

	//随机一个数字
	var randomNum = Math.random() < 0.5 ? 2 : 4;

	//在随机位置显示随机数字
	board[randomX][randomY] = randomNum;
	showNumWithAnimation(randomX,randomY,randomNum);

	return true;
}

$(document).keydown(function(evt){

	switch(evt.keyCode){
		case 37://left
			evt.preventDefault();
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
			break;
		case 38://up
			evt.preventDefault();
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
			break;
		case 39://right
			evt.preventDefault();
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
			break;
		case 40://down
			evt.preventDefault();
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
			break;
		default:
			break;
	}
});

document.addEventListener( 'touchstart',function(evt){
	startx = evt.touches[0].pageX;
	starty = evt.touches[0].pageY;
});

document.addEventListener( 'touchmove',function(evt){
	evt.preventDefault();//解决android4.0 touchstart可能不可用的bug
});

document.addEventListener( 'touchend',function(evt){
	endx = evt.changedTouches[0].pageX;
	endy = evt.changedTouches[0].pageY;

	var detalx = endx - startx;
	var detaly = endy - starty;
	if( Math.abs(detaly) < 0.3*documentWidth && Math.abs(detalx) < 0.3*documentWidth ){
		return;
	}

	if( Math.abs(detalx) > Math.abs(detaly) ){
		if( detalx > 0 ){
			//right
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
		}
		else{
			//left
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
		}
	}
	else{
		if( detaly > 0 ){
			//down
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
		}
		else{
			//up
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isGameOver,400);
			}
		}
	}



});

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}

	//moveLeft
	for( var i = 0; i < 4; i++){
		for( var j = 1; j < 4; j++){
			if( board[i][j] !== 0 ){

				for( var k = 0; k < j; k++ ){
					if( board[i][k] === 0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimotion(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} 
					else if( board[i][k] === board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k] ){
						//move
						showMoveAnimotion(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}

function moveUp(){
	if( !canMoveUp(board) ){
		return false;
	}
	//moveup
	for( var j = 0; j < 4; j++ ){
		for( var i = 1; i < 4; i++ ){
			if( board[i][j] !== 0 ){

				for( var k = 0; k < i; k++ ){
					if( board[k][j] === 0 && noBlockVertical(j,k,i,board) ){
						//move
						showMoveAnimotion(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[k][j] === board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j] ){
						//move
						showMoveAnimotion(i,j,k,j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}

	//moveRight
	for( var i = 0; i < 4; i++ ){
		for( var j = 2; j >= 0; j-- ){
			if( board[i][j] !== 0 ){

				for( var k = 3; k > j; k-- ){
					if( board[i][k] === 0 && noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimotion(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} 
					else if( board[i][k] === board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k] ){
						//move
						showMoveAnimotion(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}

function moveDown(){
	if( !canMoveDown(board) ){
		return false;
	}

	for( var j = 0; j < 4; j++ ){
		for( var i = 2; i >= 0; i-- ){
			if( board[i][j] !== 0 ){
				for( var k = 3; k > i; k-- ){
					if( board[k][j] === 0 && noBlockVertical(j,i,k,board) ){
						//move
						showMoveAnimotion(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[k][j] === board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j] ){
						//move
						showMoveAnimotion(i,j,k,j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}



function isGameOver(){
	if( nospace( board ) && nomove( board ) ){
		gameOver();
	}
}

function gameOver(){
	alert('gameover!');
	newGame();
}







