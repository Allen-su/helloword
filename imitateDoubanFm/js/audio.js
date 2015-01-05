define(function(require, exports, module){

	var audio = {
		allSound : ['test.mp3', 'test1.mp3', 'test2.mp3', 'test3.mp3'],//播放列表，以后要配置到sound文件中
		curIndex : 0, //当前播放到列表第几首
		curAudio : null,//当前播放歌曲
		paused : 'yes',
		url : 'sound/',//歌曲uri，以后要配置到sound文件中
	};

	//播放
	audio.play = function(){
		if ( !this.curAudio ) {
			this.curAudio = new Audio( this.url + this.allSound[this.curIndex] );
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
		this.curAudio.src = this.url + this.allSound[this.curIndex];
		this.play();
	};

	//初始化
	audio.init = function(){
		this.curAudio.addEventListener( 'ended', $.proxy(function(){
			this.next();
		}, this));
	};

	//配置对象，暂时没用
	audio.initConfig = function(config){
		audio.config = config;
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
});