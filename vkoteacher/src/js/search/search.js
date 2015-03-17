

window.vko = window.vko || {};
vko.com = vko.com || {};

(function($){
	vko.com.searchCourse = function(options){
		//TODO:初始化需要的数据 this.
		this.data = options.data;
		this.prePage = options.prePage;
		this.indexPage = 1;
		this.init();
	};

	vko.com.searchCourse.prototype = {
		init: function(){
			var viewHTML = [];
			this.searchHistoryDataInit();
			this.view = document.createElement('section');
			this.view.className = 'view';
			//header
			viewHTML.push('<header>');
			viewHTML.push(	'<div class="title_left"><i id="back" ></i></div>');
			viewHTML.push(	'<div class="title">搜索</div>');
			viewHTML.push('</header>');
			viewHTML.push('<section class="scroll_wrap"><div>');
			viewHTML.push(	'<section id="search_page" style="display:block;">');
			viewHTML.push(		'<section class="search_box">');
			viewHTML.push(			'<div class="search">');
			viewHTML.push(				'<input type="text" id="search_content"/>');
			viewHTML.push(				'<div type="button" id="search"/>搜索</div>');
			viewHTML.push(			'</div>');
			viewHTML.push(		'</section>');
			viewHTML.push(		'<section class="history">');
			viewHTML.push(			'<div class="legend">');
			viewHTML.push(				'<div class="title">历史搜索记录</div>');
			viewHTML.push(				'<div class="clear_btn">清除搜索记录</div>');
			viewHTML.push(			'</div>');
			viewHTML.push(			'<div id="history_wrap">'+this.searchHistoryData.getHistoryHTML()+'</div>');
			viewHTML.push(		'</section>');
			viewHTML.push(	'</section>');
			viewHTML.push(	'<section id="result_page" >');
			viewHTML.push(		'<div class="cur_filter">');
			viewHTML.push(			'<span>全部课程</span>');
			viewHTML.push(			'<i></i>');
			viewHTML.push(		'</div>');
			viewHTML.push(		'<div class="search_result">');
			viewHTML.push(			'<div class="search_count">共有18条搜索结果</div>');
			viewHTML.push(			'<div class="vedio_list"></div>');
			viewHTML.push(		'</div>');
			viewHTML.push(	'</section>');
			viewHTML.push(	'<section id="search_filter">');
			viewHTML.push(		'<div data-type="0"><span>全部课程</span><i></i></div>');
			viewHTML.push(		'<div data-type="1"><span>翻转课堂</span><i></i></div>');
			viewHTML.push(		'<div data-type="2"><span>MOOC</span><i></i></div>');
			viewHTML.push(		'<div data-type="3"><span>微课程</span><i></i></div>');
			viewHTML.push(	'</section>');
			viewHTML.push('</div></section>');

			this.view.innerHTML = viewHTML.join('');
			document.body.appendChild(this.view);
			this.scrollAble();
			this.prePage.style.display = 'none';
			this.bindEvent();
		},


//搜索页-----------------------------------------------------------------------------------
		//获取搜索记录
		searchHistoryDataInit: function(){
			var moudle = this;
			this.searchHistoryData = {
				setHistory: function(item){
					var historyStr = this.getHistory(), index = 0,
						history = historyStr.split('&*$%');
					index = history.indexOf(item); item = item.trim();
					if ( !historyStr ) {
						localStorage.setItem('search_course_history',item);
					}else if ( index >= 0) {
						localStorage.setItem('search_course_history',history.splice(index,1) + '&*$%' + history.join('&*$%'));
					} else {
						localStorage.setItem('search_course_history',item + '&*$%' + historyStr);
					}
					this.render();
				},
				getHistory: function(){
					return localStorage.getItem('search_course_history') || '';
				},
				clearHistory: function(){
					localStorage.removeItem('search_course_history');
					this.render();
				},
				getHistoryHTML: function(){
					var history = this.getHistory(), html = [], item;
					history = history.split('&*$%');
					for ( var i = 0, len = history.length; i < len; i++ ) {
						item = history[i];
						html.push('<div class="history_item">'+item+'</div>');
					}
					return html.join('');
				},
				render: function(){
					var html = this.getHistoryHTML();
					document.getElementById('history_wrap').innerHTML = html;
					moudle.scrollAble();
				}
			};
		},

		//搜索
		search: function( content ) {
			if ( !content.trim() ) { return; }
			this.searchHistoryData.setHistory(content);
			this.searchAjaxData();
			$('#result_page', this.view).css({'display':'block'}).siblings('section').css({'display':'none'});
			this.indexPage = 2;
		},

		//获取ajax数据
		searchAjaxData: function() {
			var self = this;
			$.ajax({
				url: '',//用mooc拼接
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillSearchData(0, msg.data);
					} else {
						self.fillSearchData(0, setSearchPhonyData());
					}
				}
			});
		},


//搜索的结果填充页面-----------------------------------------------------------------------------------
		//填充搜索结果 filterType = 0;//0 all, 1 翻转课堂, 2 MOOC, 3 微课程
		fillSearchData: function(filterType, data) {
			data !== undefined ? arguments.callee.searchData = data : data = arguments.callee.searchData;
			var html = [], item, type;
			data = this.filterSearchData(filterType, data);
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				switch( item.type ) {
					case 1 :
						type = '翻转课堂';
						break;
					case 2 :
						type = 'MOOC';
						break;
					case 3 :
						type = '微课程';
						break;
				}
				html.push('<div class="vedio_item" data-id="'+item.id+'">');
				html.push(	'<div class="avatar">');
				html.push(		'<img src="'+item.poster+'" alt="课程" />');
				html.push(		'<i></i>');
				html.push(	'</div>');
				html.push(	'<div class="desc">');
				html.push(		'<div class="title">'+item.title+'</div>');
				html.push(		'<div class="author">主要讲师：'+item.author+'</div>');
				html.push(		'<div class="type" data-type="'+type+'">'+type+'</div>');
				html.push(	'</div>');
				html.push('</div>');
			}
			$('.search_count', this.view).html('共有'+len+'条搜索结果');
			$('.vedio_list', this.view).html(html.join(''));
			this.scrollAble();
		},

		//过滤课程
		filterSearchData: function(filterType, data) {
			var item, filterData = [];
			if ( filterType == 0 ) { return data; }
			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				if ( item.type == filterType ) {
					filterData.push(item);
				}
			}
			return filterData;
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

		bindEvent:function() {
			var self = this, searchInput = $('#search_content', this.view),
				curFilterContent = $('.cur_filter span', this.view);
			$('.title_left',this.view).bind('click', function(){
				self.backPrePage();
				curFilterContent.html('全部课程');
			});
			$('#search', this.view).on('click', function(){
				self.search(searchInput.val());
				searchInput.blur();
			});
			$('#history_wrap', this.view).on('click', '.history_item', function(){
				self.search(this.innerHTML);
			});
			$('.clear_btn', this.view).on('click', function(){
				self.searchHistoryData.clearHistory();
			});
			$('.cur_filter', this.view).on('click', function(){
				$('#search_filter').css({'display':'block'}).siblings('section').css({'display':'none'});
				self.indexPage = 3;
				self.scrollAble();
			});
			$('#search_filter', this.view).on('click', 'div', function(){
				self.fillSearchData(this.getAttribute('data-type'));
				$('#result_page').css({'display':'block'}).siblings('section').css({'display':'none'});
				curFilterContent.html(this.firstChild.innerHTML);
				self.indexPage = 2;
			});
			$('.vedio_list', this.view).on('click', '.vedio_item', function(){
				//TODO:播放页是否要区分开？？？
				new vko.com.moocPlay({prePage:document.querySelector('.view')});
			});

		},

		backPrePage: function(){
			switch( this.indexPage ) {
				case 1 :
					this.view.innerHTML = '';
					this.prePage.style.display = 'block';
					document.body.removeChild(this.view);
					break;
				case 2 :
					$('#search_page', this.view).css({'display':'block'}).siblings('section').css({'display':'none'});
					this.indexPage = 1;
					this.scrollAble();
					break;
				case 3 :
					$('#result_page', this.view).css({'display':'block'}).siblings('section').css({'display':'none'});
					this.indexPage = 2;
					this.scrollAble();
					break;
			}
		}


	};

	function setSearchPhonyData(){
		return [
			{id:'1',poster:'../img/course.jpg',title:'和熊孩子过招的心理战术',author:'李维宗',type:1},
			{id:'1',poster:'../img/course.jpg',title:'和熊孩子过招的心理战术',author:'李维宗',type:2},
			{id:'1',poster:'../img/course.jpg',title:'和熊孩子过招的心理战术',author:'李维宗',type:3},
			{id:'1',poster:'../img/course.jpg',title:'和熊孩子过招的心理战术',author:'李维宗',type:1},
			{id:'1',poster:'../img/course.jpg',title:'和熊孩子过招的心理战术',author:'李维宗',type:2},
			{id:'1',poster:'../img/course.jpg',title:'和熊孩子过招的心理战术',author:'李维宗',type:3}
		];
	}

})($);