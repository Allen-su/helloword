define(function(require, exports, module){

	var url = 'media/sounds/',
		lrcUrl = 'media/lrc/',
		avatar = 'media/avatar/';
	var songs = [
		{
			id: 0,
			title:'Get Ready For It',
			avatar: avatar + 'm1.jpg',
			author: 'Take That',
			like: false,
			isDel: false,
			path: url + 'm1.mp3'
		},
		{
			id: 1,
			title:'See You Again',
			avatar: avatar + 'm2.jpg',
			author: 'Wiz Khalifa',
			like: false,
			isDel: false,
			path: url + 'm2.mp3',
			lrcPaht: lrcUrl + 'm2.lrc'
		},
		{
			id: 2,
			title:'オセンチな歩美',
			avatar: avatar + 'm3.jpg',
			author: '大野克夫',
			like: false,
			isDel: false,
			path: url + 'm3.mp3'
		},
		{
			id: 3,
			title:'Hold On \'Til The Night',
			avatar: avatar + 'm4.jpg',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm4.m4a',
			lrcPaht: lrcUrl + 'm4.lrc'
		},
		{
			id: 4,
			title:'Summertrain',
			avatar: avatar + 'm4.jpg',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm5.mp3',
			lrcPaht: lrcUrl + 'm5.lrc'
		},
		{
			id: 5,
			title:'Take My Heart',
			avatar: avatar + 'm6.jpg',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm6.m4a',
			lrcPaht: lrcUrl + 'm6.lrc'
		},
		{
			id: 6,
			title:'Waiting Outside The Lines',
			avatar: avatar + 'm7.jpg',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm7.m4a',
			lrcPaht: lrcUrl + 'm7.lrc'
		}

	];
	module.exports = songs;
});