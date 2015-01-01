define(function(require, exports, module){
	require('jquery');
	var sound = require('./sound');
	var isPlay = 'yes' ,
		pause = $('.pause'),
		bg = $('.control_bg');

	$('.progress, .control_bg, .pause').bind('click', function(){
		if ( isPlay == 'yes' ) {
			pause.css('z-index', 100);
			bg.css('z-index', 99);
			isPlay = 'no';
			sound.pause();
		} else {
			pause.css('z-index', 99);
			bg.css('z-index', 100);
			isPlay = 'yes';
			sound.play();
		}
	});

	sound.play();

});