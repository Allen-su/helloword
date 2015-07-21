var documentWidth = document.body.scrollWidth;
var documentHeight = document.body.scrollHeight;

function getRow(grid) {
	return parseInt(documentWidth / grid.wide, 10);
}

function getCol(grid) {
	return parseInt(documentHeight / grid.wide, 10);
}


function posEqual( pos ) {
	return pos.x == posEqual.pos.x && pos.y == posEqual.pos.y;
}


var color = [
	//'#eee4da',
	//'#ede0c8',
	'#f2b179',
	'#f59563',
	'#f67c5f',
	'#f65e3b',
	//'#edcf72',
	//'#edcc61',
	'#9c0',
	'#33b5e5',
	'#09c',
	'#a6e',
	'#93e'
];


function getColor() {
	return color[ Math.floor(Math.random() * color.length) ];
}











