var documentWidth = window.screen.availWidth;
var gridContainerWidth = documentWidth * 0.92;
var cellSideLength = documentWidth * 0.18;
var cellSpace = documentWidth * 0.04;


function getPosTop(i){
	return cellSpace + ( cellSideLength +cellSpace )*i;
}

function getPosLeft(j){
	return cellSpace + ( cellSideLength +cellSpace )*j;
}

function getNumBackgroundColor(number){
	var color = '';
	switch(number){
		case 2 : color = '#eee4da'; break;
		case 4 : color = '#ede0c8'; break;
		case 8 : color = '#f2b179'; break;
		case 16 : color = '#f59563'; break;
		case 32 : color = '#f67c5f'; break;
		case 64 : color = '#f65e3b'; break;
		case 128 : color = '#edcf72'; break;
		case 256 : color = '#edcc61'; break;
		case 512 : color = '#9c0'; break;
		case 1024 : color = '#33b5e5'; break;
		case 2048 : color = '#09c'; break;
		case 4096 : color = '#a6e'; break;
		case 8192 : color = '#93e'; break;
	}
	return color;
}

function getNumColor(number){
	if(number < 4){
		return '#776e65';
	}
	return 'white';
}

function nospace(board){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(board[i][j] === 0){
				return false;
			}
		}
	}
	return true;
}

function canMoveLeft(board){
	for(var i = 0; i < 4; i++){
		for(var j = 1; j < 4; j++){
			if(board[i][j-1] === 0 || board[i][j-1] === board[i][j]){
				return true;
			}
		}
	}
	return false;
}

function canMoveUp(board){
	for( var j = 0; j < 4; j++ ){
		for( var i = 1; i < 4; i++ ){
			if(board[i-1][j] === 0 || board[i-1][j] === board[i][j]){
				return true;
			}
		}
	}
	return false;
}

function canMoveDown(board){
	for( var j = 0; j < 4; j++ ){
		for( var i = 2; i >= 0; i-- ){
			if(board[i+1][j] === 0 || board[i+1][j] === board[i][j]){
				return true;
			}
		}
	}
	return false;
}

function canMoveRight(board){
	for( var i = 0; i < 4; i++ ){
		for( var j = 2; j >= 0; j-- ){
			if( board[i][j+1] === 0 || board[i][j+1] === board[i][j]){
				return true;
			}
		}
	}
	return false;
}

function noBlockHorizontal(row,col1,col2,board){
	for( var i = col1 + 1; i < col2; i++ ){
		if( board[row][i] !== 0 ){
			return false;
		}
	}
	return true;
}

function noBlockVertical(col,row1,row2,board){
	for( var i = row1 + 1; i < row2; i++){
		if(board[i][col] !== 0){
			return false;
		}
	}
	return true;
}

function nomove( board ){
	if( canMoveLeft( board ) || canMoveUp( board ) || canMoveRight( board ) || canMoveDown( board )){
		return false;
	}
	return true;
}







