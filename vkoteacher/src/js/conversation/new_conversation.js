window.vko = window.vko || {};
vko.com = vko.com || {};


//发消息选择消息类型页面----------------------------------------------------------------------------
(function($){
	vko.com.newConversation = function(options){
		//TODO:初始化需要的数据 this.
		//this.id = options.data.id;
		this.data = options.data;//this.data.klass班级数据
		this.klass = {};
		this.prePage = options.prePage;
		this.init();
	};

	vko.com.newConversation.prototype = {
		init: function(){
			var viewHTML = [], klass = this.initKlass();
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">发消息</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section class="itembox" id="sendtype">');
			viewHTML.push(		'<div class="item" id="to_one">发送单条信息<i></i></div>');
			viewHTML.push(		'<div class="item" id="to_grade">发送班级消息<i></i></div>');
			viewHTML.push(		'<div class="item" id="to_multiple">指定部分人群<i></i></div>');
			viewHTML.push(	'</section>');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.prePage.style.display = 'none';
			this.bindEvent();
		},

		initKlass: function() {
			var item, klass = this.data.klass;
			for ( var i = 0, len = klass.length; i < len; i++ ) {
				item = klass[i];
				this.klass[item.id] = {name:item.name,students:[]};
			}
		},

		bindEvent: function() {
			var self = this;
			$('.title_left', this.view).bind('click', function(){
				self.backPrePage();
			});

			$('#sendtype', this.view).on('click', '.item', function(){
				self.nextPage(this);
			});
		},

		nextPage: function(el) {
			switch ( el.id ) {
				case 'to_one' :
					new vko.com.toOne({data:{klass:this.klass}, prePage: this.view});
					break;
				case 'to_grade' :
					new vko.com.toGrade({data:{klass:this.klass}, prePage: this.view});
					break;
				case 'to_multiple' :
					new vko.com.toGrade({data:{klass:this.klass, type:'to_multiple'}, prePage: this.view});
					//new vko.com.toMultiple({data:{klass:this.klass},prePage: this.view});
					break;
			}
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

})($);





//发送单条消息----------------------------------------------------------------------------
(function($){
	vko.com.toOne = function(options){
		//TODO:初始化需要的数据 this.
		//this.id = options.data.id;
		this.data = options.data;//this.data.klass班级数据
		this.klass = options.data.klass;
		this.prePage = options.prePage;
		this.init();
	};

	vko.com.toOne.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">发消息</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section id="single_message_page">');
			viewHTML.push(		'<div class="itembox" >');
			viewHTML.push(			'<div class="item">发送单条信息<i></i></div>');
			viewHTML.push(		'</div>');
			viewHTML.push(		'<dl class="single_student_selector">'+this.fillSingleKlass(this.klass)+'</dl>');
			viewHTML.push(	'</section><aside class="blank_50"></aside');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.bindEvent();
		},

		//填充单条消息的班级html
		fillSingleKlass: function(klass){
			var html = [], klassId;
			for ( klassId in klass ) {
				html.push('<dt class="grade" data-klassid="'+klassId+'">'+klass[klassId].name+'<i></i></dt>');
				html.push('<dd class="single_student" style="display:none" data-klassid="'+klassId+'"></dd>');
			}
			return html.join('');
		},


		getStudents: function( klassId, wrap ) {
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.klass[klassId].students = msg.data;
						self.fillStudents( self.klass[klassId].students, wrap );
					} else {
						self.klass[klassId].students = setStudentsPhonyData();
						self.fillStudents( self.klass[klassId].students , wrap );
					}
				}
			});
		},

		fillStudents: function(data, wrap){
			var html = [], item;
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				html.push('<div class="item clearfix" data-studentid="'+item.id+'" data-studentname="'+item.name+'">');
				html.push(	'<img src="'+item.avatar+'" />');
				html.push(	'<i></i>');
				html.push(	'<span>'+item.name+'</span>');
				html.push('</div>');
			}
			wrap.html(html.join(''));
			wrap.css('display', 'block');
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
			$('.title_left, .itembox .item', this.view).bind('click', function(){
				self.backPrePage();
			});

			$('.single_student_selector', this.view).on('click', '.grade', function(){
				self.viewStudentToggle($(this));
			});

			$('.single_student', this.view).on('click', '.item', function(){
				var $el = $(this),
					studentId = $el.attr('data-studentid'),
					studentName = $el.attr('data-studentname');
				new vko.com.sendPage({data:{type:'to_one',
					selectedStudent:{name:studentName, id:studentId}}, prePage: self.view});
			});
		},


		viewStudentToggle: function($el) {
			var klassId = $el.attr('data-klassid'),
				studentsWrap = $('.single_student[data-klassid="'+klassId+'"]', this.view);

			if ( studentsWrap.css('display') == 'none') {
				$el.addClass('cur_grade');
				if ( this.klass[klassId].students.length > 0 ){
					this.fillStudents(this.klass[klassId].students, studentsWrap);
				} else if ( this.klass[klassId].students.length === 0 ) {
					this.getStudents(klassId, studentsWrap);
				}
			} else {
				$el.removeClass('cur_grade');
				studentsWrap.css('display', 'none');
				this.scrollAble();
			}
			
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};
})($);






