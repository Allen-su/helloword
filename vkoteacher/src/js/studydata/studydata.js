

(function($,exports){
	var studyDataWrap = document.querySelector('.data_wrap');
	var studyDataContainer = document.querySelector('.data_wrap .data');
	var studyDataScroll = new IScroll(document.querySelector('.data_wrap'),
		{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true});

	//ajax获取数据并填充页面-------------------------------------------------------------------------------
	//获取学习数据
	function getStudyData( obj ){
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
				studyDataWrap.style.height = $('.scroll_wrap').height() - 61 + 'px';
				studyDataScroll.refresh();
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

	//填充学习数据
	function fillData(data){
		var html = [], item;
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
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
		studyDataContainer.innerHTML = html.join('');
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


	//--------------------------------------------------------------------------------------
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
				getStudyData(data);
			},
			setSubject: function( subject ){
				data.subject = subject;
				getStudyData(data);
			},
			setPoint: function( point ){
				data.point = point;
				getStudyData(data);
			},
			getcurFilterData: function(){
				return data;
			}
		};

	})();


	function bindEvent(){
		$('.title ul li').bind('click',function(){
			switchNav($(this));
			curfilterData.recur();
		});
		$('ul.tabs').tabs('.tabs_content');
		$('.tabs_content').on('click', 'li', function(){
			var that = $(this);
			that.addClass('cur').siblings('li').removeClass('cur');
			filter(that);
			return false;
		});
		$('.scroll_wrap').bind('touchmove click', function(){
			$('.tabs_content ul').removeClass('active');
			$('.tabs li').removeClass('active');
		});
	}


	function switchNav( $el ){
		var index = $el.index(), url;
		$el.addClass('cur').siblings('li').removeClass('cur');
		if ( index === 0 ) {
			url = '/gethomework';
		} else {
			url = '/getvideo';
		}
		getStudyData();
		getFilterList();
	}

	//过滤学习数据
	function filter( $el ){
		var filterName = $el.closest('ul').attr('data-tab'),
			filterContent = $el.attr('data-id');
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
	}

	function init(){
		getStudyData();
		getFilterList();
		bindEvent();
	}

	init();




	//设置假数据
	function setPhonyData(){
		var data = [], random, name;
		for ( var i = 0; i < 20; i++ ) {
			random = Math.random().toFixed(2) * 100;
			name = Math.random() > 0.5 ? '徐蕾' : '蒋欣';
			data.push({username:name,progress:random+'%'});
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

})( $, window );