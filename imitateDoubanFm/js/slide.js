define(function(require, exports, module){
	require('jquery');
	var play = require('play');
	var controlBox = $('#control_box'),
		footer = $('#menu');
	var slide = {
		maxHeight: 410,//滑动的最高距离
		minHeight: 55,//控制栏显示最小高度
		autoDistance: 270,//超过此距离可以自动到达maxHeight值
	};
	
	//滑动时的其它联动效果********************************************************************
	var Linkage = (function(){
		var wrapWidth = $('.wrapper').width(),
			progress = $('.progress'),
			progressStyle = progress[0].style,
			controlBg = $('.control_bg'),
			controlBgStyle = controlBg[0].style,
			pause = $('.pause'),
			pauseStyle = pause[0].style,
			extras = $('.extras'),
			extrasStyle = extras[0].style,
			progressMinWidth = 2;//进度条最小宽度 2px
			progressMaxWidth = 5;//进度条宽度 5px
			slideDistance = slide.maxHeight - slide.minHeight;
		var progressData = { //进度条参数 （会变 大/小）
			initTop: 0,
			initLeft: 30,
			initSize: 45,
			finalTop: 60,
			finalLeft: 0,
			finalSize: 122,
			curHeight: 0
		},
		pauseData = { //播放按钮和歌曲背景图片参数 （会变 大/小）
			initTop: progressMinWidth,
			initLeft: progressData.initLeft + progressMinWidth,
			initSize: progressData.initSize - progressMinWidth * 2,
			finalTop: progressData.finalTop + progressMaxWidth,//和progress间距是5px
			finalLeft: 0,
			finalSize: progressData.finalSize - progressMaxWidth * 2,
			curHeight: 0
		},
		extrasData = { //控制栏会（喜欢，删除，下一首） 变宽 / 变窄
			initWidth: extras.width(),
			finalWidth: wrapWidth
		};


		progressData.initTop = parseInt( progress.css('top') , 10 ) || 0;
		progressData.initLeft = parseInt( progress.css('left') , 10 ) || 0;
		progressData.initSize = parseInt( progress.css('width') , 10 ) || 0;
		progressData.finalLeft = ( wrapWidth - progressData.finalSize ) / 2;


		pauseData.initTop = parseInt( pause.css('top') , 10 ) || 0;
		pauseData.initLeft = parseInt( pause.css('left') , 10 ) || 0;
		pauseData.initSize = parseInt( pause.css('width') , 10 ) || 0;
		pauseData.finalLeft = ( wrapWidth - pauseData.finalSize ) / 2;

		//公式: 获取当前元素位置: 
		//		( height - init1 ) / distance1 = ( x - init2 ) / distance2;
		//		x = distance2 * ( height -init1 ) / distance1 + init2
		var getCurPos = function( height, init2, distance2 ) {
			return distance2 * ( height - slide.minHeight ) / slideDistance + init2;
		};
		//根据鼠标移动**************************************
		var progressMotion = function( height ){
			progressStyle.display = 'none';
		};

		var pauseMotion = function( height ){
			controlBgStyle.height = controlBgStyle.width = 
				pauseStyle.height = pauseStyle.width = getCurPos(height, progressData.initSize,
					progressData.finalSize - progressData.initSize ) + 'px';
			controlBgStyle.top = pauseStyle.top = getCurPos(height, progressData.initTop,
					progressData.finalTop - progressData.initTop ) + 'px';
			controlBgStyle.left = pauseStyle.left = getCurPos(height, progressData.initLeft,
					progressData.finalLeft - progressData.initLeft ) + 'px';

			//console.log(controlBgStyle.height +'`````'+ pauseStyle.height);
		};
		//console.log(extrasData.initWidth + '````' + extrasData.finalWidth);
		var extrasMotion = function( height ){
			clearTimeout( arguments.callee.timeoutId );
			arguments.callee.timeoutId = setTimeout(function(){
				extrasStyle.width = getCurPos(height, extrasData.initWidth,
						extrasData.finalWidth - extrasData.initWidth ) + 'px';
			},10);
		};

		//惯性移动**********************************
		var progressInertia = function( toTop ){
			if ( toTop ) {
				progressStyle.width = progressData.finalSize + 'px';
				progressStyle.height = progressData.finalSize + 'px';
				progressStyle.top = progressData.finalTop + 'px';
				progressStyle.left = progressData.finalLeft + 'px';
			} else {
				progressStyle.width = progressData.initSize + 'px';
				progressStyle.height = progressData.initSize + 'px';
				progressStyle.top = progressData.initTop + 'px';
				progressStyle.left = progressData.initLeft + 'px';
			}
			progress.fadeIn();
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
					'top': pauseData.finalTop, 'left': pauseData.finalLeft}, function(){
						progressInertia( toTop );
					});
			} else {
				pause.animate({'width': pauseData.initSize,
					'height': pauseData.initSize,
					'top': pauseData.initTop, 'left': pauseData.initLeft});
				controlBg.animate({'width': pauseData.initSize,
					'height': pauseData.initSize,
					'top': pauseData.initTop, 'left': pauseData.initLeft}, function(){
						progressInertia( toTop );
					});
			}
		};

		var extrasInertia = function( toTop ) {
			if ( toTop ) {
				extras.animate({'width': extrasData.finalWidth});
			} else {
				extras.animate({'width': extrasData.initWidth});
			}
		};

		return {
			//按钮联动
			linkage : function( height ){
				progressMotion(height);
				pauseMotion(height);
				//extrasMotion(height);
			},
			//按钮惯性
			inertia : function( toTop ){
				//progressInertia(toTop);
				pauseInertia(toTop);
				extrasInertia(toTop);
			}
		};
	})();
	//**********************************************************************************************

	//鼠标拖动事件
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
					if ( $(target).closest('#control_box').length > 0 || 
						$(target).closest('#menu').length > 0 ) {
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

	//touch拖动事件
	var touchMove = function() {
		var draging = null,
			initY = 0,
			curHeight = 0;
		function handler( e ){
			e = e || window.event;
			var target = e.target || e.srcElement;
				
			switch ( e.type ){
				case 'touchstart' :
					if ( $(target).closest('#control_box').length > 0 || 
						$(target).closest('#menu').length > 0 ) {
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
						Linkage.linkage( curHeight );
						initY = e.changedTouches[0].pageY;
						e.preventDefault();
					}
					break;

				case 'touchend' :
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

	//启动***************************
	dragDrop().enable();
	touchMove().enable();

});