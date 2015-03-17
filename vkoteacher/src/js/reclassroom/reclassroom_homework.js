window.vko = window.vko || {};
vko.com = vko.com || {};

(function($){
	vko.com.reclassroomHomework = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		//this.courses = {};
		this.init();
	};

	vko.com.reclassroomHomework.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back"></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">');
			viewHTML.push(		'查看作业');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title_right">');
			viewHTML.push(		'<i class="filter"></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<section class="filter_box"></section>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section class="qid"></section>');
			viewHTML.push(	'<section class="question_answer"></section>');
			viewHTML.push(	'<section class="data_statistical"></section>');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.initialize = true;
			this.getHomework();
			this.bindEvent();
		},

		getHomework: function() {
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillHomework(msg.data);
					} else {
						self.fillHomework(setHomeworkPhonyData());
					}
				}
			});
		},

		fillHomework: function(data) {
			var questionHtml = [],klassHtml = [], item, i = 0, len = 0;
			if ( data.questions.length === 0 ) {
				//TODO:空白页
			}

			questionHtml.push('<span class="cur" data-id="'+data.questions[0].id+'" data-anwser="'+
				data.questions[0].anwser+'">1</span>');
			for ( i = 1, len = data.questions.length; i < len; i++ ) {
				item = data.questions[i];
				questionHtml.push('<span data-id="'+item.id+'" data-anwser="'+item.anwser+'">'+(i+1)+'</span>');
				//this.courses[item.id] = item;
			}

			klassHtml.push('<div class="filter_item cur" data-id="all">全部</div>');
			for ( i = 1, len = data.klass.length; i < len; i++ ) {
				item = data.klass[i];
				klassHtml.push('<div class="filter_item" data-id="'+item.id+'">'+item.name+'</div>');
				//this.courses[item.id] = item;
			}
			$('.qid', this.view).html(questionHtml.join(''));
			$('.filter_box', this.view).html(klassHtml.join(''));
			if ( this.initialize ) {
				this.curData = {};
				this.curData.klass = 'all';
				this.curData.curQuestion = data.questions[0].id;
				this.getStatistics({qid: data.questions[0].id, klass: 'all'});
				$('.question_answer').html('单选题 正确答案：' + data.questions[0].anwser);
			}
		},

		getStatistics: function(data) {
			var self = this;
			this.initialize = false;
			//this.curData;
			$.ajax({
				url: '',//根据题号和班级获取
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillStatistics(msg.data);
					} else {
						self.fillStatistics(setStatisticsPhonyData());
					}
				}
			});
		},

		fillStatistics: function(data) {
			var html = [], anwser, item;
			for ( anwser in data ) {
				html.push('<div class="item">');
				html.push(	'<div class="count">选择 '+anwser+' 共'+data[anwser].length+'人</div>');
				html.push('	<div class="student">');
				for ( var i = 0, len = data[anwser].length; i < len; i++ ) {
					item = data[anwser][i];
					html.push('	<span>'+item+'</span>');
				}
				html.push('	</div>');
				html.push('</div>');
			}
			
			$('.data_statistical', this.view).html(html.join(''));
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
			var self = this, filter_box = $('.filter_box', this.view);
			$('.title_left',this.view).bind('click', function(){
				self.backPrePage();
			});
			$('.title_right',this.view).bind('click', function(){
				filter_box.toggle();
				return false;
			});
			$('.filter_box',this.view).on('click', '.filter_item', function(){
				self.switchQuestion($(this));
				return false;
			});
			$('.scroll_wrap', this.view).bind('touchmove click', function(){
				filter_box.css({display:'none'});
			});
			$('.qid', this.view).on('click', 'span', function(){
				self.switchClass($(this));
			});
		},

		switchClass: function($el){
			$el.addClass('cur').siblings().removeClass('cur');
			this.getStatistics();
			this.curData.klass = $el.attr('data-id');
			$('.question_answer').html('单选题 正确答案：' + $el.attr('data-anwser'));
		},

		switchQuestion: function($el){
			$el.addClass('cur').siblings().removeClass('cur');
			$('.filter_box', this.view).css({display:'none'});
			this.curData.curQuestion = $el.attr('data-id');
			this.getStatistics();
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};


	function setHomeworkPhonyData(){
		var data = {
			questions : [
				{id: 0, anwser: 'A', type: '单选题'},
				{id: 0, anwser: 'B', type: '单选题'},
				{id: 0, anwser: 'B', type: '单选题'},
				{id: 0, anwser: 'C', type: '单选题'},
				{id: 0, anwser: 'D', type: '单选题'},
				{id: 0, anwser: 'C', type: '单选题'},
				{id: 0, anwser: 'B', type: '单选题'},
				{id: 0, anwser: 'A', type: '单选题'}
			],
			klass : [
				{id: 0, name: '高二三班'},
				{id: 0, name: '高三一班'},
				{id: 0, name: '高三二班'}
			]
		};
		return data;
	}

	function setStatisticsPhonyData(){
		var name = Math.random() > 0.5 ? '李羽华' : '蒋欣';
		var data = {
			'A': [ name,'许雷', '赵一佳', '蒋欣', '服部平次'],
			'B': ['李羽华','许雷', '赵一佳', '蒋欣', '服部平次'],
			'C': ['李羽华','许雷', '赵一佳', '蒋欣', '服部平次'],
			'D': ['李羽华','许雷', '赵一佳', '蒋欣', '服部平次']
		};
		return data;
	}

})($);

