window.vko = window.vko || {};
vko.com = vko.com || {};

(function($){
	vko.com.moocPlay = function(options){
		//TODO:初始化需要的数据 this.最好name,autor,time,报名数都从上一页传过来
		this.id = options.id;
		this.name = options.name;
		this.data = options.data;
		this.prePage = options.prePage;
		this.init();
	};

	vko.com.moocPlay.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">MOOC</div>');
			viewHTML.push(	'<div class="title_right">');
			viewHTML.push(		'<div class="search"></div>');
			viewHTML.push(	'</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap bg_white"><div>');
			viewHTML.push(	'<section class="play_box">');
			viewHTML.push(		'<div class="title">和熊孩子过招的心理战术</div>');
			viewHTML.push(		'<video preload="auto">');
			viewHTML.push(			'<source src="../img/course.mp4" type="video/mp4" >');
			viewHTML.push(		'</video>');
			viewHTML.push(		'<div class="info">');
			viewHTML.push(			'<span>主要讲师：李维宗</span>');
			viewHTML.push(			'<span>20分15秒</span>');
			viewHTML.push(			'<span>126人报名</span>');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section>');
			viewHTML.push(	'<ul class="tabs clearfix">');
			viewHTML.push(		'<li data-tab="list" class="list cur" >选课</li>');
			viewHTML.push(		'<li data-tab="info" class="info" >课程详情</li>');
			viewHTML.push(		'<li data-tab="group" class="group" >讨论组</li>');
			viewHTML.push(	'</ul>');
			viewHTML.push(	'<section class="course">');
			viewHTML.push(		'<section data-tab="list" class="vedio_list" style="display:block" ></section>');
			viewHTML.push(		'<section data-tab="info" class="info" ></section>');
			viewHTML.push(		'<section data-tab="group" class="group" ></section>');
			viewHTML.push(	'</section>');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.getData();
			this.bindEvent();
		},

		getData: function() {

		},

		fillData: function(){

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

			$('.title_right',this.view).bind('click',function(){
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