window.vko = window.vko || {};
vko.com = vko.com || {};

//筛选数据面板	
//		data: {klassId:'0', subjectId:'0', knowledgePointId:'0'}, 初始化的状态，当前显示的数据有哪些   *必须
//		url : url,获取哪种数据的url  *必须
//		callback: filterData 回调，会返回当前选中的状态，包括班级、学科、知识点的ID *必须
//		height: 当前页面需要显示的高度  *必须
(function($){
	vko.com.FilterPanel = function(options){
		options = options || {};
		this.data = options.data || {};
		//this.prePage = options.prePage;
		this.url = options.url;
		this.height = options.height;
		this.callback = options.callback;
		//当前过滤数据的列表，选中的字段，非实时的，是当前ajax后显示数据的来源字段
		this.curFilterStatus = {klass:{id:'', name:''}, subject:{id:'', name:''}, knowledgePoint:{id:'', name:''}};
		//当前过滤数据的列表，选中的字段，实时的
		this.curFilterStash = {klass:{id:'', name:''}, subject:{id:'', name:''}, knowledgePoint:{id:'', name:''}};
		this.init();
	};

	vko.com.FilterPanel.prototype = {
		init: function(){
			var viewHTML = [];
			this.view = document.createElement('section');
			this.view.style.position = 'absolute';
			this.view.style.overflow = 'hidden';
			this.view.style.height = this.height+'px';
			this.view.style.width = '100%';


			viewHTML.push('<section class="filter_box">');
			viewHTML.push('<aside class="klass_selector"></aside>');
			viewHTML.push('<article class="subject_selector"></article>');
			viewHTML.push('</section>');

			this.view.innerHTML = viewHTML.join('');
			//document.body.appendChild(this.view);
			this.scrollAble();
			//this.prePage.style.display = 'none';
			this.getKlassSubject();
			this.bindEvent();
		},

		//获取班级及其班级下面的课程
		getKlassSubject: function() {
			var self = this;
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillKlassSubject(msg.data);
					} else {
						self.fillKlassSubject(setKlassSubjectPhonyData());
					}
				}
			});
		},
		//填充班级和课程
		fillKlassSubject: function(data) {
			var klassHtml = [], subjectHtml = [], item,
				showKlassClass = '', showSubjectClass = '', showKnowledgePointClass = '',
				klassSelector = this.view.querySelector('.klass_selector'),
				subjectSelector = this.view.querySelector('.subject_selector');

			for ( var i = 0, len = data.length; i < len; i++ ) {
				item = data[i];
				this.data.klass.id == item.klassId ? showKlassClass = 'cur' : showKlassClass = '';
				this.data.klass.id == item.klassId ? showSubjectClass = 'display:block;' : showSubjectClass = '';
				//填充班级
				klassHtml.push('<div data-klassid="'+item.klassId+'" class="item '+showKlassClass+'" >'+item.klassName+'</div>');
				subjectHtml.push('<div class="subject_wrap" data-klassid="'+item.klassId+'" style="'+showSubjectClass+'">');
				for ( var subjectId in item.subject ) {
					//填充课程
					this.data.klass.id == item.klassId && this.data.subject.id == subjectId ? 
								showKnowledgePointClass = 'display:block;' : showKnowledgePointClass = '';
					subjectHtml.push('<dl><dt class="subject" data-subjectid="'+
							subjectId+'">'+item.subject[subjectId]+'<i></i></dt>');
					subjectHtml.push('<dd data-subjectid="'+subjectId+'" style="'+
							showKnowledgePointClass+'" class="knowledge_point clearfix"><dd></dl>');
				}
				subjectHtml.push('</div>');
			}

			//将默认的过滤条件添加到curFilterStatus 和 curFilterStash中，并根据此获取知识点
			this.curFilterStatus = $.extend({}, this.data);
			this.curFilterStash = $.extend({}, this.data);
			this.getKnowledgePoint();

			klassSelector.innerHTML = klassHtml.join('');
			subjectSelector.innerHTML = subjectHtml.join('');
			this.scrollAble();
		},

		//根据班级和课程获取知识点
		getKnowledgePoint: function() {
			var self = this;
			//this.curFilterStash
			$.ajax({
				url: '',
				type: 'get',
				datatype: 'json',
				success: function(msg){
					if ( msg.success ) {
						self.fillKnowledgePoint(msg.data);
					} else {
						self.fillKnowledgePoint(setKnowledgePointPhonyData());
					}
				}
			});
		},

		//填充知识点
		fillKnowledgePoint: function(data) {
			var item, html = [], pointClassStatus = '',
				container = $('.subject_wrap[data-klassid="'+ this.curFilterStash.klass.id +
					'"] .knowledge_point[data-subjectid="'+ this.curFilterStash.subject.id +'"]');
			for ( var pointId in data ) {
				//第一次打开此界面，如果this.curFilterStash.knowledgePoint.id有值表示当前知识点是选中的状态
				this.curFilterStash.knowledgePoint.id == pointId ? pointClassStatus = 'cur' : pointClassStatus = '';
				html.push('<span class="'+pointClassStatus+'" data-pointid="'+pointId+'">'+data[pointId]+'</span>');
			}
			container.html(html.join(''));
			this.scrollAble();
		},


