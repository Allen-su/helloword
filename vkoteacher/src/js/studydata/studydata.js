

(function($,exports){
	var scrollWrap = document.querySelector('.scroll_wrap'),
		studyDataWrap = document.querySelector('.data_wrap'),
		studyDataContainer = document.querySelector('.data_wrap .data'),
		filterPanel = null, url, curFilterData = null;
		scrollHeight = $(scrollWrap).height() - 33, //减去上面的状态栏高度
		studyDataScroll = new IScroll(document.querySelector('.data_wrap'),
			{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});

	//ajax获取数据并填充页面-------------------------------------------------------------------------------
	//获取学习数据
	function getStudyData( data ){
		data = data || {};
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillData(msg.data);
				} else {
					fillData(setPhonyData(data));
				}
			}
		});
	}

	//填充学习数据
	function fillData(data){
		var html = [], item;
		for ( var i = 0, len = data.data.length; i < len; i++ ) {
			item = data.data[i];
			html.push('<div class="data_item clearfix">');
			html.push(	'<div class="name">');
			html.push(		item.username);
			html.push(	'</div>');
			html.push(	'<div class="content">');
			html.push(		'<div class="progress">');
			html.push(			'<div class="curpro" style="width:'+item.progress+'"></div>');
			html.push(			'<span class="num">'+item.progress+'</span>');
			html.push(		'</div>');
			html.push(	'</div>');
			html.push('</div>');
		}
		$('.crumbs').html(data.klass.name+' / '+data.subject.name+' / '+data.knowledgePoint.name);
		delete data.data;
		curFilterData = data;
		studyDataContainer.innerHTML = html.join('');
		scrollHeight = $(scrollWrap).height() - 33;
		studyDataWrap.style.height = scrollHeight + 'px';
		studyDataScroll.refresh();
	}

	function bindEvent(){
		$('.title ul li').bind('click',function() {
			switchNav($(this));
		});
		$('.filter_btn').bind('click', function(){
			showFilterPanel();
		});

	}


	function switchNav( $el ){
		var index = $el.index();
		$el.addClass('cur').siblings('li').removeClass('cur');
		if ( index === 0 ) {
			url = '/gethomework';
		} else {
			url = '/getvideo';
		}
		filterPanel && filterPanel.destroy( scrollWrap ), filterPanel = null;
		studyDataWrap.style.display = 'block';
		getStudyData();
	}

	function showFilterPanel() {
		if ( !filterPanel ) {
			filterPanel = new vko.com.FilterPanel({
				data: curFilterData,
				url : url,
				height: scrollHeight,
				callback: filterData
			});
			studyDataWrap.style.display = 'none';
			filterPanel.view.style.top = -scrollHeight + 33 + 'px';
			filterPanel.view.style.display = 'block';
			filterPanel.view.className = 'slide_down';
			scrollWrap.appendChild(filterPanel.view);
			setTimeout(function(){
				filterPanel.view.style.top = 33 + 'px';
			},0);
		} else if ( filterPanel.view.style.top == (33 + 'px') ) {
			//filterPanel.view.style.display = 'none';
			filterPanel.view.style.top = -scrollHeight + 33 + 'px';
			studyDataWrap.style.display = 'block';
		} else {
			//filterPanel.view.style.display = 'block';
			filterPanel.view.style.top = 33 + 'px';
			studyDataWrap.style.display = 'none';
		}
	}

	function filterData(data){
		filterPanel.view.style.top = -scrollHeight + 33 + 'px';
		studyDataWrap.style.display = 'block';
		getStudyData(data);
	}


	function init(){
		getStudyData();
		bindEvent();
	}

	init();




	//设置假数据
	function setPhonyData(status){
		var data1, data = [], random, name;
		for ( var i = 0; i < 20; i++ ) {
			random = Math.random().toFixed(2) * 100;
			name = Math.random() > 0.5 ? '徐蕾' : '蒋欣';
			data.push({username:name,progress:random+'%'});
		}
		if ( status.klass ) {
			data1 = status;
			data1.data = data;
		} else {
			data1 = {data: data, klass:{id:1, name:'高一1班'}, subject:{id:1, name:'立体几何'},
						knowledgePoint:{id:0, name:'正方体'}};
		}
		return data1;
	}

})( $, window );