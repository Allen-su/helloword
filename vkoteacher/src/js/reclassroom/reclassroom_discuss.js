window.vko = window.vko || {};
vko.com = vko.com || {};

//讨论列表页--------------------------------------------------------------------------------------------------
(function($){
	vko.com.reclassroomDiscussList = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		this.discussList = {};
		this.init();
	};

	vko.com.reclassroomDiscussList.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">讨论</div>');
			viewHTML.push(	'<div class="title_right"><div class="discuss_btn">发布讨论</div></div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section class="discuss_title">');
			viewHTML.push(		this.data.title + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎同学们讨论');
			viewHTML.push(	'</section>');
			viewHTML.push(	'<section class="discuss_list"></section>');
			viewHTML.push('</div></section>');
			viewHTML.push('<footer class="send_box">');
			viewHTML.push(	'<div id="camera"><i></i></div>');
			viewHTML.push(	'<div id="send_btn">发送</div>');
			viewHTML.push(	'<div id="send_content">');
			viewHTML.push(		'<input type="text" id="content" />');
			viewHTML.push(	'</div>');
			viewHTML.push('</footer>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.getDiscuss();
			this.bindEvent();
		},

		getDiscuss: function() {
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					//if ( start == 0 ){ this.discussList = {} }
					if ( msg.success ) {
						self.fillDiscuss(msg.data);
					} else {
						self.fillDiscuss(setDiscussPhonyData());
					}
				}
			});
		},

		fillDiscuss: function(data) {
			var html = [], item;
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				html.push('<div class="discuss_item" >');
				html.push(	'<div class="debater">');
				html.push(		'<div class="avatar">');
				html.push(			'<img src="'+item.useravatar+'" alt="avatar">');
				html.push(		'</div>');
				html.push(		'<div class="reply_btn" data-id="'+item.id+'">');
				html.push(			'<i></i><span>回复</span>');
				html.push(		'</div>');
				html.push(		'<div class="info">');
				html.push(			'<div class="name">'+item.username+'</div>');
				html.push(			'<div class="time">'+item.time+'</div>');
				html.push(		'</div>');
				html.push(	'</div>');
				html.push(	'<div class="content">'+item.content+'</div>');
				html.push(	'<div class="reply" id="disscuss_'+item.id+'">'+this.fillReply(item)+'</div>');
				html.push('</div>');
				this.discussList[item.id] = item;
			}
			$('.discuss_list', this.view).html(html.join(''));
			this.scrollAble();
		},

		fillReply: function(data) {
			var html = [], item;
			for ( var i = 0, len = data.reply.length; i < len; i++ ) {
				item = data.reply[i];
				html.push('<div class="reply_item">'+item.username+'：'+item.content+'</div>');
			}
			if ( data.residualCount ) {
				html.push('<div class="more"><a class="more_button" href="#" data-id="'+data.id+'">还有'+
					data.residualCount+'条回复</a></div>');
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
			var self = this, sendBox = $('.send_box', this.view);
			$('.title_left', this.view).bind('click', function(){
				self.backPrePage();
			});
			$('.discuss_btn', this.view).bind('click', function(){//发布新讨论
				new vko.com.newReclassroomDiscuss({data:{id:self.id},prePage: self.view});
			});
			$('.discuss_list', this.view).on('click', '.reply_btn', function(){//回复
				sendBox.css({display:'block'});
				$('#send_btn', this.view).attr({'data-send_id':$(this).attr('data-id')});
				return false;
			}).on('click', '.more_button', function(){//更多
				new vko.com.reclassroomDiscuss({data:self.discussList[this.getAttribute('data-id')],
					prePage: self.view});
				return false;
			});
			$('#send_btn', this.view).bind('click', function(){
				self.sendReply();
			});
			$('.scroll_wrap', this.view).bind('touchmove click', function(){
				sendBox.css({display:'none'});
			});
		},

		//回复
		sendReply: function(){
			var self = this;
				content = $('#content', this.view).val().trim();
				sendId = $('#send_btn', this.view).attr('data-send_id');
			if ( !content ) {
				alert('评论不能为空！');
				return;
			}
			$.ajax({
				url: '',
				type: 'post',
				datatype: 'json',
				success: function(msg){
					//if ( start == 0 ){ self.discussList = {} }
					var html, replyEl = $('#disscuss_'+sendId+' .reply_item', self.view);
					if ( msg.success ) {
						html = '<div class="reply_item">'+vko.userName+'：'+content+'</div>';
						if ( replyEl.length === 0 ) {
							$('#disscuss_'+sendId, self.view).append(html);
						} else {
							replyEl.eq(replyEl.length - 1).after(html);
						}
						$('.send_box', self.view).css({display:'none'});
						$('#content', self.view).val('');
						self.scrollAble();
					} else {
						html = '<div class="reply_item">'+vko.userName+'：'+content+'</div>';
						if ( replyEl.length === 0 ) {
							$('#disscuss_'+sendId, self.view).append(html);
						} else {
							replyEl.eq(replyEl.length - 1).after(html);
						}
						$('.send_box', self.view).css({display:'none'});
						$('#content', self.view).val('');
						self.scrollAble();
					}
				}
			});
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

	function setDiscussPhonyData(){
		var data = [
			{id:1,content:'Tim 是位特立独行的商人，他不光放眼于最长远、最广阔的视野并且切实地按照Yogi Berra 的建议去做了'+
			'：‘如果你在路上遇到岔路口，走小路（岔路）。', username:'周杰伦', time:'2014-08-14 15:35', userid:123,
			useravatar:'../img/avatar.jpg',
			reply:[{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
				{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'}],
			residualCount:20
			},
			{id:2,content:'Allen 是位特立独行的商人，他不光放眼于最长远、最广阔的视野并且切实地按照Yogi Berra 的建议去做了'+
			'：‘如果你在路上遇到岔路口，走小路（岔路）。', username:'周杰伦', time:'2014-08-14 15:35', userid:123,
			useravatar:'../img/avatar.jpg',
			reply:[{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
				{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'}],
			residualCount:0
			},
			{id:3,content:'Yogi Berra 是位特立独行的商人，他不光放眼于最长远、最广阔的视野并且切实地按照Yogi Berra 的建议去做了'+
			'：‘如果你在路上遇到岔路口，走小路（岔路）。', username:'周杰伦', time:'2014-08-14 15:35', userid:123,
			useravatar:'../img/avatar.jpg',reply:[],residualCount:0
			},
			{id:4,content:'Alex 是位特立独行的商人，他不光放眼于最长远、最广阔的视野并且切实地按照Yogi Berra 的建议去做了'+
			'：‘如果你在路上遇到岔路口，走小路（岔路）。', username:'周杰伦', time:'2014-08-14 15:35', userid:123,
			useravatar:'../img/avatar.jpg',
			reply:[{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
				{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'}],
			residualCount:15
			},
		];
		return data;
	}

})($);


//讨论评论页------------------------------------------------------------------------------------------------
(function($){
	vko.com.reclassroomDiscuss = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;
		this.data = options.data;
		this.prePage = options.prePage;
		this.courses = {};
		this.init();
	};

	vko.com.reclassroomDiscuss.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">讨论</div>');
			//viewHTML.push(	'<div class="title_right"><div class="discuss_btn">评论</div></div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section class="discuss_list">');
			viewHTML.push(		'<div class="discuss_item">');
			viewHTML.push(			'<div class="debater">');
			viewHTML.push(				'<div class="avatar">');
			viewHTML.push(					'<img src="'+this.data.useravatar+'" alt="avatar">');
			viewHTML.push(				'</div>');
			viewHTML.push(				'<div class="reply_btn">');
			viewHTML.push(					'<i></i><span>回复</span>');
			viewHTML.push(				'</div>');
			viewHTML.push(				'<div class="info">');
			viewHTML.push(					'<div class="name">'+this.data.username+'</div>');
			viewHTML.push(					'<div class="time">'+this.data.time+'</div>');
			viewHTML.push(				'</div>');
			viewHTML.push(			'</div>');
			viewHTML.push(			'<div class="content">'+this.data.content+'</div>');
			viewHTML.push(			'<div class="reply"></div>');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section>');
			viewHTML.push('</div></section>');
			viewHTML.push('<footer class="send_box" >');
			viewHTML.push(	'<div id="camera"><i></i></div>');
			viewHTML.push(	'<div id="send_btn">发送</div>');
			viewHTML.push(	'<div id="send_content">');
			viewHTML.push(		'<input type="text" id="content" />');
			viewHTML.push(	'</div>');
			viewHTML.push('</footer>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.getReply();
			this.bindEvent();
		},

		getReply: function() {
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillReply(msg.data);
					} else {
						self.fillReply(setReplyPhonyData());
					}
				}
			});
		},

		fillReply: function(reply) {
			var html = [], item;
			for ( var i = 0, len = reply.length; i < len; i++ ) {
				item = reply[i];
				html.push('<div class="reply_item">'+item.username+'：'+item.content+'</div>');
			}
			$('.reply', this.view).html(html.join(''));
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
			var self = this, sendBox = $('.send_box', this.view);
			$('.title_left', this.view).bind('click', function(){
				self.backPrePage();
			});
			$('.reply_btn', this.view).bind('click', function(){//回复
				sendBox.css({display:'block'});
				return false;
			});
			$('#send_btn', this.view).bind('click', function(){
				self.sendReply();
			});
			$('.scroll_wrap', this.view).bind('touchmove click', function(){
				sendBox.css({display:'none'});
			});
		},

		//回复
		sendReply: function(){
			var self = this;
				content = $('#content', this.view).val().trim();
				sendId = $('#send_btn', this.view).attr('data-send_id');
			if ( !content ) {
				alert('评论不能为空！');
				return;
			}
			$.ajax({
				url: '',
				type: 'post',
				datatype: 'json',
				success: function(msg){
					var html, replyBox = $('.reply', self.view);
					if ( msg.success ) {
						html = '<div class="reply_item">'+vko.userName+'：'+content+'</div>';
						replyBox.append(html);
						$('.send_box', self.view).css({display:'none'});
						$('#content', self.view).val('');
						self.scrollAble();
					} else {
						html = '<div class="reply_item">'+vko.userName+'：'+content+'</div>';
						replyBox.append(html);
						$('.send_box', self.view).css({display:'none'});
						$('#content', self.view).val('');
						self.scrollAble();
					}
				}
			});
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

	function setReplyPhonyData(){
		var data = [
			{username:'Tim', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Yogi Berra', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Tim', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Yogi Berra', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Tim', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Yogi Berra', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Tim', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'Yogi Berra', userid:'2', content:'非凡想法建立了数百万美元的业务。'},
			{username:'赵一佳', userid:'2', content:'非凡想法建立了数百万美元的业务。'}
		];
		return data;
	}

})($);

//发布新讨论------------------------------------------------------------------------------------------------
(function($){
	vko.com.newReclassroomDiscuss = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;//翻转课堂ID
		this.data = options.data;
		this.prePage = options.prePage;
		this.courses = {};
		this.init();
	};

	vko.com.newReclassroomDiscuss.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">发布讨论</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap foo">');
			viewHTML.push(	'<div class="tip">请输入讨论内容</div>');
			viewHTML.push('</section>');
			viewHTML.push('<footer class="send_box" style="display:block;">');
			viewHTML.push(	'<div id="camera"><i></i></div>');
			viewHTML.push(	'<div id="send_btn">发送</div>');
			viewHTML.push(	'<div id="send_content">');
			viewHTML.push(		'<input type="text" id="content" />');
			viewHTML.push(	'</div>');
			viewHTML.push('</footer>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
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
			$('.title_left', this.view).bind('click', function(){
				self.backPrePage();
			});
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

})($);