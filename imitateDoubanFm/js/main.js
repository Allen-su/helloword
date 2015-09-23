define(function(require, exports, module){
	require('navigation');
	require('play');
	require('iscroll');
	$(function(){
		var body = document.body,
			header = $('header'),
			nav = $('#find_program > nav'),
			footer = $('#footer'),
			dl = $('#channel');
		dl.height( body.clientHeight - header.height() - 
			nav.height() - footer.height());
		window.onresize = function(){
			clearTimeout( arguments.callee.timeId );
			arguments.callee.timeId = setTimeout(function(){
				dl.height( body.clientHeight - header.height() - 
					nav.height() - footer.height());
			},100);
		};
		new IScroll('#channel', { scrollY: true, freeScroll: true, mouseWheel: true, click: true});
		
	});
});