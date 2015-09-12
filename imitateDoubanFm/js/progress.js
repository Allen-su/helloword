define(function(require, exports, module){
	require('jquery');
	//进度条默认参数
	var _default = {
		size : 122,//进度条canvas的边长
		selector : '#progress'//当前进度条canvas 的选择器
	};
	//圆形进度条
	var Progress = function(option){
		var key,
			prop = $.extend({}, _default, option);//覆盖默认参数
		for ( key in prop ) {
			this[key] = prop[key];
		}
		this.canvas = $(this.selector);
	};


	Progress.prototype = {
		//画出进度条
		draw : function( percent ){
			var self = this;
			this.canvas.each(function(){
				var canvas = this;
				var context = canvas.getContext('2d');
				context.clearRect(0, 0, self.size, self.size);
				context.beginPath();
				context.arc(61, 61, 58, -0.5 * Math.PI, ( percent * 2 - 0.5) * Math.PI);
				context.strokeStyle = '#2a2';
				context.lineWidth = 5;
				context.lineCap = 'round';
				context.stroke();
			});
		}
	};
	exports.Progress = Progress;

});