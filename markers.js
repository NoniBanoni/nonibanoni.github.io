class Marker {
  constructor(name, x, y) {
    this.name = name;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.r = w / 75;
    this.dragged = false;
    this.loc = "blank";
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

    if (this.pos.x <= 0 || this.pos.x >= 1 || this.pos.y <= 0 || this.pos.y >= 1) {
      this.pos.x = Math.random(0.1,0.9);
      this.pos.y = Math.random(0.1,0.9);
      this.dragged = false;
    }

    if (this.name == user.Qt.Ad) {
      let markerJSON = {
        "name": this.name,
        "x": this.pos.x,
        "y": this.pos.y,
        "xVel": this.vel.x,
        "yVel": this.vel.y
      };
      updateChild("markers/" + this.name, markerJSON);
    }

    if (this.dragged && mouse.released) {
      this.dragged = false;
      for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[i].rects.length; j++) {
          let temp = rooms[i].rects[j];
          if (this.pos.x >= temp.pos.x / w && this.pos.y >= temp.pos.y / h && this.pos.x <= (temp.pos.x + temp.w) / w && this.pos.y <= (temp.pos.y + temp.h) / h) {
            this.loc = rooms[i].name;
            return;
          }
        }
      }
    }

    if (this.name == user.Qt.Ad && !this.dragged) {
      for (let i = 0; i < markers.length; i++) {
        if (dist(markers[i].pos.x * w, markers[i].pos.y * h, this.pos.x * w, this.pos.y * h) < this.r * 2 && markers[i].name !== this.name) {
          let scaledPos = createVector(this.pos.x * w, this.pos.y * h);
          let scaledPos2 = createVector(markers[i].pos.x * w, markers[i].pos.y * h);
          let v = p5.Vector.sub(scaledPos2, scaledPos);
          let v2 = v.setMag(v.mag() - this.r * 2);
          this.vel.add(createVector(v2.x / w, v2.y / h));
        }
      }
      if (this.loc != "blank") {
        for (let i = 0; i < rooms.length; i++) {
          if (rooms[i].name == this.loc) {
            for (let j = 0; j < rooms[i].rects.length; j++) {
              let temp = rooms[i].rects[j];
              if (this.pos.x >= temp.pos.x / w && this.pos.y >= temp.pos.y / h && this.pos.x <= (temp.pos.x + temp.w) / w && this.pos.y <= (temp.pos.y + temp.h) / h) {
                return;
              }
            }
            this.vel.add(p5.Vector.sub(createVector(rooms[i].center.x / w, rooms[i].center.y / h), this.pos).div(25));
            return;
          }
        }
      }
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