//选择班级页面----------------------------------------------------------------------------
(function($){
	vko.com.toGrade = function(options){
		//TODO:初始化需要的数据 this.
		//this.id = options.data.id;
		this.data = options.data;//this.data.klass班级数据
		this.klass = options.data.klass;
		this.prePage = options.prePage;
		this.selectedStudents = {};//发送指定人群时，保存当前以选中的多个学生
		this.init();
	};

	vko.com.toGrade.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">发消息</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section class="itembox" id="class_selector_page">');
			viewHTML.push(		this.fillKlass(this.klass));
			viewHTML.push(	'</section >');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.bindEvent();
		},

		//填充单条消息的班级html
		fillKlass: function(klass){
			var html = [], klassId;
			for ( klassId in klass ) {
				html.push('<div class="item" data-klassid="'+klassId+'">'+klass[klassId].name+'<i></i></div>');
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
			$('.title_left', this.view).bind('click', function(){
				self.backPrePage();
			});

			$('.itembox', this.view).on('click', '.item', function(){
				self.nextPage($(this));
			});

			//new vko.com.toGrade({data:{klass:this.klass},type: 'to_multiple',prePage: this.view});
					//new vko.com.toMultiple({data:{klass:this.klass},prePage: this.view});
		},

		nextPage: function($el){
			var klassId = $el.attr('data-klassid'), klassName = $el.text();
			if ( this.data.type && this.data.type == 'to_multiple' ) {
				new vko.com.toMultiple({data:{klass:this.klass, klassId: klassId,
					selectedStudents: this.selectedStudents},prePage: this.view});
			} else {
				new vko.com.sendPage({data:{type:'to_klass',
					selectedKlass:{name:klassName, id:klassId}}, prePage: this.view});
			}
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

})($);






//发消息选择多人页面----------------------------------------------------------------------------
(function($){
	vko.com.toMultiple = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.klassId;//当前班级id
		this.data = options.data;//this.data.klass班级数据
		this.klass = options.data.klass;
		this.prePage = options.prePage;
		this.init();
	};

	vko.com.toMultiple.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">发消息</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section id="multi_selector_page">');
			viewHTML.push(		'<div class="students"></div>');
			viewHTML.push(		'<div class="btn_box">');
			viewHTML.push(			'<div class="select_all">全选</div>');
			viewHTML.push(			'<div class="complete">确定</div>');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section >');

			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.getStudents();
			this.prePage.style.display = 'none';
			this.bindEvent();
		},


		getStudents: function() {
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.klass[self.id].students = msg.data;
						self.fillStudents( self.klass[self.id].students );
					} else {
						self.klass[self.id].students = setStudentsPhonyData();
						self.fillStudents( self.klass[self.id].students );
					}
				}
			});
		},

		fillStudents: function(data){
			var html = [], item, isChecked;
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				this.data.selectedStudents[item.id] ? isChecked = 'checked' : isChecked = '';
				html.push('<div class="item clearfix" data-username="'+item.name+'" data-userid="'+item.id+'">');
				html.push(	'<div class="checkbox '+isChecked+'"></div>');
				html.push(	'<i></i>');
				html.push(	'<span>'+item.name+'</span>');
				html.push('</div>');
			}
			$('.students', this.view).html(html.join(''));
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
			$('.title_left', this.view).bind('click', function(){
				self.backPrePage();
			});

			$('.students', this.view).on('click', '.item', function(){
				self.selectStudentToggle($(this));
			});

			$('.select_all', this.view).on('click', function(){
				$('.students .item').each(function(index, el){
					var id = el.getAttribute('data-userid'),
						name = el.getAttribute('data-username');
					self.data.selectedStudents[id] = name;
					el.firstChild.classList.add('checked');
				});
			});

			$('.complete', this.view).bind('click', function(){
				if ( $.isPlainObject(self.data.selectedStudents) ) {
					new vko.com.sendPage({data:{type:'to_multiple',
						selectedStudents: self.data.selectedStudents}, prePage: self.view});
				} else {
					alert('请至少选择一个学生');
				}
			});
		},

		selectStudentToggle: function($el) {
			var id = $el.attr('data-userid'),
				name = $el.attr('data-username'),
				checkbox = $el.children('.checkbox');
			if ( checkbox.is('.checked') ) {
				checkbox.removeClass('checked');
				delete this.data.selectedStudents[id];
			} else {
				checkbox.addClass('checked');
				this.data.selectedStudents[id] = name;
			}
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

})($);





