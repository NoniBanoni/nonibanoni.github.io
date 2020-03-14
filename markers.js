class Marker {
  constructor(name, x, y) {
    this.name = name;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.r = width / 75;
    this.dragged = false;
  }

  display() {
    fill(...palate.yellow, 25);
    ellipse(this.pos.x * w - 1, this.pos.y * h - 3, this.r * 2);
    fill(palate.yellow);
    ellipse(this.pos.x * w, this.pos.y * h, this.r * 2);
    fill(palate.mainColor);
    textSize(1);
    textSize((this.r * 2 / textWidth(this.name.split(" ")[0])) / 1.25);
    text(this.name.split(" ")[0], this.pos.x * w, this.pos.y * h);
  }
  
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.9);

    if (mouse.pressed && this.pointOver(mouseX / w, mouseY / h) && this.name == user.Qt.Ad) {
      this.dragged = true;
    }

    if (this.dragged) {
      let mousePos = createVector(mouseX / w, mouseY / h);
      this.vel = p5.Vector.sub(mousePos, this.pos).div(3);
    }

    if (this.vel.mag() < 0.001) {
      let markerJSON = {
        "name": this.name,
        "x": this.pos.x,
        "y": this.pos.y
      };
      updateChild("markers/" + this.name, markerJSON);
    }

    if (this.dragged && mouse.released) {
      this.dragged = false;
    }
  }

  pointOver(x, y) {
    if (dist(this.pos.x * w, this.pos.y * h, x * w, y * h) >= this.r) {
      return false;
    }
    for (let i = markers.length - 1; i > markers.indexOf(this); i--) {
      if (dist(markers[i].pos.x * w, markers[i].pos.y * h, x * w, y * h) < markers[i].r) {
        return false;
      }
    }
    return true;
  }
}