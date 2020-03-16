class Room {
  constructor(rects, name) {
    this.rects = []; // Rects array
    this.max = createVector(0, 0); // Min x and y
    this.min = createVector(Infinity, Infinity); // Max x and y
    this.name = name; // Name of room
    this.center = createVector(0, 0); // Center point of the room
    this.border = 1.5;
    // Create all Rectangle objects
    for (let i = 0; i < rects.length; i++) {
      // Scale all room dimentions to fit the screen
      rects[i][0] = (rects[i][0] - this.border) * roomScale + ((width - 555 * roomScale) / 2);
      rects[i][1] = (rects[i][1] - this.border) * roomScale + ((height - 720 * roomScale) / 2);
      rects[i][2] = (rects[i][2] + (this.border * 2)) * roomScale;
      rects[i][3] = (rects[i][3] + (this.border * 2)) * roomScale;
      // Create Rectangle object with scaled dimentions
      this.rects[i] = {};
      this.rects[i].pos = createVector(rects[i][0], rects[i][1]);
      this.rects[i].w = rects[i][2];
      this.rects[i].h = rects[i][3];
      // Set min and max vectors
      this.max.x = Math.max(this.max.x, this.rects[i].pos.x + this.rects[i].w);
      this.max.y = Math.max(this.max.y, this.rects[i].pos.y + this.rects[i].h);
      this.min.x = Math.min(this.min.x, this.rects[i].pos.x);
      this.min.y = Math.min(this.min.y, this.rects[i].pos.y);
    }
    // Calculate center point based on the min and max dimentions
    this.center.x = (this.max.x - this.min.x) / 2 + this.min.x;
    this.center.y = (this.max.y - this.min.y) / 2 + this.min.y;
    for (let i = 0; i < rects.length; i++) {
      if (this.pointOver(this.rects[i], this.center.x, this.center.y)) { // If a rectangle is on the center point
        // Change the center x so that the text will fit properly
        this.center.x = this.rects[i].pos.x + this.rects[i].w / 2;
        this.centerRect = i;
        break;
      }
    }
  }

  display() {
    noStroke();
    fill(palate.borderColor);
    for (let i = 0; i < this.rects.length; i++) {
      rect(
        this.rects[i].pos.x - ((5 - this.border * 2) * roomScale),
        this.rects[i].pos.y - ((5 - this.border * 2) * roomScale),
        this.rects[i].w + ((5 - this.border * 2) * 2 * roomScale),
        this.rects[i].h + ((5 - this.border * 2) * 2 * roomScale));
    }
    for (let i = 0; i < this.rects.length; i++) {
      noStroke();
      fill(...palate.mainColor)
      rect(this.rects[i].pos.x, this.rects[i].pos.y, this.rects[i].w, this.rects[i].h);
    }
    fill(palate.subColor);
    textFont(files.fonts.blackItalic);
    textAlign(CENTER, CENTER);
    textSize(1);
    textSize(constrain((this.rects[this.centerRect].w / textWidth(this.name.toUpperCase())) / 1.25, 0, 15));
    text(this.name.toUpperCase(), this.center.x, this.center.y);
  }

  pointOver(rect, x, y) {
    return x >= rect.pos.x && y >= rect.pos.y && x <= rect.pos.x + rect.w && y <= rect.pos.y + rect.h;
  }
}