

(function($, exports){
	
	var answerStatistics = {};
		hwScroll = new IScroll(document.querySelector('.scroll_wrap'),
			{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});

	//获取详情页数据
	function getDetail( hwID ){
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillDetail(msg.data);
				} else {
					fillDetail(setPhonyDate());
				}
			}
		});
	}

	//获取当前问题统计页问题列表
	function getQuestionList(){
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillQuestionList(msg.data);
				} else {
					fillQuestionList(setPhonyQuestionList());
				}
			}
		});
	}

	//获取当前问题统计页问题列表
	function getAnswerStatistics(questionId){
		questionId = questionId || $('.qid span').eq(0).attr('data-id');
		if ( !answerStatistics.questionId ) {
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						fillAnswerStatistics(msg.data);
						answerStatistics.questionId = msg.data;
					} else {
						fillAnswerStatistics(setPhonyAnswerStatistics());
					}
				}
			});
		} else {
			fillAnswerStatistics(answerStatistics.questionId);
		}
		
	}


	//@detail详情-------------------------------------------------------------------
	//填充
	function fillDetail(data){
		if ( data.isPic === "true" ) {
			document.querySelector('.has_pic').style.display = 'block';
			$('#title').html('<span>'+data.title+'</span><i class="ispic"></i>');
			fillPicHomework(data);
			hwScroll.refresh();
		} else {
			document.querySelector('.no_pic').style.display = 'block';
			$('#title').html('<span>'+data.title+'</span>');
			fillTextHomework(data);
			hwScroll.refresh();
		}
	}

	//填充图片作业
	function fillPicHomework(data){
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
		document.querySelector('.pic_question').appendChild(questionFrag);
		document.querySelector('.pic_question_answer').appendChild(answerFrag);
		hwScroll.refresh();
	}

	//填充文本作业
	function fillTextHomework(data) {
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
		document.querySelector('.no_pic').appendChild(frag);
		hwScroll.refresh();
	}


	//@statistics统计-------------------------------------------------------------------
	//填充统计页中的所有问题
	function fillQuestionList(data) {
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
		document.querySelector('.qid').appendChild(frag);
		hwScroll.refresh();
	}

	//填充学生答案统计
	function fillAnswerStatistics(data) {
		var item, html = [];
		if ( data.questionType != '主观题' ) {//非主观题答案统计
			$('.question_answer').html(data.questionType + ' 正确答案：' + (data.correctAnwser || ''));
			for ( item in data.anwser ) {
				html.push('<div class="item">');
				html.push(	'<div class="count">');
				html.push(		'选择 '+item+' 共'+data.anwser[item].length+'人');
				html.push(	'</div>');
				html.push(	'<div class="student">');
				html.push(		fillStudent(data.anwser[item]));
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
				html.push(			fillSubjectivityHW(item.img));
				html.push(		'</div>');
				html.push(	'</div>');
			}
			html.push('</div>');
		}
		
		$('.data_statistical').html(html.join(''));
		hwScroll.refresh();
	}

	//非主观题填充学生
	function fillStudent(students) {
		var html = [];
		for ( var i = 0, len = students.length; i < len; i++ ) {
			html.push('<span>'+students[i]+'</span>');
		}
		return html.join('');
	}

	//主观题填充学生答案
	function fillSubjectivityHW(imgList) {
		var html = [];
		for ( var i = 0, len = imgList.length; i < len; i++ ) {
			html.push('<div data-img="'+imgList[i]+'">图片作业</div>');
		}
		return html.join('');
	}



	function bindEvent(){
		$('.title ul').on('click', 'li', function(){
			switchNav(this);
		});
		$('.qid').on('click', 'span', function(){
			switchQuestion(this);
		});
	}

	//详情统计切换
	function switchNav(el){
		var that = $(el), detailEl = $('.detail'), statisticsEl = $('.statistics');
		if ( $(el).index() === 0 ) {
			that.addClass('cur').next().removeClass('cur');
			detailEl.css('display','block');
			statisticsEl.css('display','none');
		} else { 
			that.addClass('cur').prev().removeClass('cur');
			statisticsEl.css('display','block');
			detailEl.css('display','none');
		}
		hwScroll.refresh();
	}

	function switchQuestion(el){
		var $el = $(el);
		$el.addClass('cur').siblings('span').removeClass('cur');
		getAnswerStatistics($el.attr('data-id'));
	}



	function init(){
		getDetail();
		getQuestionList();
		getAnswerStatistics();
		bindEvent();
	}

	init();



	//设置假数据
	function setPhonyDate(){
		var data = {}, random = Math.random()*10, type; 
		data.title = "2015-04-15 语文作业选择题";
		data.list = [];
		if ( random > 5 ) {
			data.isPic = "true";
			for ( var i = 1; i < 20; i++ ) {
				type = Math.random()*10;
				data.list.push({question:'../img/course.jpg',
					questionType:type < 4 ? '选择题' : type < 8 ? '主观题' : '判断题',
					answer:type < 4 ? 'AB' : type < 8 ? '../img/course.jpg' : '√'});
			}
		} else {
			data.isPic = "false";
			for ( var i = 1; i < 20; i++ ) {
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


})($, window);