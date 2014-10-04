Bullets = function(color)
{
	this.pool = new Array();
	for (var i = 0; i < 100; ++i)
		this.pool.push({ life:0 });
	this.color = color;
}

Bullets.prototype.Create = function(x, y, size, speed, life, angle)
{
	var news = null;
	for (var s, i = 0; (s = this.pool[i]) && s.life > 0; ++i)
		;
	if (s)
	{
		s.x = x;
		s.y = y;
		s.dx = Math.cos(angle); // Pre compute for use later.
		s.dy = Math.sin(angle);
		s.size = size;
		s.life = life;
		s.speed = speed;
		s.angle = angle;
	}
}

Bullets.prototype.Logic = function(elapsed)
{
	for (var s, i = 0; s = this.pool[i]; ++i)
	{
		if (s.life > 0)
		{
			s.life -= elapsed;
			s.x += s.dx*s.speed*elapsed;
			s.y += s.dy*s.speed*elapsed;
		}
	}
}

Bullets.prototype.Render = function(elapsed)
{
	ctx.save(); // Save the entire context because we'll be setting the transform.
	ctx.fillStyle = this.color;
	for (var s, i = 0; s = this.pool[i]; ++i)
	{
		if (s.life > 0)
		{
			// Set the translation and rotation matrix in one go
			ctx.setTransform(s.dx, s.dy, -s.dy, s.dx, s.x, s.y);
			ctx.fillRect(-s.size, -2, 2*s.size, 4);
		}
	}
	ctx.restore();
}

Bullets.prototype.Collide = function(x, y, size, callback)
{
	for (var s, i = 0; s = this.pool[i]; ++i)
	{
		if (s.life > 0)
		{
			// Simple circle/circle collision, good enough as long as bullets are not too elongated.
			var r2 = Pow2(size+s.size);
			var dx = x-s.x;
			var dy = y-s.y;
			if (dx*dx+dy*dy < r2)
			{
				if (!callback || !callback(s))
					return s;
			}
		}
	}
	return false;
}