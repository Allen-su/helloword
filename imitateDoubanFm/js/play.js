define(function(require, exports, module){
	require('jquery');
	var audio = require('audio'),//获取audio对象
		progressBox = $('.progress'),
		canvas = $('#progress')[0];
		Progress = require('progress');
	
	var isPlay = 'yes' ,
		pause = $('.pause'),
		bg = $('.control_bg'),
		progressBar = new Progress.Progress(),//创建进度条对象
		time,
		intervalId;

	//绑定开始暂停事件
	$('.progress, .control_bg, .pause').bind('click', function(){
		if ( isPlay == 'yes' ) {
			pause.css('z-index', 100);
			bg.css('z-index', 99);
			isPlay = 'no';
			audio.pause();
			//clearInterval(intervalId);
		} else {
			pause.css('z-index', 99);
			bg.css('z-index', 100);
			isPlay = 'yes';
			audio.play();
		}
	});
	//绑定下一曲事件
	$('.next').bind('click', function(){
		pause.css('z-index', 99);
		bg.css('z-index', 100);
		isPlay = 'yes';
		audio.next();
	});

	audio.initConfig({
		renderCallback: function(){
			
		}
	});

	audio.play();
	drawProgress();

	//调整进度
	function drawProgress() {
		var width;
		intervalId = setInterval( function(){
			time = audio.getTime();
			progressBar.draw(time.curTime / time.allTime);
		} ,10);
	}
	/*module.exports = {
		progress : progressBar
	};*/

});