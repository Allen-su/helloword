

(function($,exports){
	var allWrap = document.querySelector('#all');
		myWrap = document.querySelector('#my');
		allCourseContainer = allWrap.querySelector('.all');
		myCourseContainer = myWrap.querySelector('.all');
		allmoocContainer = allWrap.querySelector('.vedio_list');
		mymoocContainer = myWrap.querySelector('.vedio_list');
		page = {curCourseContainer:allCourseContainer, curMoocContainer:allmoocContainer, myPageLoaded: false};
		moocScroll = new IScroll(document.querySelector('.scroll_wrap'),
		{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});

	var mooc = {
		start: 0,
		count: 20,
		courseId: 1,
		url: ''
	};

//ajax获取数据并填充页面-------------------------------------------------------------------------------
	//获取课程列表，只获取一次
	function getCourses(url){
		var data = {curCourseContainer: page.curCourseContainer};
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				//初始化并不获取我的课程列表，档触发获取我的课程后，不在获取
				if ( data.curCourseContainer == myCourseContainer ) {
					page.myPageLoaded = true;
				}

				if ( msg.success ) {
					data.data = msg.data;
					fillCourses(data);
				} else {
					data.data = setPhonyData();
					fillCourses(data);
				}
				moocScroll.refresh();
			}
		});
	}

	function getMoocs(){
		var data = {curMoocContainer: page.curMoocContainer};
		$.ajax({
			url: '',//用mooc拼接
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					data.data = msg.data;
					fillMoocs(msg.data);
				} else {
					data.data = setMoocPhonyData();
					fillMoocs(data);
				}
				moocScroll.refresh();
			}
		});
	}

	function fillCourses(data){
		var html = [], item, list = data.data;
		html.push('<li class="cur">全部</li>');
		for ( var i = 0, len = list.length; i < len; i++ ) {
			item = list[i];
			html.push('<li data-course="'+item.courseId+'">'+item.courseName+'</li>');
		}
		//TODO:可以先判断start是否为 0 ，在选择是 += 或者 =
		data.curCourseContainer.innerHTML = html.join('');
		delete data.curCourseContainer;
	}

	function fillMoocs(data){
		var html = [], item, list = data.data;
		for ( var i = 0, len = list.length; i < len; i++ ) {
			item = list[i];
			html.push('<div class="vedio_item" data-id="'+item.moocId+'">');
			html.push(	'<div class="avatar">');
			html.push(		'<img src="'+item.poster+'" alt="课程" />');
			html.push(		'<i></i>');
			html.push(	'</div>');
			html.push(	'<div class="desc">');
			html.push(		'<div class="title">'+item.moocTitle+'</div>');
			html.push(		'<div class="author">主要讲师：'+item.author+'</div>');
			html.push(		'<div class="time">'+item.date+'</div>');
			html.push(	'</div>');
			html.push('</div>');
		}
		//TODO:可以先判断start是否为 0 ，在选择是 += 或者 =
		data.curMoocContainer.innerHTML = html.join('');
		delete data.curMoocContainer;
	}


//交互和绑定事件--------------------------------------------------------------------------------------
	function bindEvent(){
		$('.title').on('click', 'li', function(){
			switchNav($(this));
		});
		$('.all').on('click', 'li', function(){
			switchCourse($(this));
		});
		$('.vedio_list').on('click', '.vedio_item', function(){
			new vko.com.moocPlay({prePage:document.querySelector('.view')});
		});
		$('.title_right').bind('click',function(){
			new vko.com.searchCourse({prePage:document.querySelector('.view')});
		});
	}

	function switchNav( $el ){
		var index = $el.index();
		if ( index === 0 ) {
			page.curCourseContainer = allCourseContainer;
			page.curMoocContainer = allmoocContainer;
			allWrap.style.display = 'block';
			myWrap.style.display = 'none';
		} else {
			page.curCourseContainer = myCourseContainer;
			page.curMoocContainer = mymoocContainer;
			if ( !page.myPageLoaded ) {
				getCourses();
				getMoocs();
			}
			allWrap.style.display = 'none';
			myWrap.style.display = 'block';
		}
		$el.addClass('cur').siblings().removeClass('cur');
	}

	function switchCourse( $el ){
		$el.addClass('cur').siblings('li').removeClass('cur');
		//TODO: 设置mooc
		getMoocs();
	}

	function init(){
		getCourses();
		getMoocs();
		bindEvent();
	}

	init();





//设置假数据
	function setPhonyData(){
		var course = Math.random() > 0.5 ? '数学' : '英语';
		var data = [{courseId:1, courseName:course},{courseId:1, courseName:course},{courseId:1, courseName:course},
				{courseId:1, courseName:course},{courseId:1, courseName:course},{courseId:1, courseName:course},
				{courseId:1, courseName:course},{courseId:1, courseName:course}];
		return data;
	}

	function setMoocPhonyData(){
		var date = (new Date()).getSeconds();
		var data = [
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'},
			{moocId:'1',poster:'../img/course.jpg',moocTitle:'和熊孩子过招的心理战术',author:'李维宗',date:'20分'+date+'秒'}
		];
		return data;
	}







})( $, window );