//交互和绑定事件--------------------------------------------------------------------------------------
		scrollAble: function() {
			if ( this.scroll ) {
				this.scroll.refresh();
			} else {
				this.scroll = new IScroll( this.view,
					{ scrollY: true, scrollbars: true, click: true, fadeScrollbars: true} );
			}
		},

		bindEvent: function() {
			var self = this;
			$('.title_right', this.view).bind('click', function(){
				new vko.com.searchCourse({prePage:document.querySelector('.view')});
			});

			$('.klass_selector', this.view).on('click', '.item', function(){
				self.viewSubject($(this));
			});

			$('.subject_selector', this.view).on('click', '.subject', function(){
				self.viewKnowledtePoint($(this));
			}).on('click', '.knowledge_point span', function(){
				self.viewFilterData($(this));
			});

		},

		//显示该班级下的课程
		viewSubject: function($el) {
			$el.addClass('cur').siblings().removeClass('cur');
			this.curFilterStash.klass.id = $el.attr('data-klassid');
			this.curFilterStash.klass.name = $el.text();
			this.curFilterStash.subject = {id:'', name:''};
			this.curFilterStash.knowledgePoint = {id:'', name:''};
			$('.subject_selector div[data-klassid="'+this.curFilterStash.klass.id+'"]')
				.css('display', 'block').siblings().css('display', 'none');
			this.scrollAble();
		},

		//显示课程下的知识点
		viewKnowledtePoint: function($el) {
			var knowledgePointWrap = $el.next('.knowledge_point');
			if ( knowledgePointWrap.css('display') == 'block' ) {
				return;
			}
			$('.knowledge_point').css('display', 'none');
			this.curFilterStash.subject.id = $el.attr('data-subjectid');
			this.curFilterStash.subject.name = $el.text();
			this.curFilterStash.knowledgePoint = {id:'', name:''};
			knowledgePointWrap.css('display', 'block');
			if ( knowledgePointWrap.children('span').length == 0 ) {
				this.getKnowledgePoint();
			}
			this.scrollAble();
		},

		//将当前选中的数据回调给上一级页面
		viewFilterData: function($el){
			$('.knowledge_point .cur').removeClass('cur');
			$el.addClass('cur').siblings('.cur').removeClass('cur');
			this.curFilterStash.knowledgePoint.id = $el.attr('data-pointid');
			this.curFilterStash.knowledgePoint.name = $el.text();
			this.curFilterStatus.klass.id = this.curFilterStash.klass.id;
			this.curFilterStatus.klass.name = this.curFilterStash.klass.name;
			this.curFilterStatus.subject.id = this.curFilterStash.subject.id;
			this.curFilterStatus.subject.name = this.curFilterStash.subject.name;
			this.curFilterStatus.knowledgePoint.id = this.curFilterStash.knowledgePoint.id;
			this.curFilterStatus.knowledgePoint.name = this.curFilterStash.knowledgePoint.name;
			this.callback( this.curFilterStatus );
		},

		//销毁，wrap是当前this.view的父节点
		destroy: function(wrap){
			this.view.innerHTML = '';
			wrap.removeChild(this.view);
		}


	};

	function setKlassSubjectPhonyData(){
		return [
			{ klassId:'1', klassName:'高一1班', 'subject':{'0':'数学','1':'立体几何','2':'集合','3':'线性代数','4':'微积分',
					'5':'Node与Express开发','6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'2', klassName:'高一2班', 'subject':{'3':'线性代数','4':'微积分',
					'5':'Node与Express开发','6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'3', klassName:'高一3班', 'subject':{'6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'4', klassName:'高一4班', 'subject':{'3':'线性代数','4':'微积分',
					'5':'Node与Express开发','6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'5', klassName:'高一5班', 'subject':{'7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'6', klassName:'高二1班', 'subject':{'6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'7', klassName:'高二2班', 'subject':{'5':'Node与Express开发','6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'8', klassName:'高二3班', 'subject':{'8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'9', klassName:'高二4班', 'subject':{'7':'算法原理','8':'函数的应用概率','9':'LINUX'}},
			{ klassId:'10', klassName:'高二5班', 'subject':{'0':'数学','1':'立体几何','2':'集合','3':'线性代数','4':'微积分',
					'5':'Node与Express开发','6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'}}
		];
	}

	function setKnowledgePointPhonyData(){
		return {'0':'正方体','1':'立体几何','2':'集合','3':'线性代数','4':'微积分',
					'5':'Node与Express开发','6':'数据结构','7':'算法原理','8':'函数的应用概率','9':'LINUX'};
	}

})($);