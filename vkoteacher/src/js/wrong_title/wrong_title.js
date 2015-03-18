

(function($,exports){
	var isOpenPersonPage = false; //当前打开的是否是个人错题本页面
		scrollWrap = document.querySelector('.scroll_wrap'),
		dataWrap = document.querySelector('.data_wrap');
		dataContainer = document.querySelector('.data_wrap .data');
		errordataContainer = document.querySelector('.errordata');

		filterPanel = null, curFilterData = null;
		scrollHeight = $(scrollWrap).height() - 33, //减去上面的状态栏高度

		titleEl = document.querySelector('.title');
		dataScroll = new IScroll(document.querySelector('.data_wrap'),
		{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});

//ajax获取数据并填充页面-------------------------------------------------------------------------------
	//获取错题本数据
	function getWrongtitleData( data ){
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

	//获取个人错题数据
	function getPersonData( data ){
		data = data || {};
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillPersonData(msg.data);
				} else {
					fillPersonData(setPersonPhonyData());
				}
				dataWrap.style.height = $('.scroll_wrap').height() - 61 + 'px';
				dataScroll.refresh();
			}
		});
	}

	//填充错题数据
	function fillData(data){
		var html = [], item;
		for ( var i = 0, len = data.data.length; i < len; i++ ) {
			item = data.data[i];
			html.push('<div class="data_item clearfix" data-id="'+item.userid+'" data-name="'+item.username+'">');
			html.push(	'<div class="name">');
			html.push(		item.username);
			html.push(	'</div>');
			html.push(	'<div class="content">');
			html.push(		'<div class="progress">');
			html.push(			'<div class="curpro" style="width:'+((item.total - item.errorCount)/item.total)*100+'%"></div>');
			html.push(			'<span class="num">'+item.errorCount+'错/共回答'+item.total+'题</span>');
			html.push(		'</div>');
			html.push(	'</div>');
			html.push('</div>');
		}
		$('.crumbs').html(data.klass.name+' / '+data.subject.name+' / '+data.knowledgePoint.name);
		delete data.data;
		curFilterData = data;
		dataContainer.innerHTML = html.join('');
		scrollHeight = $(scrollWrap).height() - 33;
		dataWrap.style.height = scrollHeight + 'px';
		dataScroll.refresh();
	}

	//填充个人错题本
	function fillPersonData(data){
		var html = [], item;
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
			html.push('<div>'+(i+1)+' '+item.question+'</div>');
		}
		errordataContainer.innerHTML = html.join('');
	}


//交互和绑定事件--------------------------------------------------------------------------------------

	function bindEvent(){
		$('.title_left a').bind('click', function(e){
			if ( isOpenPersonPage ) {
				hideFilterPanel();
				switchListData();
				return false;
			}
		});

		$('.data').on('click', '.data_item', function(){
			switchPersonData($(this));
		});

		$('.filter_btn').bind('click', function(){
			showFilterPanel();
		});
	}

	//切换到个人错误页面
	function switchPersonData( $el ){
		var userid = $el.attr('data-id'), username = $el.attr('data-name');
		getPersonData(userid);
		isOpenPersonPage = true;
		titleEl.innerHTML = username + '的错题本';
		dataContainer.style.display = 'none';
		errordataContainer.style.display = 'block';
	}

	//切换会错误列表页
	function switchListData(){
		isOpenPersonPage = false;
		titleEl.innerHTML = '班级错题本';
		dataContainer.style.display = 'block';
		errordataContainer.style.display = 'none';
	}

	//显示过滤页
	function showFilterPanel() {
		if ( !filterPanel ) {
			filterPanel = new vko.com.FilterPanel({
				data: curFilterData,
				url : '',
				height: scrollHeight,
				callback: filterData
			});
			dataWrap.style.display = 'none';
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
			dataWrap.style.display = 'block';
		} else {
			//filterPanel.view.style.display = 'block';
			filterPanel.view.style.top = 33 + 'px';
			dataWrap.style.display = 'none';
		}
	}

	function hideFilterPanel() {
		if ( filterPanel ) {
			filterPanel.view.style.top = -scrollHeight + 33 + 'px';
			dataWrap.style.display = 'block';
		}
	}

	//选好过滤字段后的回调
	function filterData(data){
		isOpenPersonPage && switchListData();
		filterPanel.view.style.top = -scrollHeight + 33 + 'px';
		dataWrap.style.display = 'block';
		getWrongtitleData(data);
	}

	function init(){
		getWrongtitleData();
		bindEvent();
	}

	init();




	//设置假数据
	function setPhonyData(status){
		var data1, data = [], random, name;
		for ( var i = 0; i < 20; i++ ) {
			random = Math.round( Math.random() * 100 );
			name = Math.random() > 0.5 ? '徐蕾' : '蒋欣';
			data.push({userid:123,username:name,total:100,errorCount:random});
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

	function setPersonPhonyData(){
		var data = [], random, question;
		for ( var i = 0; i < 5; i++ ) {
			random = Math.round( Math.random() * 100 );
			question = random > 50 ? '房子是我从房东手上租的，是我的校友，当时租的时候合同上写明可以转租，到时候你和房东再签个合同就行，没有其他费用，我当时看过房东的房产证'
				: '家在牡丹园，电梯直达六楼，所有房间都有窗户和空调，家里你想要的都有：冰箱、洗衣机、微波炉，厨房可做饭，周边你想要的也都有';
			data.push({question:question});
		}
		return data;
	}

})( $, window );