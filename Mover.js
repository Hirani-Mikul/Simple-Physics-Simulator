function Mover (x, y, m, col)
{
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.mass = m;
    this.scale = 5;
    this.col = col;
}

Mover.prototype.update = function () {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
};
Mover.prototype.applyForce = function (force) {
    var f = Vector.divide(force, this.mass);
    this.acc.add(f);
};
Mover.prototype.display = function () {
  ctx.beginPath();
  ctx.fillStyle = `rgba(${this.col.r}, ${this.col.g}, ${this.col.b})`;
  
  ctx.arc(this.pos.x, this.pos.y, this.mass * this.scale, 0, Math.PI * 2);

  ctx.fill();
};
Mover.prototype.checkWalls = function () {
    let extra = this.mass * this.scale;
  
    if (this.pos.x + extra > width) {
    this.pos.x = width - extra;
    this.vel.x *= -1;
  } else if (this.pos.x - extra< 0) {
    this.pos.x = 0 + extra;
    this.vel.x *= -1;
  }
  if (this.pos.y + extra > height) {
    this.pos.y = height - extra;
    this.vel.y *= -1;
  } else if (this.pos.y - extra < 0) {
    this.pos.y = 0 + extra;
    this.vel.y *= -1;
  }
};