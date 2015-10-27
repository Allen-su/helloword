(function(){
	var $ = function(str){
		return document.getElementById(str);
	};

	var canvas = $('game_canvas'),
		context = canvas.getContext('2d'),
		canvasWidth = canvas.width,
		canvasHeight = canvas.height;

	var ui = $('game_ui'),
		uiIntro = $('game_intro'),
		uiStarts = $('game_starts'),
		uiComplete = $('game_complete'),
		uiPlay = $('game_play'),
		uiReset = document.querySelectorAll('.game_reset'),
		uiRemaining = $('game_remaining'),
		uiScore = document.querySelectorAll('.game_score');

	var playGame;

	// 创建小行星圆形平台所需要的变量
	var platformX,
		platformY,
		platformOuterRadius,
		platformInnerRadius;

	// 包含所有的小行星
	var asteroids = [];
	var deadAsteroids = []; // 存储已经被弹出平台的小行星
	var outerRing, // 外圈上小行星的数目
		ringCount, // 圈数
		ringSpacing; // 每个圈之间的距离
	var Asteroid = function(x, y, radius, mass, firction) { //firction 摩擦力
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		this.firction = firction;

		this.vX = 0;
		this.vY = 0;
		this.player = false; //是否是玩家所使用的小行星
	};

	// 玩家控制的小行星所需的变量
	var player,
		playerOriginalX,
		playerOriginalY,
		pRadius = 15,
		pMass = 10,
		pFriction = 0.97;


	// 添加玩家事件交互所需要的变量 ----------------------------------------------------------
	var playerSelected, // 确定玩家当前的小行星是否被选中
		playerMaxAbsVelocity, // 限制玩家使用的最快速度
		playerVelocityDampener, // 用于微调速度计算，用于存储玩家使用小行星的速度
		powerX, // 在 X 轴方向上使用的力度
		powerY; // 在 Y 轴方向上使用的力度


	// 分数
	var score;


	function startGame() {
		// 初始化游戏设置
		playGame = false;
		score = 0;
		uiScore[0].innerHTML = 0;
		uiScore[1].innerHTML = 0;
		uiStarts.style.display = 'block';

		// 获取创建小行星圆形平台的所需的数据
		platformX = canvasWidth / 2;
		platformY = 150;
		platformOuterRadius = 100;
		platformInnerRadius = 75;
		
		asteroids = [];
		outerRing = 8; // 外圈上小行星的数目
		ringCount = 3; // 圈数
		ringSpacing = (platformInnerRadius / (ringCount - 1 )); // 每个圈之间的距离
		var currentRing, angle, ringRadius, starX, starY;
		for ( var r = 0; r < ringCount; r++ ) {
			currentRing = 0; // 小行星的数量
			angle = 0;
			ringRadius = 0;
			// 这是最里面的圈吗
			if ( r == ringCount - 1 ) {
				currentRing = 1; //最里面的圈，即只有一个中心点
			} else {
				currentRing = outerRing - ( r * 3 ); // 最外层的小行星数, 减去 3 乘以当前的循环数
				angle = 360 / currentRing; // 计算每颗小行星所占的角度
				ringRadius = platformInnerRadius - ( ringSpacing * r ); //计算每圈的半径

				for ( var a = 0; a < currentRing; a++ ) {
					starX = 0;
					starY = 0;
					if ( r == ringCount - 1 ) {
						starX = platformX;
						starY = platformY;
					} else {
						starX = platformX + (ringRadius * Math.cos((angle * a) * Math.PI / 180));
						starY = platformY + (ringRadius * Math.sin((angle * a) * Math.PI / 180));
					}
					asteroids.push( new Asteroid(starX, starY, 10, 5, 0.95));
				}
			}
		}

		pRadius = 15;
		pMass = 10;
		pFriction = 0.97;
		playerOriginalX = canvasWidth / 2;
		playerOriginalY = canvasHeight - 150;
		player = new Asteroid(playerOriginalX, playerOriginalY, pRadius, pMass, pFriction);
		player.player = true;
		asteroids.push(player);

		playerSelected = false; // 确定玩家当前的小行星是否被选中
		playerMaxAbsVelocity = 30; // 限制玩家使用的最快速度
		playerVelocityDampener = 0.3; // 用于微调速度计算，存储玩家使用小行星的速度
		powerX = -1; // 在 X 轴方向上使用的力度
		powerY = -1; // 在 Y 轴方向上使用的力度

		uiRemaining.innerHTML = asteroids.length - 1;
		// 开始动画循环
		animate();
		playerInteraction();
	}

	// 动画循环
	function animate() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		// 创建小行星圆形平台
		context.fillStyle = 'rgb(100, 100, 100)';
		context.beginPath();
		context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();

		context.fillStyle = 'rgb(255, 255, 255)';

		var asteroidsLength = asteroids.length, tmpAsteroid, tmpAsteroidB;

		// 这里是碰撞检测等需要的变量
		var dX, dY, distance, angle, sine, cosine, x, y, xB, yB, vX, vY, vXb, vYb, vTotal;

		var dXp, dYp, distanceP;  // 用于判断小行星是否被弹出平台外的变量

		for ( var i = 0; i < asteroidsLength; i++ ) {
			tmpAsteroid = asteroids[i];
			for ( var j = i + 1; j < asteroidsLength; j++ ) {
				tmpAsteroidB = asteroids[j];
				// 碰撞检测
				dX = tmpAsteroidB.x - tmpAsteroid.x;
				dY = tmpAsteroidB.y - tmpAsteroid.y;
				distance = Math.sqrt(dX * dX + dY * dY);
				if ( distance < tmpAsteroid.radius + tmpAsteroidB.radius ) {// 碰撞
					angle = Math.atan2(dY, dX);
					sine = Math.sin(angle);
					cosine = Math.cos(angle);

					// 旋转小行星的位置
					x = 0;
					y = 0;

					// 旋转小行星 B 的位置
					xB = dX * cosine + dY * sine;
					yB = dY * cosine - dX * sine;

					// 旋转小行星的位置
					vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;

					// 旋转小行星 B 的速度
					vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;

					// 保持动量
					vTotal = vX -vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) /
							(tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;

					// 将小行星分开
					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);

					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);

					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);

					// 转回小行星的速度
					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;

					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;
				}
			}
			// 计算新位置
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;

			// 摩擦力
			if ( Math.abs(tmpAsteroid.vX) > 0.1 ) {
				tmpAsteroid.vX *= tmpAsteroid.firction;
			} else {
				tmpAsteroid.vX *= 0;
			}

			if ( Math.abs(tmpAsteroid.vY) > 0.1 ) {
				tmpAsteroid.vY *= tmpAsteroid.firction;
			} else {
				tmpAsteroid.vY *= 0;
			}

			// 判断小行星是否被弹出平台
			if ( !tmpAsteroid.player ) {
				dXp = tmpAsteroid.x - platformX;
				dYp = tmpAsteroid.y - platformY;
				distanceP = Math.sqrt((dXp * dXp) + (dYp * dYp));
				if ( distanceP > platformOuterRadius ) {
					if ( tmpAsteroid.radius > 0 ) {
						tmpAsteroid.radius -= 2; //使被弹出的小球慢慢消失
					} else {
						deadAsteroids.push(tmpAsteroid);
					}
				}
			}

			// 绘制所有的小行星
			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();

			dragAsteroid();
			checkResetPlayer();
		}

		var deadAsteroidsLength = deadAsteroids.length, remaining = asteroids.length - 1;
		uiRemaining.innerHTML = remaining;
		if ( deadAsteroidsLength > 0 ) {
			for ( var di = 0; di < deadAsteroidsLength; di++ ) {
				// 在这里删除 asteroids 中的小行星，否则在循环中删除，会导致循环次数减少
				asteroids.splice(asteroids.indexOf(deadAsteroids[di]), 1);
			}
			deadAsteroids = [];
		}

		if ( remaining === 0 ) {
			//获胜
			playGame = false;
			uiStarts.style.display = 'none';
			uiComplete.style.display = 'block';
			context.clearRect(0, 0, canvasWidth, canvasHeight);
			window.removeEventListener('mousedown', bindMouseDown, false);
			window.removeEventListener('mouseup', bindMouseUp, false);
			window.removeEventListener('mousemove', bindMouseMove, false);
		}

		if ( playGame ) {
			setTimeout(animate, 33);
		}
	}

	// 在拖动小行星的时候，显示力量的线
	function dragAsteroid() {
		if ( playerSelected ) {
			context.strokeStyle = 'rgb(255, 255, 255)';
			context.lineWidth = 3;
			context.beginPath();
			context.moveTo(player.x, player.y);
			context.lineTo(powerX, powerY);
			context.closePath();
			context.stroke();
		}
	}

	function checkResetPlayer() {
		if ( player.x != playerOriginalX && player.y != playerOriginalY ) {
			if ( player.vX === 0 && player.vY === 0 ) {
				resetPlayer();
			} else if ( player.x + player.radius < 0 || player.x - player.radius > canvasWidth) {
				resetPlayer();
			} else if ( player.y + player.radius < 0 || player.y - player.radius > canvasHeight) {
				resetPlayer();
			}
		}
	}

	function resetPlayer() {
		player.x = playerOriginalX;
		player.y = playerOriginalY;
		player.vX = 0;
		player.vY = 0;
	}

	// 初始化游戏环境
	function init() {
		uiStarts.style.display = 'none';
		uiComplete.style.display = 'none';
		uiPlay.onclick = function(e) {
			e.preventDefault();
			uiIntro.style.display = 'none';
			startGame();
		};

		uiReset[0].onclick = uiReset[1].onclick = function(e) {
			e.preventDefault();
			uiComplete.style.display = 'none';
			startGame();
		};
	}

	init();


	// 玩家交互事件
	function playerInteraction() {
		window.addEventListener('mousedown', bindMouseDown, false);

		window.addEventListener('mouseup', bindMouseUp, false);

		window.addEventListener('mousemove', bindMouseMove, false);
	}

	function bindMouseDown(e) {
		if ( !playerSelected && player.x == playerOriginalX && player.y == playerOriginalY ) {
			var canvasOffset = offset(canvas);
			var canvasX = Math.floor(e.pageX - canvasOffset.left);
			var canvasY = Math.floor(e.pageY - canvasOffset.top);

			if ( !playGame ) {
				playGame = true;
				animate();
			}
			var dX = player.x - canvasX;
			var dY = player.y - canvasY;
			var distance = Math.sqrt((dX * dX) + (dY * dY));
			var padding = 5;
			if ( distance < player.radius + padding ) { // 防止投掷后再次投掷
				powerX = player.x;
				powerY = player.y;
				playerSelected = true;
			}
		}
	}

	function bindMouseMove(e) {
		if ( playerSelected ) {
			var canvasOffset = offset(canvas);
			// 得到 鼠标在当前canvas中的 坐标
			var canvasX = Math.floor(e.pageX - canvasOffset.left);
			var canvasY = Math.floor(e.pageY - canvasOffset.top);

			var dX = canvasX - player.x; // 获取小球圆心在 x 轴上移动的距离
			var dY = canvasY - player.y; // 获取小球圆心在 y 轴上移动的距离
			var distance = Math.sqrt((dX * dX) + (dY * dY)); // 获取小球中心移动的距离
			// 将距离转换为速度，来确定力量的大小
			if ( distance * playerVelocityDampener < playerMaxAbsVelocity ) {
				// 距离乘以速度系数后如果小于最大速度，力量直接等于当前鼠标的位置
				powerX = canvasX;
				powerY = canvasY;
			} else {
				// 距离乘以速度系数后如果大于最大速度
				var ratio = playerMaxAbsVelocity / ( distance * playerVelocityDampener );
				// player.x + dX = canvasX，所以这里肯定比 canvasX 小
				powerX = player.x + (dX * ratio);
				powerY = player.y + (dY * ratio);
			}
		}
	}

	function bindMouseUp(e) {
		if ( playerSelected ) {
			// 获取力量移动的距离
			var dX = powerX - player.x;
			var dY = powerY - player.y;
			// 力量转化为速度
			player.vX = -(dX * playerVelocityDampener);
			player.vY = -(dY * playerVelocityDampener);
		}
		playerSelected = false;
		powerX = -1;
		powerY = -1;

		uiScore[0].innerHTML = ++score;
		uiScore[1].innerHTML = score;
	}

})();


// tools -----------------------------------------------------------

function offset( el ) {
	var elOffset = {left: 0, top: 0};

	while( el && el.offsetLeft != null && el.offsetTop != null ) {
		elOffset.left += el.offsetLeft;
		elOffset.top += el.offsetTop;
		el = el.parentElement;
	}
	return elOffset;
}
