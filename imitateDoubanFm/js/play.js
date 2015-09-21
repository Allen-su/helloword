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
		intervalId,
		playingLabel = $('.playing_label li');

	var channel = $('.channel'),
		likeEl = $('.like'),
		audioInfo = $('.audio_info'),
		songTitleEl = $('.audio_info .name '),
		songAuthorEl = $('.audio_info .author '),
		detailEl = $('#detail')[0],
		transform = typeof detailEl.style.transform !== 'undefined' ? 'transform' : 'webkitTransform',
		clickEvent = 'click';

	if ( navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ||
		navigator.userAgent.match(/Android/i)) {
		clickEvent = 'touchend';
	}

	//绑定开始暂停事件
	function pauseOpa() {
		var top = parseInt( /translate\(0px,(.*)\) translateZ\(0px\)/.exec(detailEl.style[transform])[1], 10 );
		pause.css('z-index', 100);
		bg.css('z-index', 99);
		isPlay = 'no';
		audio.pause();
		playingLabel.css('animation-iteration-count', '0');
		if ( slidePanel.slide.defaultTop != top) {//用于判断当前歌曲信息页拉起
			setTimeout(function(){
				channel[0].style.opacity = 0.5;
				audioInfo[0].style.opacity = 0.5;
			}, 0);
		}
	}

	function playOpa() {
		var top = parseInt( /translate\(0px,(.*)\) translateZ\(0px\)/.exec(detailEl.style[transform])[1], 10 );
		pause.css('z-index', 99);
		bg.css('z-index', 100);
		isPlay = 'yes';
		audio.play();
		playingLabel.css('animation-iteration-count', 'infinite');
		if ( slidePanel.slide.defaultTop != top) {//用于判断当前歌曲信息页拉起
			setTimeout(function(){
				channel[0].style.opacity = 1;
				audioInfo[0].style.opacity = 1;
			}, 0);
		}
	}

	function controlMusic(e) {
		if ( slidePanel.draging ) { return; }
		if ( isPlay == 'yes' ) {
			pauseOpa();
		} else {
			playOpa();
		}
	}
	$('.control')[0].addEventListener(clickEvent, controlMusic, false);

	//绑定下一曲事件
	function nextMusic(e) {
		if ( slidePanel.draging ) { return; }
		audio.next();
	}
	$('.next')[0].addEventListener(clickEvent, nextMusic, false);

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
	likeEl[0].addEventListener(clickEvent, likeMusic, false);

	//删除歌曲
	function delMusic(e) {
		if ( slidePanel.draging ) { return; }
		audio.del();
	}
	$('.delete')[0].addEventListener(clickEvent, delMusic, false);

	audio.initConfig({
		playCallback: function(song){
			songTitleEl.text(song.title);
			songAuthorEl.text(song.author);
			playOpa();
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

	function isPlaying() {
		return isPlay;
	}
	slidePanel.isPlaying = isPlaying;

});