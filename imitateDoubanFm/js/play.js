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


	var rlrc = /^\[(\d{2}):(\d{2}).\d{2}\](.*)/,
		lrcMap = {},
		lyricShowHalfHeight = $('#lyric .content')[0].offsetHeight / 2,
		lyricWrap = $('#lyric .scroller')[0],
		lrcScroll = new IScroll('#lyric .content', { scrollY: true, freeScroll: true, mouseWheel: true, click: true}),
		lyricPanelEl = $('#lyric')[0],
		lyricTitleEl = $('#lyric .title'),
		lyricAuthorEl = $('#lyric .author'),
		lyricPanelHide = true;
	lyricPanelEl.style.display = 'none'; //先设 none 后拿不到高度

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
		getLrc();
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
		getLrc();
	}
	$('.delete')[0].addEventListener(clickEvent, delMusic, false);

	//显示歌词
	$('.extra_opa .lyric')[0].addEventListener(clickEvent, function(e) {
		lyricPanelHide = false;
		lyricPanelEl.style.display = 'block';
		lrcScroll.refresh();
	}, false);
	lyricPanelEl.addEventListener('click', function(e) {
		lyricPanelHide = true;
		lyricPanelEl.style.display = 'none';
	}, false);


	audio.initConfig({
		playCallback: function(song){
			songTitleEl.text(song.title);
			lyricTitleEl.text(song.title);
			songAuthorEl.text(song.author);
			lyricAuthorEl.text(' / ' + song.author);
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
	getLrc();

	//调整进度
	function drawProgress() {
		var curIntTime, preLrc = null, lrc;
		intervalId = setInterval( function(){
			if ( isPlay === 'yes' ) {
				time = audio.getTime();
				progressBar.draw(time.curTime / time.allTime);
				curIntTime = parseInt(time.curTime, 10);
				lrc = lrcMap[curIntTime];
				if ( lrc &&  lrc !== preLrc ) {
					lrc.className = 'active';
					preLrc = preLrc ? ( preLrc.className = '', lrc ) : lrc;
					lrcScroll.scrollToElement(lrc, 0, 0, -lyricShowHalfHeight);
				}
				//lrcScroll.refresh();
			}
			
		} ,100);
	}


	function getLrc() {
		var music = audio.allSound[audio.curIndex];
		if ( !music.lrcPaht ) {
			lrcMap = {};
			var blankDiv = document.createElement('div'),
				contentDiv = blankDiv.cloneNode();
			blankDiv.style.height = lyricShowHalfHeight + 'px';//居中显示内容
			contentDiv.innerHTML = '没有歌词';
			lyricWrap.innerHTML = '';
			lyricWrap.appendChild(blankDiv);
			lyricWrap.appendChild(contentDiv);
			return;
		} else {
			/*$.ajax({
				url: 'lrc/m7.lrc',
				type: 'get',
				success: function(res) {
					fillLrc(res);
				}
			});*/
			var res = "[00:17.84]Watching the minute hand [00:19.56]Frozen solid not moving [00:25.80]Still we believe we can [00:27.77]But we're afraid of losing [00:33.86]Watching from over here [00:35.78]It's hardly worth competing [00:42.06]I'm almost out of here [00:44.09]Why break a heart that's beating? [00:47.95] [00:50.02]Just as I start giving up [00:54.19]I'm not backing off [00:57.99] [00:58.17]Running to the light [00:59.94]Get out of your own way [01:02.16]Not afraid to fight [01:03.67]Believing what you say [01:06.24]I'll hold on till the night [01:14.30]Hanging by a thread [01:15.83]I'm not scared to let go [01:18.40]Thoughts inside your head [01:19.95]They creep up to get you [01:22.46]I believe this is right [01:28.20]So I'll hold on til the night [01:32.72] [01:39.18]I climbed up on a tree [01:41.03]To get a new perspective [01:47.07]If love is worth a dime [01:48.99]The price is being rejected [01:54.24] [01:55.21]Just as I start falling down [01:59.07]I turn this around [02:03.03] [02:03.20]Running to the light [02:04.51]Get out of your own way [02:07.12]Not afraid to fight [02:08.61]Believing what you say [02:11.29]I'll hold on till the night [02:19.35]Hanging by a thread [02:20.90]I'm not scared to let go [02:23.37]Thoughts inside your head [02:24.95]They creep up to get you [02:27.49]I believe this is right [02:33.42]So I'll hold on til the night [02:38.72] [02:39.98]Hold on til I'm with you [02:44.14]All I've got to give you [02:47.78]All my fears are slowly fading to never know [02:53.40]Yes I start running running running running! [02:56.40] [02:56.61]Running to the light [02:58.48]Get out of your own way [02:59.96]Not afraid to fight [03:01.54]Believing what you say [03:04.12]I'll hold on till the night [03:10.90](Believe that this is the night) [03:12.23]Hanging by a thread [03:13.77]I'm not scared to let go [03:16.24]Thoughts inside your head [03:17.80]They creep up to get you [03:20.35]I believe this is right [03:26.13]So I'll hold on til the night [03:29.59]";
			fillLrc(res);
		}
			
	}

	//rlrc = /^\[(\d{2}):(\d{2}).\d{2}\](.*)/; [00:17.84]
	function fillLrc(res) {
		var lrc = res.replace(/\[/g, '&&&[').split('&&&');
		var item, time, sentence;
		var frag = document.createDocumentFragment(),
			sentenceDiv = document.createElement('div'),
			blankDiv = sentenceDiv.cloneNode(),
			cloneDiv = null;

		lrcMap = {};
		lyricWrap.innerHTML = '';
		blankDiv.style.height = lyricShowHalfHeight + 'px';
		frag.appendChild(blankDiv);//居中显示歌词，前面添加一个空白 div
		for ( var i = 1, len = lrc.length; i < len; i++ ) {
			item = rlrc.exec(lrc[i]);
			time = parseInt(item[1], 10) * 60 + parseInt(item[2], 10);
			sentence = item[3];
			cloneDiv = sentenceDiv.cloneNode();
			cloneDiv.id = time;
			cloneDiv.innerHTML = sentence;
			frag.appendChild(cloneDiv);
			lrcMap[time] = cloneDiv;
		}
		lyricWrap.appendChild(frag);
		lrcScroll.refresh();
	}

	//当前是否在播放歌曲
	function isPlaying() {
		return isPlay;
	}
	slidePanel.isPlaying = isPlaying;



});