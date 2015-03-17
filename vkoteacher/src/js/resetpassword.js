(function(){
	var allProcess = $('.login_form');
	step = {
		currStep : 0,
		currBox : allProcess.eq(0),
		increaseStep : function(){
			this.currBox = allProcess.eq(++this.currStep);
		},
		reduceStep : function(){
			this.currBox = allProcess.eq(--this.currStep);
		}
	};

	//下一步事件监听
	$('.login_btn').bind('click', function(event) {
		switch( step.currStep ){
			case 0 :
				var num = step.currBox.find('#phone').val().trim();
				if ( !num ) {
					step.currBox.find('.error_tip').html('请输入手机号码').css('visibility','visible');
					return;
				} else if ( !/^\d{11}$/.test(num) ) {
					step.currBox.find('.error_tip').html('请输入正确的手机号码').css('visibility','visible');
					return;
				}
				getCaptcha(num);
				break;
			case 1 :
				var code = step.currBox.find('#captcha').val().trim();
				if ( !code || !Number(code) ) {
					step.currBox.find('.error_tip').html('验证码错误').css('visibility','visible');
					return;
				}
				captchaCheck(code);
				break;
			case 2 :
				var password = step.currBox.find('#new_password').val().trim();
				if ( !/^[a-z0-9]{6,20}$/.test(password) ) {
					step.currBox.find('.error_tip').html('密码最少6位，英文或数字组成').css('visibility','visible');
					return;
				}
				setPassword(password);
				break;
		}
	});

	//后退按钮监听
	$('.title_left').bind('click', function(event) {
		step.currBox.find('input').eq(0).val('');
		step.currBox.find('.error_tip').css('visibility','hidden');
		for ( var i = 0; i < 3; i++ ) {
			if ( step.currStep - 1 == i ) {
				allProcess[i].style.display = 'block';
			} else if (step.currStep - 1 < 0) {
				turnToLogin();
			}else {
				allProcess[i].style.display = 'none';
			}
		}
		step.reduceStep();
	});

	//获取验证码倒计时按钮监听
	$('.send_num').bind('click', countDown);

	//获取验证码
	function getCaptcha( number ){
		allProcess[0].style.display = 'none';
		allProcess[1].style.display = 'block';
		step.increaseStep();
		countDown(number);
	}


/** ajax *************************************************************************/
	//验证验证码
	function captchaCheck( code ) {
		/*$.ajax({
			url: '',
			type: 'get',
			dataType: 'json',
			success: function(data){
				if ( data.code == 1 ) {
					allProcess[1].style.display = 'none';
					allProcess[2].style.display = 'block';
					step.increaseStep();
				} else {
					step.currBox.find('.error_tip').html(data.msg).css('visibility','visible');
				}
				
			}
		});*/
		
		allProcess[1].style.display = 'none';
		allProcess[2].style.display = 'block';
		step.increaseStep();
	}

	//获取手机验证码
	function countDown(number){
		countDown.number = number || countDown.number;
		if ( countDown.timeId ){
			return false;
		}
		/*$.ajax({
			url: '',
			type: 'get',
			dataType: 'json',
			success: function(data){
				if ( data.code == 1 ) {
				}
			}
		});*/
		//TODO:检查网络
		var container = step.currBox.find('.send_num'), count = 60;
		container.html(count + '秒后重新发送');
		countDown.timeId = setInterval(function(){
			container.html(--count + '秒后重新发送');
			if ( count === 0 ) {
				container.html('获取验证码');
				clearInterval(countDown.timeId);
				delete countDown.timeId;
				return;
			}
		},1000);
	}

	//设置新密码
	function setPassword( password ){
		/*$.ajax({
			url: '',
			type: 'get',
			dataType: 'json',
			success: function(data){
				if ( data.code == 1 ) {
					alert('set successful');
					turnToLogin();
				} else {
					step.currBox.find('.error_tip').html(data.msg).css('visibility','visible');
				}
			}
		});*/
		alert('set successful');
		turnToLogin();
	}

	//跳转登陆页
	function turnToLogin(){
		location.href = '../html/login.html';
	}
})();