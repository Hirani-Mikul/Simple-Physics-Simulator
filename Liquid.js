let Liquid = function (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.c = c;
  };
  Liquid.prototype.display = function () {
      ctx.beginPath();
    ctx.fillStyle = "rgba(0, 150, 237)";
    // ctx.fillStyle = "rgba(0, 100, 100)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
  };
  Liquid.prototype.contains = function (m) {
    let mp = m.pos; // Mover Position
    let mMass = (m.mass * m.scale) / 2; // Mover radius interms of mass
    return (
      mp.y + mMass > this.y &&
      mp.y - mMass < this.y + this.height &&
      mp.x + mMass > this.x &&
      mp.x - mMass < this.x + this.width
    );
  };
  Liquid.prototype.calculateDragForce = function (m) {
    let speed = m.vel.mag();
    let dragMagnitude = speed * speed * this.c;
  
    let dragForce = m.vel.clone();
    dragForce.normalize();
    dragForce.mult(-dragMagnitude);
  
    return dragForce;
  };