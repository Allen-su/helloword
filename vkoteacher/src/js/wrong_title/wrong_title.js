

(function($,exports){
	var isOpenPersonPage = false; //当前打开的是否是个人错题本页面
		dataWrap = document.querySelector('.data_wrap');
		dataContainer = document.querySelector('.data_wrap .data');
		errordataContainer = document.querySelector('.errordata');

		titleEl = document.querySelector('.title');
		dataScroll = new IScroll(document.querySelector('.data_wrap'),
		{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});

//ajax获取数据并填充页面-------------------------------------------------------------------------------
	//获取错题本数据
	function getWrongtitleData( obj ){
		obj = obj || {};
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillData(msg.data);
				} else {
					fillData(setPhonyData());
				}
				dataWrap.style.height = $('.scroll_wrap').height() - 61 + 'px';
				dataScroll.refresh();
			}
		});
	}

	//获取过滤列表 TODO:需要联动？
	function getFilterList(){
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillFilterList(msg.data);
				} else {
					fillFilterList(setFilterListPhonyData());
				}
			}
		});
	}

	//获取个人错题数据
	function getPersonData( obj ){
		obj = obj || {};
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
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
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
		dataContainer.innerHTML = html.join('');
	}

	//填充过滤列表
	function fillFilterList(data){
		var html = [], item, i , len, firstClass = '',
			klass = $('.klass'),
			subject = $('.subject'),
			point = $('.point');

		for ( i = 0, len = data.klass.length; i < len; i++ ) {
			item = data.klass[i];
			//i === 0 ? firstClass = 'cur' : firstClass = '';
			html.push('<li data-id="'+item.id+'" class="'+firstClass+'">'+item.name+'</li>');
		}
		klass.html(html.join(''));
		html = [];
		for ( i = 0, len = data.subject.length; i < len; i++ ) {
			item = data.subject[i];
			//i === 0 ? firstClass = 'cur' : firstClass = '';
			html.push('<li data-id="'+item.id+'" class="'+firstClass+'">'+item.name+'</li>');
		}
		subject.html(html.join(''));
		html = [];
		for ( i = 0, len = data.point.length; i < len; i++ ) {
			item = data.point[i];
			//i === 0 ? firstClass = 'cur' : firstClass = '';
			html.push('<li data-id="'+item.id+'" class="'+firstClass+'">'+item.name+'</li>');
		}
		point.html(html.join(''));

	}

	function fillPersonData(data){
		var html = [], item;
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
			html.push('<div>'+(i+1)+' '+item.question+'</div>');
		}
		errordataContainer.innerHTML = html.join('');
	}


//交互和绑定事件--------------------------------------------------------------------------------------
	//设置选定的当前过滤条件
	var curfilterData = (function(){
		var data = {
			klass: '',
			subject: '',
			point: ''
		};

		return {
			recur: function(){
				data = {
					klass: '',
					subject: '',
					point: ''
				};
			},
			setKlass: function( klass ){
				data.klass = klass;
				getWrongtitleData(data);
			},
			setSubject: function( subject ){
				data.subject = subject;
				getWrongtitleData(data);
			},
			setPoint: function( point ){
				data.point = point;
				getWrongtitleData(data);
			},
			getcurFilterData: function(){
				return data;
			}
		};

	})();


	function bindEvent(){
		$('.title_left a').bind('click', function(e){
			isOpenPersonPage && e.preventDefault();switchClassData();
		});
		$('ul.tabs').tabs('.tabs_content');
		$('.tabs_content').on('click', 'li', function(){
			var that = $(this);
			filter(that);
			return false;
		});
		$('.data').on('click', '.data_item', function(){
			switchPersonData($(this));
		});
		$('.scroll_wrap').bind('touchmove click', function(){
			$('.tabs_content ul').removeClass('active');
			$('.tabs li').removeClass('active');
		});
	}

	//过滤学习数据
	function filter( $el ){
		var filterName = $el.closest('ul').attr('data-tab'),
			filterContent = $el.attr('data-id');
		$el.addClass('cur').siblings('li').removeClass('cur');
		switch ( filterName ) {
			case 'klass' :
				curfilterData.setKlass(filterContent);
				break;
			case 'subject' :
				curfilterData.setSubject(filterContent);
				break;
			case 'point' :
				curfilterData.setPoint(filterContent);
				break;
		}
		/*setTimeout(function(){
			$('.tabs_content ul').removeClass('active');
			$('.tabs li').removeClass('active');
		},100);*/
		switchClassData();
	}

	function switchPersonData( $el ){
		var userid = $el.attr('data-id'), username = $el.attr('data-name');
		getPersonData(userid);
		isOpenPersonPage = true;
		titleEl.innerHTML = username + '的错题本';
		dataContainer.style.display = 'none';
		errordataContainer.style.display = 'block';
	}

	function switchClassData(){
		isOpenPersonPage = false;
		titleEl.innerHTML = '班级错题本';
		dataContainer.style.display = 'block';
		errordataContainer.style.display = 'none';
	}

	function init(){
		getWrongtitleData();
		getFilterList();
		bindEvent();
	}

	init();




	//设置假数据
	function setPhonyData(){
		var data = [], random, name;
		for ( var i = 0; i < 20; i++ ) {
			random = Math.round( Math.random() * 100 );
			name = Math.random() > 0.5 ? '徐蕾' : '蒋欣';
			data.push({userid:123,username:name,total:100,errorCount:random});
		}
		return data;
	}

	function setFilterListPhonyData(){
		var data = {klass:[], subject:[], point:[]}, i;
		for ( i = 0; i < 10; i++ ) {
			data.klass.push({name:'高一'+i+'班',id:i});
		}
		for ( i = 0; i < 10; i++ ) {
			data.subject.push({name:'数学',id:i});
		}
		for ( i = 0; i < 10; i++ ) {
			data.point.push({name:'推理证明',id:i});
		}
		return data;
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