//发消息页----------------------------------------------------------------------------
(function($){
	vko.com.sendPage = function(options){
		//TODO:初始化需要的数据 this
		//this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		this.sendData = {};
		this.init();
	};

	vko.com.sendPage.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">发消息</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="sendpage" style="display:block">');
			viewHTML.push(	'<section class="send_to clearfix">');
			viewHTML.push(		this.getSendTo(this.data));
			viewHTML.push(	'</section>');
			viewHTML.push(	'<section class="send_box">');
			viewHTML.push(		'<form name="camera" id="camera" enctype="multipart/form-data" action="" method="POST">');
			viewHTML.push(			'<i></i><input id="" type=file accept="image/*">');
			viewHTML.push(		'</form>');
			viewHTML.push(		'<div id="send_btn">发送</div>');
			viewHTML.push(		'<div id="send_content">');
			viewHTML.push(			'<input type="text" id="content" />');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section>');
			viewHTML.push('</section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.prePage.style.display = 'none';
			this.bindEvent();
		},

		getSendTo: function(data){
			var html = [];
			//{data:{type:'to_one',student:{name:studentName, id:studentId}}
			if ( data.type == 'to_one' ) { // a student
				html.push('<div class="send_label">发送给：</div>');
				html.push('<div class="receive">'+data.selectedStudent.name+'</div>');
				this.sendData.type = data.type;
				this.sendData.sendto = data.selectedStudent.id;
			} else if ( data.type == 'to_klass' ) { // to class complete
				html.push('<div class="to_klass" >'+data.selectedKlass.name+'<i></i></div>');
				this.sendData.type = data.type;
				this.sendData.sendto = data.selectedKlass.id;
			} else { //Multiple students
				html.push('<div class="send_label">发送给：</div>');
				html.push('<div class="add_student"></div>');
				html.push('<div class="receive">');
				for ( var id in data.selectedStudents ) {
					html.push(data.selectedStudents[id] + '、');
				}
				html.push('</div>');
				this.sendData.type = data.type;
				this.sendData.sendto = data.selectedStudents;

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
			$('.title_left, .to_klass, .add_student', this.view).bind('click', function(){
				self.backPrePage();
			});

			$('.send_btn', this.view).bind('click', function(){
				//TODO:一旦发送完成应该删除第一个和最后一个页面中的所有页面，并将上一页替换为第一页。并后退
			});
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}
	};

})($);






function setStudentsPhonyData() {
	return [
		{id:0, name:'袁野', avatar:'../img/avatar.jpg'},
		{id:1, name:'傅志红', avatar:'../img/avatar.jpg'},
		{id:2, name:'苍松', avatar:'../img/avatar.jpg'},
		{id:3, name:'李松峰', avatar:'../img/avatar.jpg'},
		{id:4, name:'大头', avatar:'../img/avatar.jpg'},
		{id:5, name:'田宇', avatar:'../img/avatar.jpg'},
		{id:6, name:'Zinger译', avatar:'../img/avatar.jpg'},
		{id:7, name:'张宗尉', avatar:'../img/avatar.jpg'},
		{id:8, name:'常石磊', avatar:'../img/avatar.jpg'},
		{id:9, name:'城壁', avatar:'../img/avatar.jpg'}
	];
}






















