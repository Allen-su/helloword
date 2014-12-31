define(function(require, exports, module){
	require('jquery');

	var controlBox = $('#control_box'),
		footer = $('#menu');
	var slide = {
		maxHeight: 410,//滑动的最高距离
		minHeight: 55,//控制栏显示最小高度
		autoDistance: 270,//超过此距离可以自动到达maxHeight值
	},
	progressData = {
		initTop: 0,
		initLeft: 30,
		initSize: 45,
		finalTop: 40,
		finalLeft: 102,
		finalSize: 120,
		curHeight: 0
	},
	pauseData = {
		initTop: 2,
		initLeft: 32,
		initSize: 41,
		finalTop: 42,
		finalLeft: 0,
		finalSize: 110,
		curHeight: 0
	};

	var Linkage = (function(){
		var wrapWidth = $('.wrapper').width(),
			progress = $('.progress'),
			controlBg = $('.control_bg'),
			pause = $('.pause'),
			slideDistance = slide.maxHeight - slide.minHeight;

		progressData.initTop = parseInt( progress.css('top') , 10 ) || 0;
		progressData.initLeft = parseInt( progress.css('left') , 10 ) || 0;
		progressData.initSize = parseInt( progress.css('width') , 10 ) || 0;
		progressData.finalLeft = ( wrapWidth - progressData.finalLeft ) / 2;
		progressData.percentSize = (progressData.finalSize - progressData.initSize) / slideDistance;
		progressData.percentTop = (progressData.finalTop - progressData.initTop) / slideDistance;
		progressData.percentLeft = (progressData.finalLeft - progressData.initLeft) / slideDistance;


		pauseData.initTop = parseInt( pause.css('top') , 10 ) || 0;
		pauseData.initLeft = parseInt( pause.css('left') , 10 ) || 0;
		pauseData.initSize = parseInt( pause.css('width') , 10 ) || 0;
		pauseData.finalLeft = ( wrapWidth - pauseData.finalLeft ) / 2;
		pauseData.percentSize = (pauseData.finalSize - pauseData.initSize) / slideDistance;
		pauseData.percentTop = (pauseData.finalTop - pauseData.initTop) / slideDistance;
		pauseData.percentLeft = (pauseData.finalLeft - pauseData.initLeft) / slideDistance;

		
		var progressMotion = function( height ){
			var size = height * progressData.percentSize,
				top = height * progressData.percentTop,
				left = height * progressData.percentLeft;
			progress.css({'width': size, 'height': size, 'top': top, 'left': left});
			console.log(size + '```' + top + '```' + left);
		};

		var pauseMotion = function( height ){
			var size = height * pauseData.percentSize,
				top = height * pauseData.percentTop,
				left = height * pauseData.percentLeft;
			pause.css({'width': size, 'height': size, 'top': top, 'left': left});
			controlBg.css({'width': size, 'height': size, 'top': top, 'left': left});
		};

		var progressInertia = function( toTop ){
			if ( toTop ) {
				progress.animate({
					'width': progressData.finalSize,
					'height': progressData.finalSize,
					'top': progressData.finalTop, 'left': progressData.finalLeft});
			} else {
				progress.animate({'width': progressData.initSize,
					'height': progressData.initSize,
					'top': progressData.initTop, 'left': progressData.initLeft});
			}
		};

		var pauseInertia = function( toTop ) {
			if ( toTop ) {
				pause.animate({
					'width': pauseData.finalSize,
					'height': pauseData.finalSize,
					'top': pauseData.finalTop, 'left': pauseData.finalLeft});
				controlBg.animate({
					'width': pauseData.finalSize,
					'height': pauseData.finalSize,
					'top': pauseData.finalTop, 'left': pauseData.finalLeft});
			} else {
				pause.animate({'width': pauseData.initSize,
					'height': pauseData.initSize,
					'top': pauseData.initTop, 'left': pauseData.initLeft});
				controlBg.animate({'width': pauseData.initSize,
					'height': pauseData.initSize,
					'top': pauseData.initTop, 'left': pauseData.initLeft});
			}
		};

		return {
			linkage : function( height ){
				progressMotion(height);
				pauseMotion(height);
			},
			inertia : function( toTop ){
				progressInertia(toTop);
				pauseInertia(toTop);
			}
		};
	})();


	//slide.initInfo();
	var dragDrop = function() {
		var draging = null,
			initY = 0,
			curHeight = 0;

		function slideEnd () {
			curHeight = controlBox.height();
			if ( curHeight >= slide.autoDistance ) {
				controlBox.animate({height:slide.maxHeight});
				Linkage.inertia( true );
			} else {
				controlBox.animate({height:slide.minHeight});
				Linkage.inertia( false );
			}
			draging = null;
			initY = 0;
		}
		function handler( e ) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			switch( e.type ){
				case 'mousedown' :
					if ( target == controlBox[0] || target == footer[0] ) {
						draging = controlBox;
					}
					initY = e.clientY;
					break;
				case 'mousemove' :
					curHeight = controlBox.height();
					var distance = initY -  e.clientY;
					if ( draging !== null &&
							( ( curHeight < slide.maxHeight && curHeight > slide.minHeight ) ||
								( curHeight == slide.maxHeight && distance < 0 ) ||
								( curHeight == slide.minHeight && distance > 0 ) )) {
						if ( target != controlBox[0] && target != footer[0] &&
								controlBox.has(target).length === 0 && footer.has(target).length === 0 ) {
							slideEnd();
							return;
						}
						controlBox.height( controlBox.height() + initY -  e.clientY );
						Linkage.linkage( curHeight );
						/*console.log(controlBox.height());
						console.log(e.clientY);
						console.log(initY);
						console.log('######################################');*/
						initY = e.clientY;
					}
					break;
				case 'mouseup' :
					slideEnd();
					break;
			}
		}
		return {
			enable : function(){
				$(document).bind('mousedown', handler)
						.bind('mousemove', handler)
						.bind('mouseup', handler);
			},
			disable : function(){
				$(document).unbind('mousedown', handler)
						.bind('mousemove', handler)
						.bind('mouseup', handler);
			}
		};
	};

	var touchMove = function() {
		var draging = null,
			initY = 0,
			curHeight = 0;
		function handler( e ){
			e = e || window.event;
			var target = e.target || e.srcElement;
				
			switch ( e.type ){
				case 'touchstart' :
					if ( target == controlBox[0] || target == footer[0] ) {
						draging = controlBox;
					}
					initY = e.touches[0].pageY;
					break;
				case 'touchmove' :
					curHeight = controlBox.height();
					var distance = initY -  e.changedTouches[0].pageY;
					if ( draging !== null &&
							( ( curHeight < slide.maxHeight && curHeight > slide.minHeight ) ||
								( curHeight == slide.maxHeight && distance < 0 ) ||
								( curHeight == slide.minHeight && distance > 0 ) )) {
						controlBox.height( controlBox.height() + initY -  e.changedTouches[0].pageY );
						initY = e.changedTouches[0].pageY;
						e.preventDefault();
					}
					break;

				case 'touchend' :
					curHeight = controlBox.height();
					if ( curHeight >= slide.autoDistance ) {
						controlBox.animate({height:slide.maxHeight});
					} else {
						controlBox.animate({height:slide.minHeight});
					}
					draging = null;
					initY = 0;
					break;
			}
		}
		return {
			enable : function(){
				document.addEventListener('touchstart', handler, false);
				document.addEventListener('touchmove', handler, false);
				document.addEventListener('touchend', handler, false);
			},
			disable : function(){
				document.removeEventListener('touchstart', handler);
				document.removeEventListener('touchmove', handler);
				document.removeEventListener('touchend', handler);
			}
		};

	};
	dragDrop().enable();
	touchMove().enable();

});