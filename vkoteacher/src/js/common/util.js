//**boot****************************************************************
;(function(exports){
	exports.vko = exports.vko || {};
	exports.Vtool = exports.Vtool || {};
	exports.namespace = function(name){
		var parts = name.split('.');
		var current = exports.vko;
		for (var i in parts) {
			if (!current[parts[i]]) {
				current[parts[i]] = {};
			}
			current = current[parts[i]];
		}
	};

	if ( !String.prototype.trim ) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/, "");
		};
	}
	document.addEventListener('touchmove', function(e){ e.preventDefault(); }, false);
})(window);


//**Vtools**************************************************************
;(function(exports){
	exports.vko = exports.vko || {};
	Vtool.GID = Date.now();
	Vtool.alert = function(){
		//TODO:放到其他文件
	};

	Vtool.scroll = function(){
		var script = document.querySelector('#iscroll_' + Vtool.GID);
		if ( !script ) { return; }
	};

	//@TODO: rewrite lazyload
	Vtool.loadScript = function(url){
		var script = document.createElement( 'script' );
		script.id = 'iscroll-probe';
		script.type = "text/javascript";
		script.src = url;
		document.body.appendChild(script);
	};

	//* @inner***************************




	(function (){
		var userAgent = navigator.userAgent;
		Vtool.browser = {};
		Vtool.browser.isOpera = userAgent.indexOf("Opera") > -1;
		Vtool.browser.isMaxthon = userAgent.indexOf("Maxthon") > -1 ;
		Vtool.browser.isIE = userAgent.indexOf("compatible") > -1 &&
				userAgent.indexOf("MSIE") > -1 && !Vtool.browser.isOpera ;
		Vtool.browser.isIE9=userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE 9.") > -1 &&
			!Vtool.browser.isOpera && userAgent.indexOf("rv:11") < 0 && userAgent.indexOf("rv:10") < 0;
		Vtool.browser.isFF = userAgent.indexOf("Firefox") > -1 ;
		Vtool.browser.isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 1;
		Vtool.browser.isChrome = userAgent.indexOf("Chrome") > -1;
		Vtool.browser.isIphone = userAgent.match(/iPhone/i);
		Vtool.browser.isIOS5 = userAgent.match(/OS 5[_\d]+ like Mac OS X/i);
		Vtool.browser.isIOS6 = userAgent.match(/OS 6[_\d]+ like Mac OS X/i);
		Vtool.browser.isIOS7 = userAgent.match(/OS 7[_\d]+ like Mac OS X/i);
		Vtool.browser.isIOS8 = userAgent.match(/OS 8[_\d]+ like Mac OS X/i);
		Vtool.browser.isIOS6orup = userAgent.match(/OS [6-9]_\d[_\d]* like Mac OS X/i);
		Vtool.browser.isIpad = userAgent.match(/iPad/i);
		Vtool.browser.isAndroid = userAgent.match(/Android/i);
		Vtool.browser.isMobile = Vtool.browser.isIphone || Vtool.browser.isIpad || Vtool.browser.isAndroid;
		// Vtool.browser.isIE9=userAgent.match(/msie 9/i);

		if(Vtool.browser.isIE){
			//ie9及以上useragent都显示msie 9，应该以后面的rv来判断
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			Vtool.browser.ieVersion = parseFloat(RegExp["$1"]);
		}

	})();
	exports.Vtool = Vtool;
})(window);

