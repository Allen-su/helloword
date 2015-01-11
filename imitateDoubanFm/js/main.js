define(function(require, exports, module){
	require('navigation');
	require('slide');

	$(function(){
		var body = document.body,
			header = $('header'),
			nav = $('#find_program > nav'),
			footer = $('#control_box'),
			dl = $('#channel dl');
		dl.height( body.clientHeight - header.outerHeight(true) - 
			nav.outerHeight(true) - footer.outerHeight(true));
		window.onresize = function(){
			clearTimeout( arguments.callee.timeId );
			arguments.callee.timeId = setTimeout(function(){
				dl.height( body.clientHeight - header.outerHeight(true) - 
					nav.outerHeight(true) - footer.outerHeight(true));
			},100);
		};
	});
});