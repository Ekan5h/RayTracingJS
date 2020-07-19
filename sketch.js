class sphere {
  constructor(radius, center, color) {
    this.radius = radius;
    this.center = center;
    this.color = color;
    this.e = 0.85;
    this.r = 0.15;
    this.t = 0;
  }

  intersect(start, dir) {
    let r1 = dir.copy();
    let r2 = this.center.copy().sub(start);
    let d = r1.dot(r2) / r1.mag();
    r1 = r1.mult(d);
    d -= sqrt(this.radius ** 2 + d ** 2 - r2.mag() ** 2);

    if (d >= 0) return true;
    return false;
  }

  getPoint(start, dir) {
    let r1 = dir.copy();
    let r2 = this.center.copy().sub(start);
    let d = r1.dot(r2) / r1.mag();
    r1 = r1.mult(d);
    d -= sqrt(this.radius ** 2 + d ** 2 - r2.mag() ** 2);
    let p = start.copy().add(dir.mult(d));
    let nor = p.copy().sub(this.center);
    nor.normalize();
    return [p, nor];
  }
}

class floor {
  constructor() {
    this.color = createVector(200, 200, 200);
    this.e = 0.6;
    this.r = 0.4;
    this.t = 0;
  }

  intersect(start, dir) {
    if (dir.z < 0) return true;
    return false;
  }

  getPoint(start, dir) {
    let lambda = -1 * start.z / dir.z;
    let p = start.copy().add(dir.copy().mult(lambda));
    return [p, createVector(0, 0, 1)];
  }
}

let eye, screen, lig, objects, intensity = 250000000;

function setup() {
  can = createCanvas(800,600);
  can.parent("can")
  eye = createVector(0, 0, 50);
  screen = [createVector(-50, 80, 50+37.5), createVector(50, 80, 50+37.5), createVector(50, 80, 50-37.5), createVector(-50, 80, 50-37.5)];
  lig = [createVector(800, -600, 1200), createVector(-800, -600, 1200)];
  objects = [];
  objects.push(new sphere(30, createVector(-65, 150, 31), createVector(61, 135, 255)));
  objects.push(new sphere(30, createVector(10, 180, 31), createVector(255, 69, 69)));
  // objects.push(new sphere(30, createVector(31, 232, 31), createVector(147, 250, 62)));
  objects.push(new sphere(30, createVector(90, 215, 31), createVector(147, 250, 62)));
  objects.push(new floor());
  loadPixels();
  pixelDensity(1);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      dir = screen[0].copy().add(screen[1].copy().sub(screen[0]).mult(j / width)).add(screen[3].copy().sub(screen[0]).mult(i / height)).sub(eye);
      dir.normalize();
      temp = weight(eye, dir, 0);
      pixels[4 * (width * i + j)] = temp.x;
      pixels[4 * (width * i + j) + 1] = temp.y;
      pixels[4 * (width * i + j) + 2] = temp.z;
      pixels[4 * (width * i + j) + 3] = 255;
    }
  }
  updatePixels();
}

function weight(start, dir, level) {
  let np, d = Infinity,
    j = -1;
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].intersect(start.copy(), dir.copy())) {
      p = objects[i].getPoint(start.copy(), dir.copy());
      if (p[0].copy().sub(start).mag() < d) {
        d = p[0].copy().sub(start).mag();
        np = p;
        j = i;
      }
    }
  }
  if (j >= 0) {
    let lit = 0,
      lit1 = 0;
    for (let i = 0; i < lig.length; i++) {
      let dire = lig[i].copy().sub(np[0]).normalize();
      flag = 0;
      for (let k = 0; k < objects.length; k++) {
        if (objects[k].intersect(np[0].copy().add(dire), dire.copy())) {
          flag++;
          break;
        }
      }
      x = lig[i].copy().sub(np[0]).angleBetween(np[1]);
      lit1 += min(0.07 / abs(x), 1);
      if (flag == 0) {
        // sigma = 0.005;
        // lit1 += exp(-1*x**2/(2*sigma))/(15*sigma*sqrt(2*PI));
        lit += intensity / (lig[i].copy().sub(np[0]).mag() ** 2);
      }
    }
    lit = max(lit, 120);
    if (objects[j].r == 0 || level == 3)
      return objects[j].color.copy().sub(createVector(255, 255, 255)).add(createVector(1, 1, 1).mult(lit)).mult(objects[j].e).add(createVector(255, 255, 255).mult(lit1));
    else
      return objects[j].color.copy().sub(createVector(255, 255, 255)).add(createVector(1, 1, 1).mult(lit)).mult(objects[j].e).add(weight(np[0], dir.copy().reflect(np[1]), level + 1).copy().mult(objects[j].r)).add(createVector(255, 255, 255).mult(lit1));
  } else {
    return createVector(100, 100, 100);
  }
}

p5.Vector.prototype.reflect = function reflect(surfaceNormal) {

  surfaceNormal.normalize();

  return this.sub(surfaceNormal.mult(2 * this.dot(surfaceNormal))).normalize();

};

function draw() {

}
