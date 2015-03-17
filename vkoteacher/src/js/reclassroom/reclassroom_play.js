window.vko = window.vko || {};
vko.com = vko.com || {};

(function($){
	vko.com.reclassroomPlay = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		this.init();
	};

	vko.com.reclassroomPlay.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">列表页</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap">');
			viewHTML.push(	'<section class="play_wrap">');
			viewHTML.push(		'<section class="play_box">');
			viewHTML.push(			'<div class="title">'+this.data.title+'</div>');
			viewHTML.push(			'<video preload="auto">');
			viewHTML.push(				'<source src="'+this.data.courseSrc+'" type="video/mp4" >');
			viewHTML.push(			'</video>');
			viewHTML.push(			'<div class="menu">');
			viewHTML.push(				'<div class="search"></div>');
			viewHTML.push(			'</div>');
			viewHTML.push(		'</section>');
			viewHTML.push(		'<div class="info">');
			viewHTML.push(			'<div class="author">主要讲师：'+this.data.author+'</div>');
			viewHTML.push(			'<div class="data">在线学习时间：'+this.data.cycle.replace('-',' 至 ')+'</div>');
			viewHTML.push(			'<div class="data">在线提交作业：'+this.data.submitDate+'</div>');
			viewHTML.push(			'<div class="data">翻转课堂时间：'+this.data.reclassroomDate+'</div>');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section>');
			viewHTML.push('</section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			//this.scrollAble();
			this.prePage.style.display = 'none';
			this.bindEvent();
		},

//交互和绑定事件--------------------------------------------------------------------------------------
		scrollAble: function() {
			if ( this.scroll ) {
				this.scroll.refresh();
			} else {
				this.scroll = new IScroll( this.view.querySelector('.scroll_wrap'),
					{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true} );
			}
		},

		bindEvent: function() {
			var self = this;
			$('.title_left',this.view).bind('click', function(){
				self.backPrePage();
			});
			$('.menu .search', this.view).bind('click', function(){
				new vko.com.searchCourse({prePage:document.querySelector('.view')});
			});

		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

})($);