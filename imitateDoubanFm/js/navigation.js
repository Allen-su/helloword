define(function(require){
	require('jquery');
	var contentBox = $('#program > div'),
		navBox = $('.nav_list'),
		nav_list = navBox.children('li');

	navBox.on('click', 'li', function(){
		var index = navIndexOf(nav_list, this);
		nav_list.removeClass('active').eq(index).addClass('active');
		contentBox.removeClass('active').eq(index).addClass('active');
	});


	function navIndexOf( box , item ){
		var index = -1;
		box.each(function( i, el ){
			if ( this == item ) {
				index = i;
				return false;
			} 
		});
		return index;
	}
});