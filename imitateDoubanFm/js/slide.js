define(function(require, exports, module){
	require('jquery');

	var controlBox = $('#control_box'),
		footer = $('#menu');
	var slideParam = {
		maxHeight: 410,
		minHeight: 55,
		autoDistance: 270
	};

	var dragDrop = function() {
		var draging = null,
			initY = 0;
		function handler( e ) {
			e = e || window.event;
			var target = e.target || e.srcElement,
				curHeight = 0;
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
							( ( curHeight < slideParam.maxHeight && curHeight > slideParam.minHeight ) || 
								( curHeight == slideParam.maxHeight && distance < 0 ) || 
								( curHeight == slideParam.minHeight && distance > 0 ) )) {
						controlBox.height( controlBox.height() + initY -  e.clientY );
						/*console.log(controlBox.height());
						console.log(e.clientY);
						console.log(initY);
						console.log('######################################');*/
						initY = e.clientY;
					}
					break;
				case 'mouseup' :
					curHeight = controlBox.height();
					if ( curHeight >= slideParam.autoDistance ) {
						controlBox.animate({height:slideParam.maxHeight});
					} else {
						controlBox.animate({height:slideParam.minHeight});
					}
					draging = null;
					initY = 0;
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
	dragDrop().enable();
});