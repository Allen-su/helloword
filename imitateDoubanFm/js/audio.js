define(function(require, exports, module){
	var sounds = require('songs');
	var audio = {
		allSound : $.extend([], sounds),//播放列表，以后要配置到sound文件中
		curIndex : 0, //当前播放到列表第几首
		curAudio : null,//当前播放歌曲
		paused : 'yes'
	};

	//播放
	audio.play = function(){
		if ( !this.curAudio ) {
			this.curAudio = new Audio( this.allSound[this.curIndex].path );
			this.init();
		}
		this.curAudio.play();
		this.paused = 'no';
	};

	//暂停
	audio.pause = function(){
		if ( this.curAudio ){
			this.curAudio.pause();
		} else {
			this.play();
		}
		this.paused = 'yes';
	};

	//下一曲
	audio.next = function(){
		if ( ++this.curIndex && this.curIndex  >= this.allSound.length ) {
			this.curIndex = 0;
		}
		this.curAudio.src = this.allSound[this.curIndex].path;
		this.config.playCallback(this.allSound[this.curIndex]);
		this.play();
	};

	//删除当前播放歌曲
	audio.del = function(){
		if ( this.allSound.length === 1 ) { return; }
		this.next();
		this.allSound.splice(this.curIndex === 0 ? this.allSound.length - 1 : this.curIndex - 1, 1);
	};

	//初始化
	audio.init = function(){
		this.config.playCallback(this.allSound[this.curIndex]);
		this.curAudio.addEventListener( 'ended', $.proxy(function(){
			this.next();
			this.config.playCallback(this.allSound[this.curIndex]);
		}, this));
	};

	
	audio.config = {
		playCallback: function(){}
	};
	
	audio.initConfig = function(config){
		this.config.playCallback = config.playCallback;
	};

	//获取当前播放歌曲总时间与当前播放时间
	audio.getTime = function(){
		if( !this.curAudio ) { throw new Error('There is no play songs'); }
		return {
			curTime : this.curAudio.currentTime || 0,
			allTime : this.curAudio.duration || 0
		};
	};

	module.exports = audio;


	//切换频道
	var playingLabel = $('<ul class="playing_label"><li></li><li></li><li></li><li></li></ul>');
	$('#channel dd:first').append(playingLabel);
	$('#channel').on('click', 'dd', function(e){
		$(this).append(playingLabel);
		audio.allSound = $.extend([], sounds);
		audio.curIndex = -1;
		audio.next();
	});


});