define(function(require, exports, module){
	require('navigation');
	require('slide');

	$(function(){
		var body = document.body.clientHeight,
			header = $('header').height(),
			nav = $('#find_program > nav').height(),
			footer = $('#control_box').height();
		$('#channel dl').height( body - header - nav - footer);
	});
	
});