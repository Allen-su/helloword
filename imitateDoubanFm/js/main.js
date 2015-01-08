define(function(require, exports, module){
	require('navigation');
	require('slide');

	$(function(){
		var body = document.body.clientHeight,
			header = $('header').outerHeight(true),
			nav = $('#find_program > nav').outerHeight(true),
			footer = $('#control_box').outerHeight(true);
		$('#channel dl').height( body - header - nav - footer);
	});
	
});