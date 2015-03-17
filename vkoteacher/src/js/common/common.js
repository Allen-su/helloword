

if ( navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ) {
	//防止在ios中a标签跳转到Safari
	if(("standalone" in window.navigator) && window.navigator.standalone){
		var noddy, remotes = false;
		document.addEventListener('click', function(event) {
		noddy = event.target;
		while(noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
			noddy = noddy.parentNode;
		}
		if('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)){
			event.preventDefault();
			document.location.href = noddy.href;
			}
		},false);
	}
}

document.addEventListener('touchmove', function(e){
	e.preventDefault();
}, false);