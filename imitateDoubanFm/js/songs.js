define(function(require, exports, module){

	var url = 'sound/';
	var lrcUrl = 'lrc/';
	var songs = [
		{
			id: 0,
			title:'Get Ready For It',
			avatar: '',
			author: 'Take That',
			like: false,
			isDel: false,
			path: url + 'm1.mp3'
		},
		{
			id: 1,
			title:'See You Again',
			avatar: '',
			author: 'Wiz Khalifa',
			like: false,
			isDel: false,
			path: url + 'm2.mp3',
			lrcPaht: lrcUrl + 'm2.lrc'
		},
		{
			id: 2,
			title:'该死的温柔',
			avatar: '',
			author: '马天宇',
			like: false,
			isDel: false,
			path: url + 'm3.mp3'
		},
		{
			id: 3,
			title:'Hold On \'Til The Night',
			avatar: '',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm4.m4a',
			lrcPaht: lrcUrl + 'm4.lrc'
		},
		{
			id: 4,
			title:'Summertrain',
			avatar: '',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm5.mp3',
			lrcPaht: lrcUrl + 'm5.lrc'
		},
		{
			id: 5,
			title:'Take My Heart',
			avatar: '',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm6.m4a',
			lrcPaht: lrcUrl + 'm6.lrc'
		},
		{
			id: 6,
			title:'Waiting Outside The Lines',
			avatar: '',
			author: 'Greyson Chance',
			like: false,
			isDel: false,
			path: url + 'm7.m4a',
			lrcPaht: lrcUrl + 'm7.lrc'
		}

	];
	module.exports = songs;
});