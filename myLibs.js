function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
Vector.prototype = {
  negative: function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  add: function (v) {
    if (v instanceof Vector) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += v;
    }
    return this;
  },
  sub: function (v) {
    if (v instanceof Vector) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= v;
    }
    return this;
  },
  mult: function (v) {
    if (v instanceof Vector) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }
    return this;
  },
  div: function (v) {
    if (v instanceof Vector) {
      if (v.x != 0) this.x /= v.x;
      if (v.y != 0) this.y /= v.y;
    } else {
      if (v != 0) {
        this.x /= v;
        this.y /= v;
      }
    }
    return this;
  },
  dot: function (v) {
    return (this.x *= v.x) + (this.y *= v.y);
  },
  length: function () {
    return Math.sqrt(this.dot(this));
  },
  normalize: function () {
    const len = this.mag();
    if (len !== 0) this.mult(1 / len);
    return this;
    // return this.div(this.length());
  },
  min: function () {
    return Math.min(this.x, this.y);
  },
  max: function () {
    return Math.max(this.x, this.y);
  },
  set: function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
  clone: function () {
    return new Vector(this.x, this.y);
  },
  magSq: function () {
    const x = this.x;
    const y = this.y;
    return x * x + y * y;
  },
  limit: function (max) {
    const mSq = this.magSq();
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq)).mult(max);
    }
    return this;
  },
  mag: function () {
    return Math.sqrt(this.magSq());
  },
};

// Static Methods

Vector.negative = function (v) {
  return new Vector(-v.x, -v.y);
};
Vector.add = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
  else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
  else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
  else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
  else return new Vector(a.x / b, a.y / b);
};
Vector.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};
Vector.cross = function (a, b) {
  return a.x * b.y - a.y * b.x;
};
Vector.fromAnlge = function (theta, len) {
  if (typeof len === "undefined") len = 1;
  return new Vector(len * Math.cos(theta), len * Math.sin(theta), 0);
};
Vector.random2D = function () {
  return Vector.fromAnlge(Math.random() * Math.PI * 2);
};

// Random number generator
function random(min, max) {
  let rand = Math.random();
  if (typeof min === "undefined") {
    return rand;
  } else if (typeof max === "undefined") {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }
    return Math.random() * (max - min) + min;
  }
}

function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

function mapNum(n, start1, stop1, start2, stop2, withinBounds) {
  const newVal = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newVal;
  }
  if (start2 < stop2) {
    return constrain(newVal, start2, stop2);
  } else {
    return constrain(newVal, stop2, start2);
  }
}
function dist(...args) {
  if (args.length === 4) {
    // 2D
    return Math.hypot(args[2] - args[0], args[3] - args[1]);
  } else if (args.length === 6) {
    // 3D
    return Math.hypot(args[3] - args[0], args[4] - args[1], args[5] - args[2]);
  }
}

let mouseX = 0;
let mouseY = 0;
function mousePos(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// PERLIN NOISE //

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4;
let perlin_amp_falloff = 0.5;

const scaled_cosine = (i) => 0.5 * (1.0 - Math.cos(i * Math.PI));

let perlin;

function noise(x, y = 0, z = 0) {
  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);

  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;

    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
}
