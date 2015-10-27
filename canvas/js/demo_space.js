

(function( window ){
	var FRICTION = 0.9;// 模仿摩擦力，摩擦系数
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		canvasWidth = canvas.offsetWidth,
		canvasHeight = canvas.offsetHeight;


	// resize
	window.onresize = function(){
		resizeCanvas();
	};

	function resizeCanvas() {
		canvasWidth = document.body.offsetWidth;
		canvasHeight = document.body.offsetHeight;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		startAnimation = false;
	}

	resizeCanvas();

	// 控制暂停开关
	var start = document.getElementById('start_animation'),
		stop = document.getElementById('stop_animation'),
		startAnimation = false;
	start.onclick = function(){
		if ( startAnimation === true ) { return;}
		startAnimation = true;
		animate();
	};

	stop.onclick = function(){
		startAnimation = false;
	};

	// 小行星对象
	var Asteroid = function(x, y, radius, mass, vX, vY, aX, aY) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;

		this.vX = vX;
		this.vY = vY;

		// 加速度
		this.aX = aX;
		this.aY = aY;
	};

	var asteroids = [], x, y, radius, mass, vX, vY, aX, aY;

	for ( var i = 0; i < 17; i++ ) {
		// 设定 圆的中心距离 canvas 边的最小距离是 20 
		x = Math.floor( 20 + (Math.random() * (canvasWidth - 40)));
		y = Math.floor( 20 + (Math.random() * (canvasHeight - 40)));
		radius = Math.floor( 5 + Math.random() * 10); // 半径是 5-15
		mass = radius / 2; // 质量
		vX = Math.random() * 4 - 2; // 横向速度
		vY = Math.random() * 4 - 2; // 纵向速度
		aX = Math.random() * 0.2 - 0.1; // 横向加速度
		aY = Math.random() * 0.2 - 0.1; // 纵向加速度
		asteroids.push( new Asteroid(x, y, radius, mass, vX, vY, aX, aY));
	}
	
	function animate() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = 'rgb(255, 255, 255)';
		var asteroidsLength = asteroids.length,
			tmpAsteroid;

		var tmpAsteroidB, dX, dY, distance, angle, sine, cosine,
			x, y, xB, yB, vX, vY, vXb, vYb, vTotal;

		for ( var i = 0; i < asteroidsLength; i++ ) {
			tmpAsteroid = asteroids[i];

			// 碰撞检测
			for ( var j = i + 1; j < asteroidsLength; j++ ) {
				tmpAsteroidB = asteroids[j];
				dX = tmpAsteroidB.x - tmpAsteroid.x;
				dY = tmpAsteroidB.y - tmpAsteroid.y;
				distance = Math.sqrt((dX * dX) + (dY * dY));

				//发生碰撞，反弹
				if ( distance < tmpAsteroid.radius + tmpAsteroidB.radius ) {
					angle = Math.atan2(dY, dX);
					sine = Math.sin(angle);
					cosine = Math.cos(angle);
					// 旋转坐标
					x = 0;
					y = 0;

					xB = dX * cosine + dY * sine;
					yB = dY * cosine - dX * sine;

					vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;

					vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;

					// 因为动量守恒，不能单纯的反向改变速度
					// vX *= -1;
					// vXb *=-1;
					vTotal = vX -vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) /
							(tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;

					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);

					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);

					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);

					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;

					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;

				}
			}






			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI * 2, false);
			context.closePath();
			context.fill();

			// 边界碰撞检测 和反弹
			if ( tmpAsteroid.x - tmpAsteroid.radius  < 0 ) {
				tmpAsteroid.x = tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			} else if ( tmpAsteroid.x + tmpAsteroid.radius > canvasWidth ) {
				tmpAsteroid.x = canvasWidth - tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			} else {
				tmpAsteroid.x += tmpAsteroid.vX;
			}

			if ( tmpAsteroid.y - tmpAsteroid.radius  < 0 ) {
				tmpAsteroid.y = tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			} else if ( tmpAsteroid.y + tmpAsteroid.radius > canvasHeight ) {
				tmpAsteroid.y = canvasHeight - tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			} else {
				tmpAsteroid.y += tmpAsteroid.vY;
			}
			
			
			if ( Math.abs(tmpAsteroid.vX) < 10 ) {
				tmpAsteroid.vX += tmpAsteroid.aX;
			}

			if ( Math.abs(tmpAsteroid.vY) < 10 ) {
				tmpAsteroid.vY += tmpAsteroid.aY;
			}

			// 模仿摩擦力，直接在当前速度上添加摩擦系数
			/*if ( Math.abs(tmpAsteroid.vX) > 0.1 ) {
				tmpAsteroid.vX *= FRICTION;
			} else {
				tmpAsteroid.vX *= 0;
			}

			if ( Math.abs(tmpAsteroid.vY) > 0.1 ) {
				tmpAsteroid.vY *= FRICTION;
			} else {
				tmpAsteroid.vY *= 0;
			}*/
		}
		if ( startAnimation ) {
			setTimeout(animate, 33);
		}
	}

})( window );