define(function(require){
	require('jquery');
	var contentBox = $('#program > div'),
		navBox = $('.nav_list'),
		nav_list = navBox.children('li'),
		findProgram = $('.pro_nav_list'),
		findProgramLi = findProgram.children('li');

	function switchNav( e ){
		var item = e.target;
		if ( item.tagName.toLowerCase() !== 'li') { return; }
		var index = -1;
		nav_list.each(function( i, el ){
			if ( this == item ) {
				index = i;
				return false;
			}
		});
		nav_list.removeClass('active').eq(index).addClass('active');
		contentBox.removeClass('active').eq(index).addClass('active');
	}

	function switchProNav( e ) {
		var item = e.target;
		if ( item.tagName.toLowerCase() !== 'li') { return; }
		var index = -1;
		findProgramLi.removeClass('active');
		item.className = 'active';
	}


	if ( navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ||
		navigator.userAgent.match(/Android/i)) {
		navBox[0].addEventListener('touchend', switchNav, false);
		findProgram[0].addEventListener('touchend', switchProNav, false);
	} else {
		navBox[0].addEventListener('click', switchNav, false);
		findProgram[0].addEventListener('click', switchProNav, false);
	}
	
	
});