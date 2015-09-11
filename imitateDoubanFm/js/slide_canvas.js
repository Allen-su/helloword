define(function(require, exports, module){
	require('jquery');
	// var play = require('play');
	var footer = $('#footer'),
		control = $('.control'),
		menu = $('#menu'),
		detail = $('#detail'),
		translateY_exec = /translate\(0px,(.*)\) translateZ\(0px\)/,
		translate_exec = /translate\((.*),(.*)\) translateZ\(0px\)/,
		scale_exec = /scale\((0.4), 0.4\)/;

	var transform = typeof detail[0].style.transform !== 'undefined' ? 'transform' : 'webkitTransform',
		transitionDuration = typeof detail[0].style.transitionDuration !== 'undefined' ?
			'transitionDuration' : 'webkitTransitionDuration';
	var slide = {
		maxTop: -410,//滑动的最高距离
		defaultTop: 0,//控制栏显示最小高度
		autoDistance: -205,//超过此距离可以自动到达maxHeight值
		longSlideTime: 600,
		speed: Math.abs( -410 ) / 600
	};


	
	//滑动时的其它联动效果********************************************************************
	var Linkage = (function(){
		var controlEl = control[0],
			screenWidth = footer.width(),
			controlScaleMax = 1,
			controlScaleMin = 0.4,
			controlMoveMaxX = (screenWidth - 122) / 2,
			controlMoveMaxY = -300,
			controlMoveMinX = -20,
			controlMoveMinY = -99,
			controlMoveRangeX = controlMoveMaxX - controlMoveMinX,
			controlMoveRangeY = controlMoveMaxY - controlMoveMinY,

			menuEl = menu[0],
			menuMoveMaxX = 160,
			menuMoveMinX = 0,
			menuScaleMax = 0.8,
			menuScaleMin = 0.5;

		function controlButtonMotion(ratio) {
			ratio = Math.abs(ratio);
			var setTranslateX = controlMoveRangeX * ratio + controlMoveMinX,
				setTranslateY = controlMoveRangeY * ratio + controlMoveMinY,
				setScaleX = ratio * ( controlScaleMax - controlScaleMin ) + controlScaleMin;

			controlEl.style[transform] = 'scale('+setScaleX+', '+setScaleX+') translate('+
				setTranslateX+'px, '+setTranslateY+'px) translateZ(0px)';//里面不能包含分号
		}

		function controlButtoninertia(isUpSlide, time) {
			controlEl.style[transform] = isUpSlide ? 
				'scale('+controlScaleMax+', '+controlScaleMax+') translate('+
					controlMoveMaxX+'px, '+controlMoveMaxY+'px) translateZ(0px)' :
				'scale('+controlScaleMin+', '+controlScaleMin+') translate('+
					controlMoveMinX + 'px, '+ controlMoveMinY +'px) translateZ(0px)';
			controlEl.style[transitionDuration] = time + 'ms';
			setTimeout(function(){
				controlEl.style[transitionDuration] = '0ms';
			}, time);

		}

		function menuMotion(ratio) {
			ratio = Math.abs(ratio);
			var setTranslateX = menuMoveMaxX * ( 1 - ratio ),
				setScaleX = ratio * ( menuScaleMax - menuScaleMin ) + menuScaleMin;

			menuEl.style[transform] = 'scale('+setScaleX+', '+setScaleX+') translate('+
				setTranslateX+'px, 0) translateZ(0px)';
		}

		function menuInertia(isUpSlide, time) {
			menuEl.style[transform] = isUpSlide ? 
				'scale('+menuScaleMax+', '+menuScaleMax+') translate('+
					menuMoveMinX+'px, 0px) translateZ(0px)' :
				'scale('+menuScaleMin+', '+menuScaleMin+') translate('+
					menuMoveMaxX + 'px, 0px) translateZ(0px)';
			menuEl.style[transitionDuration] = time + 'ms';
			setTimeout(function(){
				menuEl.style[transitionDuration] = '0ms';
			}, time);
		}

		return {
			//按钮联动
			linkage : function( ratio ){
				controlButtonMotion(ratio);
				menuMotion(ratio);
			},
			//按钮惯性
			inertia : function( isUpSlide , time){
				controlButtoninertia(isUpSlide, time);
				menuInertia(isUpSlide, time);
			}
		};
	})();


	/*
	* 手指中途离开，靠惯性继续移动
	* @ isUpSlide 手指最后离开时移动的方向
	* @ endTime 手指按下的时间
	* @ beginTime 手指离开的时间
	*/
	function slideEnd (isUpSlide, endTime, beginTime) {
		var slideEl = detail[0];
		var top = parseInt( translateY_exec.exec(slideEl.style[transform])[1], 10 ) || 0;
		var speed =  slide.speed, time;
		if ( endTime - beginTime < 500 ) {//快速滑动松开
			if ( isUpSlide ) {
				time = Math.abs( slide.maxTop - top ) / speed;
				slideEl.style[transitionDuration] = time + 'ms';
				slideEl.style[transform] = 'translate(0px,  -410px) translateZ(0px)';
			} else {
				time = Math.abs( top - slide.defaultTop ) / speed;
				slideEl.style[transitionDuration] = time + 'ms';
				slideEl.style[transform] = 'translate(0px, 0px) translateZ(0px)';
			}
			Linkage.inertia(isUpSlide, time);
			setTimeout(function(){
				slideEl.style[transitionDuration] = '0ms';
			}, time);
		} else if ( top != slide.defaultTop && top != slide.maxTop ) {//慢滑松开
			if ( top <= slide.autoDistance ) {
				time = Math.abs( slide.maxTop - top ) / speed;
				slideEl.style[transitionDuration] = time + 'ms';
				slideEl.style[transform] = 'translate(0px,  -410px) translateZ(0px)';
			} else {
				time = Math.abs( top - slide.defaultTop ) / speed;
				slideEl.style[transitionDuration] = time + 'ms';
				slideEl.style[transform] = 'translate(0px, 0px) translateZ(0px)';
			}
			Linkage.inertia(top <= slide.autoDistance, time);
			setTimeout(function(){
				slideEl.style[transitionDuration] = '0ms';
			}, time);
		}
	}

	//鼠标拖动事件
	var dragDrop = function() {
		var draging = null,
			initY = 0,
			isUpSlide = true, //判断最后是否向上滑动
			beginTime = 0,
			endTime = 0;

		function handler( e ) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			switch( e.type ){
				case 'mousedown' :
					initY = e.clientY;
					if ( $(target).closest('#footer').length > 0 ) {
						draging = detail[0];
						beginTime = Date.now();
					}
					break;
				case 'mousemove' :
					var top ;
					if ( draging !== null ) {
						top = parseInt( translateY_exec.exec(draging.style[transform])[1], 10 ) || 0;
						distance = initY -  e.clientY;
						isUpSlide = distance > 0;
						if ( top >= -410 && top <= 0 ) {
							if ( !(top <= -410 && distance > 0) && !(top >= 0 && distance < 0) ) {
								distance = top - distance >= 0 ? 0 : top - distance <= -410 ?
									-410 : top - distance;
								draging.style[transform] =
									'translate(0px, ' + distance + 'px) translateZ(0px)';
								initY = e.clientY;
								Linkage.linkage( distance / 410 );
							}
						}
					}
					break;
				case 'mouseup' :
					draging = null;
					initY = 0;
					endTime = Date.now();
					slideEnd(isUpSlide, endTime, beginTime);
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
			isUpSlide = true, //判断最后是否向上滑动
			beginTime = 0,
			endTime = 0;

		function handler( e ){
			e = e || window.event;
			var target = e.target || e.srcElement;
			e.preventDefault();
			switch ( e.type ){
				case 'touchstart' :
					initY = e.touches[0].pageY;
					if ( $(target).closest('#footer').length > 0 ) {
						draging = detail[0];
						beginTime = Date.now();
						console.log(target);
					}
					break;
				case 'touchmove' :
					var top ;
					if ( draging !== null ) {
						top = parseInt( translateY_exec.exec(draging.style[transform])[1], 10 ) || 0;
						distance = initY -  e.changedTouches[0].pageY;
						isUpSlide = distance > 0;
						if ( top >= -410 && top <= 0 ) {
							if ( !(top <= -410 && distance > 0) && !(top >= 0 && distance < 0) ) {

								distance = top - distance >= 0 ? 0 : top - distance <= -410 ?
									-410 : top - distance;
								draging.style[transform] =
									'translate(0px, ' + distance + 'px) translateZ(0px)';
								initY = e.changedTouches[0].pageY;
								Linkage.linkage( distance / 410 );
							}
						}
					}
					break;
				case 'touchend' :
					draging = null;
					initY = 0;
					endTime = Date.now();
					slideEnd(isUpSlide, endTime, beginTime);
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