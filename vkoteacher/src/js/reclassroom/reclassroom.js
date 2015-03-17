


(function($,exports){
	var view = document.querySelector('.view');
	var listEl = document.querySelector('.scroll_wrap .vedio_list');
	var listScroll = new IScroll(document.querySelector('.scroll_wrap'),
		{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});
	var dataCount = {start: 0, count: 20 };
	var menu = {menuEl:null, id:0};
	var listData = {}, start = 0;

	function getData( obj ){
		obj = obj || {};
		obj.date = obj.date || '';
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					if ( start === 0 ) { listData = {}; }
					fillData(msg.data);
				} else {
					fillData(setPhonyData());
				}
			}
		});
	}

	function fillData(data){
		var html = [], item;
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
			html.push('<div class="vedio_item"  data-id="'+item.id+'">');
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
			listData[item.id] = item;
		}
		listEl.innerHTML = html.join('');
		listScroll.refresh();
	}

	function bindEvent(){
		$('.vedio_list').on('click', '.vedio_item', function(){
			showMenu(this);
		});

		$(menu.menuEl).on('click', '.watch', function(){
			new vko.com.reclassroom({data:listData[menu.id], prePage: view});
		});
		$(menu.menuEl).on('click', '.check', function(){
			new vko.com.reclassroomHomework({data:listData[menu.id], prePage: view});
		});
		$(menu.menuEl).on('click', '.discuss', function(){
			new vko.com.reclassroomDiscussList({data:listData[menu.id], prePage: view});
		});
	}

	function showMenu(el){
		listEl.insertBefore(menu.menuEl, el.nextSibling);
		if ( !menu.id ) {
			listScroll.refresh();
		}
		menu.id = el.getAttribute('data-id');
	}

	function init(){
		//初始化menu
		var ul = document.createElement('ul');
		ul.className = 'nav clearfix';
		ul.innerHTML = '<li class="watch" >视频</li><li class="check" >查作业</li><li class="discuss" >讨论</li>';
		menu.menuEl = ul;

		getData();
		bindEvent();
	}

	init();



	function setPhonyData(){
		var data = [
			{id:'1',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 1 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'2',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 2 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'3',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 3 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'4',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 4 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'5',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 5 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'6',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 6 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'7',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 7 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'8',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 8 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'9',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 9 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'},
			{id:'10',goal:'WiredTiger是一个高性能、可扩展性、支持压缩和文档级锁的NoSQL存储引擎',
				poster:'../img/course.jpg',title:'诗歌形式结构 - 卒章显示 ( 10 )',grade:'高二三班',
				cycle:'2014.11.18-2014.11.30',reclassroomDate:'2014.12.15'}
		];
		return data;
	}


})($,window);