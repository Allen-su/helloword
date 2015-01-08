define(function(require, exports, module){
	require('navigation');
	require('slide');

	$(function(){
		var body = document.body.clientHeight,
			header = $('header').outerHeight(),
			nav = $('#find_program > nav').outerHeight(),
			footer = $('#control_box').outerHeight();
		$('#channel dl').height( body - header - nav - footer);
	});
	
});