define(function(require, exports, module){
	require('navigation');
	require('slide');

	$(function(){
		var body = window.screen.availHeight,
			header = $('header').height(),
			nav = $('#find_program > nav').height(),
			footer = $('#control_box').height();
		$('#channel dl').height( body - header - nav - footer );
	});
	
});