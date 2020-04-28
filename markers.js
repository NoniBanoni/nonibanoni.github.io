class Marker {
  constructor(name, x, y) {
    this.name = name;
    this.pos = createVector(x, y);
    this.prevPos = this.pos;
    this.vel = createVector(0, 0);
    this.r = w / 75;
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
    if (this.name == user.Pt.Ad) {
      let markerJSON = {
        "name": this.name,
        "x": this.pos.x,
        "y": this.pos.y
      };
      updateChild("markers/" + this.name, markerJSON);
    } else {
      return;
    }
    
    if (this.vel.mag() > 0.05) {
      this.vel.setMag(0.05);
    }

    this.prevPos = createVector(this.pos.x, this.pos.y);
    this.pos.add(this.vel);
    this.vel.mult(0.98);

    if (mouse.pressed && this.pointOver(mouseX / w, mouseY / h) && this.name == user.Pt.Ad) {
      this.dragged = true;
    }

    if (this.dragged) {
      let mousePos = createVector(mouseX / w, mouseY / h);
      this.vel = p5.Vector.sub(mousePos, this.pos).div(3);
    }

    this.pos.x = ((this.pos.x % 1) + 1) % 1;
    this.pos.y = ((this.pos.y % 1) + 1) % 1;

    if (this.dragged && mouse.released) {
      this.dragged = false;
        for (let i = 0; i < rooms.length; i++) {
          for (let j = 0; j < rooms[i].rects.length; j++) {
            let temp = rooms[i].rects[j];
            if (this.pos.x >= temp.pos.x / w && this.pos.y >= temp.pos.y / h && this.pos.x <= (temp.pos.x + temp.w) / w && this.pos.y <= (temp.pos.y + temp.h) / h) {
              this.loc = rooms[i].name;
              let count = 0;
              for (let i = 0; i<markers.length; i++){
                if (markers[i].loc == this.loc){
                  count = count + 1
                }
              }   
              return;
            }
          }
        }
      this.loc = "blank";
    }

    if (this.name == user.Pt.Ad && !this.dragged) {
      bigLoop:
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].name == this.loc) {
          for (let j = 0; j < rooms[i].rects.length; j++) {
            let r = {
              "x": rooms[i].rects[j].pos.x / w,
              "y": rooms[i].rects[j].pos.y / h,
              "w": rooms[i].rects[j].w / w,
              "h": rooms[i].rects[j].h / h
            };
            if (this.pos.x >= r.x && this.pos.y >= r.y && this.pos.x <= r.x + r.w && this.pos.y <= r.y + r.h) {
              break bigLoop;
            }
          }
          for (let j = 0; j < rooms[i].rects.length; j++) {
            let r = {
              "x": rooms[i].rects[j].pos.x / w,
              "y": rooms[i].rects[j].pos.y / h,
              "w": rooms[i].rects[j].w / w,
              "h": rooms[i].rects[j].h / h
            };
            if (this.prevPos.x >= r.x && this.prevPos.y >= r.y && this.prevPos.x <= r.x + r.w && this.prevPos.y <= r.y + r.h) {
              if (intersects(r.x, r.y, r.x + r.w, r.y, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)) {
                this.pos = createVector(...intersectPoint(r.x, r.y, r.x + r.w, r.y, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y));
                this.vel.y *= -1;
                shake += this.vel.mag();
                break bigLoop;
              }
              if (intersects(r.x + r.w, r.y, r.x + r.w, r.y + r.h, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)) {
                this.pos = createVector(...intersectPoint(r.x + r.w, r.y, r.x + r.w, r.y + r.h, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y));
                this.vel.x *= -1;
                shake += this.vel.mag();
                break bigLoop;
              }
              if (intersects(r.x, r.y, r.x, r.y + r.h, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)) {
                this.pos = createVector(...intersectPoint(r.x, r.y, r.x, r.y + r.h, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y));
                this.vel.x *= -1;
                shake += this.vel.mag();
                break bigLoop;
              }
              if (intersects(r.x, r.y + r.h, r.x + r.w, r.y + r.h, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)) {
                this.pos = createVector(...intersectPoint(r.x, r.y + r.h, r.x + r.w, r.y + r.h, this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y));
                this.vel.y *= -1;
                shake += this.vel.mag();
                break bigLoop;
              }
            }
          }
        }
      }
    }
    if (this.name == user.Pt.Ad) {
      for (let i = 0; i < markers.length; i++) {
        if (this.name != markers[i].name && dist(markers[i].pos.x * w, markers[i].pos.y * h, this.pos.x * w, this.pos.y * h) < this.r * 2) {
          let v = p5.Vector.sub(createVector(markers[i].pos.x * w, markers[i].pos.y * h), createVector(this.pos.x * w, this.pos.y * h));
          v.setMag((v.mag() - this.r * 2) - 1);
          v.x /= w;
          v.y /= h;
          this.pos.add(v);
          if (this.vel.mag() > 0.05) {
            shake += 0.05;
          } else {
            shake += this.vel.mag();
          }
          if (!this.dragged) {

            let theta1 = this.vel.heading();
            let theta2 = markers[i].vel.heading();
            let phi = Math.atan2(markers[i].pos.y - this.pos.y, markers[i].pos.x - this.pos.x);
            let m1 = 0;
            let m2 = 1;
            let v1 = this.vel.mag();
            let v2 = 0;
            
            let dx1F = (v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
            let dy1F = (v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
            let dx2F = (v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
            let dy2F = (v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);
            
            this.vel.x = dx1F;
            this.vel.y = dy1F;
            // ob2.dx = dx2F;
            // ob2.dy = dy2F;
          }
        }
      }
    }
  }

  pointOver(x, y) {
    return dist(this.pos.x * w, this.pos.y * h, x * w, y * h) < this.r;
  }
}

function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

function intersectPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}
	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
	if (denominator === 0) {
		return false
	}
	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)
	return [x, y]
}