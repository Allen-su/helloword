define(function(require, exports, module){

	var url = 'sound/';
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
			path: url + 'm2.mp3'
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
			title:'一直下雨的星期天',
			avatar: '',
			author: '赵薇',
			like: false,
			isDel: false,
			path: url + 'm4.mp3'
		},
		{
			id: 4,
			title:'醉清风',
			avatar: '',
			author: '弦子',
			like: false,
			isDel: false,
			path: url + 'm5.mp3'
		},

	];
	module.exports = songs;
});