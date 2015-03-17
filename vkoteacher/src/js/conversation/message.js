window.vko = window.vko || {};
vko.com = vko.com || {};


//消息页面
(function($){
	vko.com.message = function(options){
		//TODO:初始化需要的数据 this.
		this.id = options.data.id;//conversation id
		this.data = options.data;
		this.prePage = options.prePage;
		this.init();
	};

	vko.com.message.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left">');
			viewHTML.push(		'<i id="back" ></i>');
			viewHTML.push(	'</div>');
			viewHTML.push(	'<div class="title">'+this.data.name+' 家长</div>');
			viewHTML.push('</header>');
			//wrap
			viewHTML.push('<section class="scroll_wrap message_scroll_wrap">');
			viewHTML.push(	'<div>');
			viewHTML.push(		'<div class="message"></div>');
			viewHTML.push(		'<div class="blank"></div>');
			viewHTML.push(	'</div>');
			viewHTML.push('</section>');
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
			this.getMessage();
			this.bindEvent();
		},

		getMessage: function(){
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillMessage(msg.data);
					} else {
						self.fillMessage(setMessagePhonyData());
					}
				}
			});
		},

		fillMessage: function(data){
			var html = [], item, className;
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				item.sendId == vko.userID ? className = 'my_message_main' : className = 'other_message_main';
				html.push('<div class="message_time">21:00</div>');
				html.push('<div class="'+className+'">');
				html.push(	'<div class="avatar">');
				html.push(		'<img src="'+item.avatar+'" alt="avatar">');
				html.push(	'</div>');
				html.push(	'<div class="content">');
				html.push(		'<i></i>');
				html.push(		'<span>'+item.message+'</span>');
				html.push(	'</div>');
				html.push('</div>');
			}
			$('.message', this.view).append(html.join(''));
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
		},

		backPrePage: function(){
			this.view.innerHTML = '';
			this.prePage.style.display = 'block';
			document.body.removeChild(this.view);
		}

	};

	function setMessagePhonyData(){
		return [
			{sendId:'1',message:'周老师您好，我明天不能去参加家长会了',time:'1423635970000',avatar:'../img/avatar.jpg'},
			{sendId:'1',message:'女性朋友和女朋友的区别：女性朋友骂你的时候会叫你吃屎；女朋友骂你的时候会叫你吃屎屎。'+
				'多一个字，其实是多一份关怀，怕你不够吃#满满全是爱#',time:'1423636030000',avatar:'../img/avatar.jpg'},
			{sendId:'123',message:'营养美味鸡蛋羹+露露+单点一份麻婆豆腐+煎制荷包蛋一份',
				time:'1423705210000',avatar:'../img/avatar.jpg'},
			{sendId:'123',message:'外网重启',time:'1423705810000',avatar:'../img/avatar.jpg'},
			{sendId:'1',message:'仅仅在几年前，数据科学家还不是一个正式确定的职业，然而一眨眼的工夫，'+
				'这个职业就已经被誉为“今后10年IT行业最重要的人才”了',time:'1426141570000',avatar:'../img/avatar.jpg'},
			{sendId:'1',message:'Google、Amazon、Facebook、Twitter，这些称霸互联网业界的企业，不仅是数据分析的受益者，'+
				'也是大数据储存和处理技术的推动者。',time:'1426141570000',avatar:'../img/avatar.jpg'},
			{sendId:'123',message:'在历史上的任何时期，掌握着先进工具的人也就掌握着未来。在大数据时代，数据科学家无疑'+
				'就是这个时代点“石”成金的人',time:'1426141570000',avatar:'../img/avatar.jpg'},
			{sendId:'1',message:'说到大数据领域的创新，Google的三驾马车（GFS，MapReduce，Bigtable）曾经开启了大数据处'+
			'理时代的序幕，然而技术的更迭创造出了更好的产品',time:'1426227970000',avatar:'../img/avatar.jpg'},
			{sendId:'1',message:'营养美味鸡蛋羹+露露+单点一份麻婆豆腐+煎制荷包蛋一份',
				time:'21:00',avatar:'../img/avatar.jpg'},
			{sendId:'123',message:'That would scroll down by 100 pixels. Remember: 0 is always the top left corner.'+
				' To scroll you have to pass negative numbers',time:'1426228034722',avatar:'../img/avatar.jpg'}
		];
	}

})($);