define(function(require, exports, module){
	require('jquery');
	//进度条默认参数
	var _default = {
		size : 45,//进度条canvas的边长
		selector : '#progress',//当前进度条canvas 的选择器
		radius : 0 //半径，根据size得到
	};
	//圆形进度条
	var Progress = function(option){
		var key,
			prop = $.extend({}, _default, option);//覆盖默认参数
		for ( key in prop ) {
			this[key] = prop[key];
		}
		this.radius = this.size / 2;
		this.canvas = $(this.selector);
	};


	Progress.prototype = {
		//画出进度条
		draw : function( percent ){
			var self = this;
			this.canvas.each(function(){
				var text = $(this).text();
				var process = text.substring(0, text.length-1);
				var canvas = this;
				var context = canvas.getContext('2d');
				context.clearRect(0, 0, self.size, self.size);
				context.beginPath();
				context.moveTo(self.radius, self.radius);
				context.arc(self.radius, self.radius, self.radius, 0, Math.PI * 2 * percent, false);
				context.closePath();
				context.fillStyle = '#2a2';
				context.fill();
				$(this).text( percent );
			});
		},
		//调整进度条的size
		setSize : function( size ){
			this.size = size;
			this.radius = this.size / 2;
			this.canvas.attr({width:size,height:size});
		}
	};
	exports.Progress = Progress;

});