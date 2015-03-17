
(function($,exports){

	var hwListEl = document.querySelector('.hw_list'), view = document.querySelector('.view');
	var hwScroll = new IScroll(document.querySelector('.scroll_wrap'),
		{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true, probeType: 1 });
	var dataCount = {start: 0, count: 20 }, homeworkList = {};

	function getData( obj ){
		obj = obj || {};
		obj.date = obj.date || '';
		var loadMoreEl = loadMore();
		hwListEl.appendChild(loadMoreEl);
		hwScroll.refresh();
		$.ajax({
			url: '',
			type: 'get',
			datatype: 'json',
			success: function(msg){
				if ( msg.success ) {
					fillData(msg.data);
				} else {
					setTimeout(function(){
						try {
							hwListEl.removeChild(loadMoreEl);
						} catch (e){
							console.log('loadMoreEl not in hwListEl');
						}
						fillData(setPhonyList());
					},1000);
				}
			}
		});
	}

	function fillData(data){
		var fragment = document.createDocumentFragment(),
			itemEl,
			cloneEl,
			item;
		itemEl = document.createElement('div');
		itemEl.className = "item";
		for ( var i = 0, len = data.length; i < len; i++ ) {
			item = data[i];
			cloneEl = itemEl.cloneNode();
			cloneEl.id = item.id;
			cloneEl.innerHTML =
				'<div class="date" >'+
					item.time+
				'</div>'+
				'<i class="right_arrow"></i>'+
				'<div class="info">'+
					item.klass+'&nbsp;&nbsp;&nbsp;涉及知识点：'+item.point+
				'</div>';
			fragment.appendChild(cloneEl);
		}
		homeworkFormat(data);
		hwListEl.appendChild(fragment);
		hwScroll.refresh();
	}

	function filterHW(date){
		$(hwListEl).empty();
		getData({date:new Date(date).getTime()});
	}

	function homeworkFormat(array){
		var item ;
		for ( var i = 0, len = array.length; i < len; i++ ) {
			item = array[i];
			homeworkList[item.id] = item;
		}
		return homeworkList;
	}


	function bindEvent(){
		$('.hw_list').on('click', '.item', function () {
			new vko.com.homeworkDetail({data: homeworkList[this.id], prePage: view});
		});

		$('#date_filter').on('blur', function(){
			filterHW(this.value);
		});

		hwScroll.on('scroll', function(){
			console.dir(this);
			console.info(this.y+'sadfsdafdf'+this.maxScrollY);
			if ( this.y <= this.maxScrollY ) {
				getData();
			}
		});
	}

	function init(){
		bindEvent();
		getData();
	}

	init();

	function loadMore(){
		if ( !arguments.callee.loadMoreEl ) {
			arguments.callee.loadMoreEl = document.createElement('div');
			arguments.callee.loadMoreEl.className = 'pull_up_refresh_wrap';
			arguments.callee.loadMoreEl.innerHTML = '<div class="pull_up_refresh"><i></i><span>正在加载...</span></div>';
		}
		
		return arguments.callee.loadMoreEl;
	}


	function setPhonyList(){
		return [
			{id:'0', point:'JAVA', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'JAVA' },
			{id:'1', point:'JS', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'JS' },
			{id:'2', point:'jQuery', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'jQuery' },
			{id:'3', point:'angularJS', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'angularJS' },
			{id:'4', point:'require', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'require' },
			{id:'5', point:'backbone', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'backbone' },
			{id:'6', point:'nodeJS', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'nodeJS' },
			{id:'7', point:'JAVA', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'JAVA' },
			{id:'8', point:'python', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'python' },
			{id:'9', point:'C++', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'C++' },
			{id:'10', point:'Linux', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'Linux' },
			{id:'11', point:'swift', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'swift' },
			{id:'12', point:'Objective-C', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'Objective-C' },
			{id:'13', point:'android', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'android' },
			{id:'14', point:'VB', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'VB' },
			{id:'15', point:'seajs', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'seajs' },
			{id:'16', point:'shell', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'shell' },
			{id:'17', point:'C#', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'C#' },
			{id:'18', point:'PHP', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'PHP' },
			{id:'19', point:'Ruby', time:'2014-05-15', klass:'高一1班', hasPic:'0', name:'Ruby' },
			{id:'20', point:'Lisp', time:'2014-05-15', klass:'高一1班', hasPic:'1', name:'Lisp' }
		];
	}
})( $, window );























