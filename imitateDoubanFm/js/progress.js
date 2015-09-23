define(function(require, exports, module){
	require('zepto');
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
				//一般画线宽比如1px 要把绘制点设置在一个像素的中间，这样两边各平分.5个像素刚好1px 绘制偶数的，绘制点取整数
				//所以这里在半径61的位置上 画 5px 的线，会变成在 61 的两侧各2.5px , 所以在58.5的位置上则会正好
				context.arc(61, 61, 58.5, -0.5 * Math.PI, ( percent * 2 - 0.5) * Math.PI);
				context.strokeStyle = '#6bbd7a';
				context.lineWidth = 5;
				context.lineCap = 'round';
				context.stroke();
			});
		}
	};
	exports.Progress = Progress;

});