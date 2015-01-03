define(function(require, exports, module){
	require('jquery');
	var audio = require('./audio');
	var isPlay = 'yes' ,
		pause = $('.pause'),
		bg = $('.control_bg');

	$('.progress, .control_bg, .pause').bind('click', function(){
		if ( isPlay == 'yes' ) {
			pause.css('z-index', 100);
			bg.css('z-index', 99);
			isPlay = 'no';
			audio.pause();
		} else {
			pause.css('z-index', 99);
			bg.css('z-index', 100);
			isPlay = 'yes';
			audio.play();
		}
	});

	$('.next').bind('click', function(){
		pause.css('z-index', 99);
		bg.css('z-index', 100);
		isPlay = 'yes';
		audio.next();
	});

	audio.play();

});