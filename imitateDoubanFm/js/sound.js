define(function(require, exports, module){

	var sound = {
		allSound : ['test.mp3', 'test1.mp3'],
		curIndex : 0,
		curAudio : null,
		paused : 'yes',
		url : 'sound/',
	};

	sound.play = function(){
		if ( !this.curAudio ) {
			this.curAudio = new Audio( this.url + this.allSound[this.curIndex] );
			this.init();
		}
		this.curAudio.play();
		this.paused = 'no';
	};

	sound.pause = function(){
		if ( this.curAudio ){
			this.curAudio.pause();
		} else {
			this.play();
		}
		this.paused = 'yes';
	};

	sound.next = function(){
		if ( ++this.curIndex && this.curIndex  >= this.allSound.length ) {
			this.curIndex = 0;
		}
		this.curAudio = null;
		this.curAudio.play();
	};

	sound.init = function(){
		this.curAudio.addEventListener( 'ended', $.proxy(this, function(){
			this.next();
		}));
	};

	module.exports = sound;
});