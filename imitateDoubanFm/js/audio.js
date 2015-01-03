define(function(require, exports, module){

	var audio = {
		allSound : ['test.mp3', 'test1.mp3', 'test2.mp3', 'test3.mp3'],
		curIndex : 0,
		curAudio : null,
		paused : 'yes',
		url : 'sound/',
	};

	audio.play = function(){
		if ( !this.curAudio ) {
			this.curAudio = new Audio( this.url + this.allSound[this.curIndex] );
			this.init();
		}
		this.curAudio.play();
		this.paused = 'no';
	};

	audio.pause = function(){
		if ( this.curAudio ){
			this.curAudio.pause();
		} else {
			this.play();
		}
		this.paused = 'yes';
	};

	audio.next = function(){
		if ( ++this.curIndex && this.curIndex  >= this.allSound.length ) {
			this.curIndex = 0;
		}
		this.curAudio.src = this.url + this.allSound[this.curIndex];
		this.play();
	};

	audio.init = function(){
		this.curAudio.addEventListener( 'ended', $.proxy(function(){
			this.next();
		}, this));
	};

	module.exports = audio;
});