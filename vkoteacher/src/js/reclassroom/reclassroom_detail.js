window.vko = window.vko || {};
vko.com = vko.com || {};

(function($){
	vko.com.reclassroom = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		this.courses = {};
		this.init();
	};

	vko.com.reclassroom.prototype = {
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
			viewHTML.push(	'<section class="detail_wrap">');
			viewHTML.push(		'<section class="title">'+this.data.title+'</section>');
			viewHTML.push(		'<section class="desc">'+this.data.goal+'</section>');
			viewHTML.push(		'<section class="cycle">');
			viewHTML.push(			'<div>学习周期 : '+ this.data.cycle.replace('-',' 至 ')+'</div>');
			viewHTML.push(			'<div>课堂日期 : '+this.data.reclassroomDate+'</div>');
			viewHTML.push(		'</section>');
			viewHTML.push(		'<section class="vedio_list"></section>');
			viewHTML.push(	'</section>');
			viewHTML.push('</section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.getCourses();
			this.bindEvent();
		},

		getCourses: function() {
			var self = this;
			//if ( start == 0 ) { this.courses = {}; }
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillCourses(msg.data);
					} else {
						self.fillCourses(setCoursesPhonyData());
					}
				}
			});
		},

		fillCourses: function(data) {
			var html = [], item;
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				html.push('<div class="vedio_item" data-id="'+item.id+'">');
				html.push(	'<div class="avatar">');
				html.push(		'<img src="'+item.poster+'" alt="课程" />');
				html.push(		'<i></i>');
				html.push(	'</div>');
				html.push(	'<div class="desc">');
				html.push(		'<div class="title">'+item.title+'</div>');
				html.push(		'<div class="deadline">'+item.cycle+'</div>');
				html.push(		'<div class="grade">'+item.grade+'</div>');
				html.push(	'</div>');
				html.push('</div>');
				this.courses[item.id] = item;
			}
			$('.vedio_list', this.view).html(html.join(''));
			this.scrollAble();
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
			$('.vedio_list',this.view).on('click', '.vedio_item', function(){
				new vko.com.reclassroomPlay({data:self.courses[this.getAttribute('data-id')], prePage: self.view});
			});

		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};


	function setCoursesPhonyData(){
		var data = [
			{id:'1',title:'和熊孩子过招的心理战术1',author:'李维宗',poster:'../img/course.jpg',
				courseSrc:'../img/course.mp4',grade:'高二三班',submitDate:'2014.12.5',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'2',title:'和熊孩子过招的心理战术2',author:'李维宗',poster:'../img/course.jpg',
				courseSrc:'../img/course.mp4',grade:'高二三班',submitDate:'2014.12.5',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'3',title:'和熊孩子过招的心理战术3',author:'李维宗',poster:'../img/course.jpg',
				courseSrc:'../img/course.mp4',grade:'高二三班',submitDate:'2014.12.5',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'4',title:'和熊孩子过招的心理战术4',author:'李维宗',poster:'../img/course.jpg',
				courseSrc:'../img/course.mp4',grade:'高二三班',submitDate:'2014.12.5',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'5',title:'和熊孩子过招的心理战术5',author:'李维宗',poster:'../img/course.jpg',
				courseSrc:'../img/course.mp4',grade:'高二三班',submitDate:'2014.12.5',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
		];
		return data;
	}

})($);