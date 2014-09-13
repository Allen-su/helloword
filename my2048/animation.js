function showNumWithAnimation(i,j,randomNum){
	var numberCell = $('#number_cell_'+i+'_'+j);
	numberCell.css('background-color',getNumBackgroundColor(board[i][j]))
		.css('color',getNumColor(board[i][j]))
		.css('box-shadow', '0px 0px 1px 1px white')
		.text(randomNum);
	numberCell.animate({
		'width':cellSideLength+'px',
		'height':cellSideLength+'px',
		'top':getPosTop(i),
		'left':getPosLeft(j)
	},50);
}

function showMoveAnimotion(fromx,fromy,tox,toy){
	var numberCell = $('#number_cell_'+fromx+'_'+fromy);
	numberCell.animate({
		'top':getPosTop(tox),
		'left':getPosLeft(toy)
	},200);
}

function updateScore(score){
	$('#score').text(score);
}