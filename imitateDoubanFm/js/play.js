define(function(require, exports, module){
	require('jquery');
	var audio = require('audio'),//获取audio对象
		slidePanel = require('slide_canvas'),
		progressBox = $('.progress'),
		canvas = $('#progress')[0],
		Progress = require('progress');
	
	var isPlay = 'yes' ,
		pause = $('.pause'),
		bg = $('.control_bg'),
		progressBar = new Progress.Progress(),//创建进度条对象
		time,
		intervalId;

	var channel = $('.channel'),
		likeEl = $('.like'),
		audioInfo = $('.audio_info'),
		songTitleEl = $('.audio_info .name '),
		songAuthorEl = $('.audio_info .author '),
		detailEl = $('#detail')[0],
		transform = typeof detailEl.style.transform !== 'undefined' ? 'transform' : 'webkitTransform';

	//绑定开始暂停事件
	function controlMusic(e) {
		if ( slidePanel.draging ) { return; }
		var top = parseInt( /translate\(0px,(.*)\) translateZ\(0px\)/.exec(detailEl.style[transform])[1], 10 );
		if ( isPlay == 'yes' ) {
			pause.css('z-index', 100);
			bg.css('z-index', 99);
			isPlay = 'no';
			audio.pause();
			if ( slidePanel.slide.defaultTop != top) {//用于判断当前歌曲信息页拉起
				setTimeout(function(){
					channel[0].style.opacity = 0.5;
					audioInfo[0].style.opacity = 0.5;
				}, 0);
			}
			//clearInterval(intervalId);
		} else {
			pause.css('z-index', 99);
			bg.css('z-index', 100);
			isPlay = 'yes';
			audio.play();
			if ( slidePanel.slide.defaultTop != top) {//用于判断当前歌曲信息页拉起
				setTimeout(function(){
					channel[0].style.opacity = 1;
					audioInfo[0].style.opacity = 1;
				}, 0);
			}
		}
	}
	$('.control')[0].addEventListener('click', controlMusic, false);
	$('.control')[0].addEventListener('touchend', controlMusic, false);

	//绑定下一曲事件
	function nextMusic(e) {
		if ( slidePanel.draging ) { return; }
		pause.css('z-index', 99);
		bg.css('z-index', 100);
		isPlay = 'yes';
		audio.next();
	}
	$('.next')[0].addEventListener('click', nextMusic, false);
	$('.next')[0].addEventListener('touchend', nextMusic, false);

	//绑定like 歌曲
	function likeMusic(e) {
		if ( slidePanel.draging ) { return; }
		var song = audio.allSound[audio.curIndex];
		if ( song.like ) {
			this.style.backgroundImage = 'url(img/unlike.png)';
			song.like = false;
		} else {
			this.style.backgroundImage = 'url(img/like.png)';
			song.like = true;
		}
	}
	likeEl[0].addEventListener('click', likeMusic, false);
	likeEl[0].addEventListener('touchend', likeMusic, false);

	//删除歌曲
	function delMusic(e) {
		if ( slidePanel.draging ) { return; }
		audio.del();
	}
	$('.delete')[0].addEventListener('click', delMusic, false);
	$('.delete')[0].addEventListener('touchend', delMusic, false);

	audio.initConfig({
		playCallback: function(song){
			songTitleEl.text(song.title);
			songAuthorEl.text(song.author);
			if ( song.like ) {
				likeEl[0].style.backgroundImage = 'url(img/like.png)';
			} else {
				likeEl[0].style.backgroundImage = 'url(img/unlike.png)';
			}
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
		} ,100);
	}
	/*module.exports = {
		progress : progressBar
	};*/

});