


(function(){
	
	var conversationEl = $('.conversation');
	var view = document.querySelector('.view');
	var klass = null;
	var conversationScroll = new IScroll( document.querySelector('.scroll_wrap'),
					{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true} );

	//获取班级数据
	function getKlass(){
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					klass = msg.data;
					fillKlass(msg.data);
				} else {
					klass = setKlassPhonyData();
					fillKlass(klass);
				}
			}
		});
	}

	//填充班级
	function fillKlass(data){
		var length = data.length, html = [];
		html.push('<div class="filter_item cur" data-klassid="all">全部</div>');
		for ( i = 0; i < length; i++ ) {
			var item = data[i];
			html.push('<div class="filter_item" data-klassid="'+item.id+'">'+item.name+'</div>');
		}
		$('.filter_box').html(html.join(''));
	}

	//会话列表数据
	function getConversation(){
		$.ajax({
			url: '',//'url?start=' + conversation.start + '&count=' + conversation.count +'&filter' + conversation.klass
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillConversation(msg.data);
				} else {
					fillConversation(setConversationPhonyData());
				}
			}
		});
	}

	function fillConversation(data){
		var html = [], item;
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
			html.push('<div class="conversation_item" data-id="'+item.conversationId+'">');
			html.push(	'<div class="avatar">');
			html.push(		'<img src="'+item.avatar+'" alt="avatar">');
			html.push(	'</div>');
			html.push(	'<div class="date">'+item.time+'</div>');
			html.push(	'<div class="content">');
			html.push(		'<div class="name">'+item.name+' 家长</div>');
			html.push(		'<div class="last_msg">'+item.lastMsg+'</div>');
			html.push(	'</div>');
			html.push('</div>');
			conversation.list[item.conversationId] = item;
		}
		if ( conversation.start === 0 ) {
			conversationEl.html(html.join(''));
			conversationScroll.refresh();
		} else {
			conversationEl.append(html.join(''));
		}
	}

	var conversation = {
		start: 0,
		count: 10,
		klass: 'all',
		list: {},
		setStart: function( start ) {
			this.start = start;
			getConversation();
		},
		setKlass: function( klass ) {
			if( klass === this.klass ) { return ;}
			this.klass = klass;
			this.start = 0;
			getConversation();
		}
	};


	function bindEvent(){
		var filterBox = $('.filter_box');

		//初始化
		$('#filter').bind('click', function(event) {
			filterBox.toggle();
			return false;
		});

		$('.scroll_wrap').bind('touchstart click', function(){
			filterBox.css({display:'none'});
		});

		$('#send').bind('click', function(){
			new vko.com.newConversation({data:{klass:klass}, prePage: view});
		});

		$('.conversation').on('click', '.conversation_item', function(){
			new vko.com.message({data:conversation.list[this.getAttribute('data-id')],
					prePage: view});
		});

		filterBox.on('click', '.filter_item', function(){
			var self = $(this),
				klass = self.addClass('cur').attr('data-klassid');
			conversation.list = {};
			self.siblings('.filter_item').removeClass('cur');
			conversation.setKlass( klass );
			setTimeout(function(){filterBox.css({display:'none'});},100);
			return false;
		});
	}

	function init(){
		bindEvent();
		getKlass();
		getConversation();
	}

	init();


	function setKlassPhonyData(){
		return [
			{id:'1', name:'高二一班'},
			{id:'2', name:'高二二班'},
			{id:'3', name:'高二三班'},
			{id:'4', name:'高二四班'}
		];
	}

	function setConversationPhonyData(){
		var data = [
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期日',name:'袁野',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期六',name:'傅志红',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期六',name:'苍松',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期六',name:'李松峰',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期五',name:'大头',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期五',name:'田宇',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期五',name:'Zinger译',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期四',name:'张宗尉',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'},
			{conversationId:'1',avatar:'../img/avatar.jpg',time:'星期四',name:'傅志红',
				role:'家长',userId:'100',lastMsg:'周老师您好，我明天不能去参加家长会了'}
		];
		return Math.random() > 0.5 ? data : data.reverse();
	}

	/*var pullDown = document.querySelector('#pull_down');
	var myScroll = new IScroll('.scroll',{
		scrollbars: 'iScrollVerticalScrollbar',
		startY: -41,
		scrollY: true,
		freeScroll: true,
		mouseWheel: true,
		scrollbars: true,
		probeType: 1
	});
	myScroll.on('refresh', function(){
		setTimeout(function(){
			myScroll.scrollTo(0, -41, 500 );
			pullDown.innerHTML = '下拉刷新';
		},1000);
	});
	myScroll.on('scroll', function(){
		console.dir(this);
		if ( this.y > 20 ) {
			pullDown.innerHTML = '松开刷新';
			this.needRefresh = true;
		} else {
			pullDown.innerHTML = '下拉刷新';
			this.needRefresh = false;
		}
	});
	myScroll.on('scrollEnd', function(){
			console.log(this.y);
		if ( this.needRefresh ){
			pullDown.innerHTML = '刷新中...';
			myScroll.refresh();
			this.needRefresh = false;
		} else if ( this.y < 20 && this.y > -45 ) {
			myScroll.scrollTo(0, -41, 500);
		}
	});*/
})();