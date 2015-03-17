window.vko = window.vko || {};
vko.com = vko.com || {};

(function($){
	vko.com.homeworkDetail = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		this.answerStatistics = {};
		this.init();
	};

	vko.com.homeworkDetail.prototype = {
		init: function(){
			var viewHTML = [], picIcon;
			this.view = document.createElement('section');
			this.view.className = 'view';
			this.data.hasPic == '1' ? picIcon = '<i class="ispic"></i>': picIcon = '';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i><span>作业详情</span>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">');
			viewHTML.push(		'<ul><li class="cur">详情</li><li>统计</li></ul>');
			viewHTML.push(	'</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap bg_white"><div>');
			//详情页
			viewHTML.push(	'<section class="detail">');
			viewHTML.push(		'<div id="title" class="title">');
			viewHTML.push(			'<span>'+this.data.time+' '+this.data.name+'</span>');
			viewHTML.push(			'<i class="ispic"></i>');
			viewHTML.push(		'</div>');
			viewHTML.push(		'<div class="detail_list">');
			viewHTML.push(			'<div class="has_pic" style="display:none">');
			viewHTML.push(				'<div>');
			viewHTML.push(					'<div class="headline">作业图片</div>');
			viewHTML.push(					'<div class="pic_question"></div>');
			viewHTML.push(				'</div>');
			viewHTML.push(				'<div class="pic_answer_wrap">');
			viewHTML.push(					'<div class="headline">作业答案</div>');
			viewHTML.push(					'<div class="pic_question_answer"></div>');
			viewHTML.push(				'</div>');
			viewHTML.push(			'</div>');
			viewHTML.push(			'<div class="no_pic" style="display:none"></div>');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section>');
			//统计页
			viewHTML.push(	'<section class="statistics">');
			viewHTML.push(		'<section class="qid"></section>');
			viewHTML.push(		'<section class="question_answer"></section>');
			viewHTML.push(		'<section class="data_statistical"></section>');
			viewHTML.push(	'</section>');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.getDetail();
			this.getQuestionList();
			this.getAnswerStatistics();
			this.bindEvent();
		},

		//获取详情页数据
		getDetail: function( hwID ){
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillDetail(msg.data);
					} else {
						self.fillDetail(setPhonyDate());
					}
				}
			});
		},

		//获取当前问题统计页问题列表
		getQuestionList: function(){
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillQuestionList(msg.data);
					} else {
						self.fillQuestionList(setPhonyQuestionList());
					}
				}
			});
		},

		//获取当前问题统计页问题列表
		getAnswerStatistics: function(questionId){
			var self = this;
			questionId = questionId || $('.qid span', this.view).eq(0).attr('data-id');
			if ( !self.answerStatistics.questionId ) {
				$.ajax({
					url: '',
					type: 'get',
					datatype: 'json',
					success: function(msg){
						if ( msg.success ) {
							self.fillAnswerStatistics(msg.data);
							self.answerStatistics.questionId = msg.data;
						} else {
							self.fillAnswerStatistics(setPhonyAnswerStatistics());
						}
					}
				});
			} else {
				self.fillAnswerStatistics(self.answerStatistics.questionId);
			}
			
		},


		//@detail详情-------------------------------------------------------------------
		//填充
		fillDetail: function(data){
			if ( data.isPic === "true" ) {
				this.view.querySelector('.has_pic').style.display = 'block';
				$('#title', this.view).html('<span>'+data.title+'</span><i class="ispic"></i>');
				this.fillPicHomework(data);
				this.scrollAble();
			} else {
				this.view.querySelector('.no_pic').style.display = 'block';
				$('#title').html('<span>'+data.title+'</span>');
				this.fillTextHomework(data);
				this.scrollAble();
			}
		},

		//填充图片作业
		fillPicHomework: function(data){
			var questionFrag, answerFrag, questionClone, answerClone,
				questionEl = document.createElement('img'),
				answerEl = document.createElement('div'),
				item;
			questionFrag = document.createDocumentFragment();
			answerFrag = document.createDocumentFragment();
			answerEl.className = 'answer_item';

			for ( var i = 0, len = data.list.length; i < len; i++ ){
				item = data.list[i];
				questionClone = questionEl.cloneNode();
				questionClone.src = item.question;
				answerClone = answerEl.cloneNode();
				answerClone.innerHTML = '<span>'+(i+1)+'.'+item.questionType+'</span>';

				item.questionType === '主观题' ? answerClone.innerHTML += '<img src="'+item.answer+'" >'
							: answerClone.innerHTML += '<span>正确答案 : '+item.answer+'</span>';

				questionFrag.appendChild(questionClone);
				answerFrag.appendChild(answerClone);
			}
			this.view.querySelector('.pic_question').appendChild(questionFrag);
			this.view.querySelector('.pic_question_answer').appendChild(answerFrag);
			this.scrollAble();
		},

		//填充文本作业
		fillTextHomework: function(data) {
			var frag = document.createDocumentFragment(),
				questionEl = document.createElement('div'),
				questionClone;
			questionEl.className = 'item';
			for ( var i = 0, len = data.list.length; i < len; i++ ){
				item = data.list[i];
				questionClone = questionEl.cloneNode();
				questionClone.innerHTML = item.question +
					'<div class="answer"><span class="correct_answer">正确答案：'+item.answer+'</span></div>';
				frag.appendChild(questionClone);
			}
			this.view.querySelector('.no_pic').appendChild(frag);
			this.scrollAble();
		},


		//@statistics统计-------------------------------------------------------------------
		//填充统计页中的所有问题
		fillQuestionList: function(data) {
			var questionItem = document.createElement('span'),
				questionItemClone,
				frag = document.createDocumentFragment(),
				item;
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				questionItemClone = questionItem.cloneNode();
				questionItemClone.innerHTML = i + 1;
				questionItemClone.setAttribute('data-id',item.id);
				if ( i === 0 ) { questionItemClone.className = 'cur'; }
				frag.appendChild(questionItemClone);
			}
			this.view.querySelector('.qid').appendChild(frag);
			this.scrollAble();
		},

		//填充学生答案统计
		fillAnswerStatistics: function(data) {
			var item, html = [];
			if ( data.questionType != '主观题' ) {//非主观题答案统计
				$('.question_answer').html(data.questionType + ' 正确答案：' + (data.correctAnwser || ''));
				for ( item in data.anwser ) {
					html.push('<div class="item">');
					html.push(	'<div class="count">');
					html.push(		'选择 '+item+' 共'+data.anwser[item].length+'人');
					html.push(	'</div>');
					html.push(	'<div class="student">');
					html.push(		this.fillStudent(data.anwser[item]));
					html.push(	'</div>');
					html.push('</div>');
				}
			} else {//主观题答案统计
				$('.question_answer').html(data.questionType);
				html.push('<div class="item">');
				for ( var i = 0, len = data.anwser.length; i < len; i++ ) {
					item = data.anwser[i];
					html.push(	'<div class="subjectivity">');
					html.push(		'<div class="name">'+item.name+'</div>');
					html.push(		'<div class="pic">');
					html.push(			this.fillSubjectivityHW(item.img));
					html.push(		'</div>');
					html.push(	'</div>');
				}
				html.push('</div>');
			}
			
			$('.data_statistical', this.view).html(html.join(''));
			this.scrollAble();
		},

		//非主观题填充学生
		fillStudent: function(students) {
			var html = [];
			for ( var i = 0, len = students.length; i < len; i++ ) {
				html.push('<span>'+students[i]+'</span>');
			}
			return html.join('');
		},

		//主观题填充学生答案
		fillSubjectivityHW: function(imgList) {
			var html = [];
			for ( var i = 0, len = imgList.length; i < len; i++ ) {
				html.push('<div data-img="'+imgList[i]+'">图片作业</div>');
			}
			return html.join('');
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

			$('.title ul', this.view).on('click', 'li', function(){
				self.switchNav(this);
			});

			$('.qid', this.view).on('click', 'span', function(){
				self.switchQuestion(this);
			});
		},

		//详情统计切换
		switchNav: function(el){
			var that = $(el), detailEl = $('.detail', this.view), statisticsEl = $('.statistics', this.view);
			if ( that.index() === 0 ) {
				that.addClass('cur').next().removeClass('cur');
				detailEl.css('display','block');
				statisticsEl.css('display','none');
			} else {
				that.addClass('cur').prev().removeClass('cur');
				statisticsEl.css('display','block');
				detailEl.css('display','none');
			}
			this.scrollAble();
		},

		switchQuestion: function(el){
			var $el = $(el);
			$el.addClass('cur').siblings('span').removeClass('cur');
			this.getAnswerStatistics($el.attr('data-id'));
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}


	};



	//设置假数据
	function setPhonyDate(){
		var data = {}, random = Math.random()*10, type, i;
		data.title = "2015-04-15 语文作业选择题";
		data.list = [];
		if ( random > 5 ) {
			data.isPic = "true";
			for ( i = 1; i < 20; i++ ) {
				type = Math.random()*10;
				data.list.push({question:'../img/course.jpg',
					questionType:type < 4 ? '选择题' : type < 8 ? '主观题' : '判断题',
					answer:type < 4 ? 'AB' : type < 8 ? '../img/course.jpg' : '√'});
			}
		} else {
			data.isPic = "false";
			for ( i = 1; i < 20; i++ ) {
				data.list.push({question:'<div class="question"> <p>2. 一个运动员正在进行爬杆训练，若杆是竖直放置的，则使运动员上升的力是什么（）</p> <p>A.重力</p> <p>B.摩擦力</p> <p>C.弹力</p> <p>D.人对自己的力</p> </div>',
								answer: 'AB'});
			}
		}
		console.info(data);
		return data;
	}

	function setPhonyQuestionList(){
		var data = [];
		for ( var i = 20; i > 0; i-- ) {
			data.push({id:i});
		}
		return data;
	}

	function setPhonyAnswerStatistics(){
		var data = {},  random = Math.random()*10;
		if ( random < 4 ) {
			data.questionType = '选择题';
			data.anwser = {
				'A' : ['赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣'],
				'B' : ['赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣'],
				'C' : ['赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣'],
				'D' : ['赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣'],
			};
		} else if ( random < 8 ) {
			data.questionType = '判断题';
			data.anwser = {
				'√' : ['赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣'],
				'X' : ['赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣','工藤新一','徐蕾','赵一佳','蒋欣'],
			};
		} else {
			data.questionType = '主观题';
			data.anwser = [
				{name:'赵一佳', img:['../img/course.jpg','../img/course.jpg']},
				{name:'徐蕾', img:['../img/course.jpg']},
				{name:'蒋欣', img:['../img/course.jpg','../img/course.jpg','../img/course.jpg']},
				{name:'工藤新一', img:['../img/course.jpg']},
				{name:'李玉华', img:['../img/course.jpg']},
			];
		}
		console.info(random);
		console.info(data);
		return data;
	}
})($);