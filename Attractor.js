let Attractor = function (x, y, m, g) {
    this.pos = new Vector(x, y);
    this.mass = m;
    this.G = g; // Gravitational attraction between two bodies strength.
  };
  Attractor.prototype.display = function () {

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 0)";
    ctx.arc(this.pos.x, this.pos.y, this.mass * 10, 0, Math.PI * 2);
    ctx.fill();
  };
  
  Attractor.prototype.attract = function (mover) {
    let force = Vector.subtract(this.pos, mover.pos);
    let distance = force.mag();
    distance = constrain(distance, 5, 25);
    force.normalize();
    let strength = (this.G * this.mass * mover.mass) / (distance * distance);
    force.mult(strength);
    return force;
  };
  