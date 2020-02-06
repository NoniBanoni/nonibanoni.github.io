// Core Variables
let assets = [];
let database = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
let keys = [];
let fonts = [];
let mouse = {
  "pressed": false,
  "held": false,
  "released": false
};

// Other Variables
let scale = 1.5;
let rooms = [];
let markers = [];
let dataFetched = false;

// Loading Assets
function preload() {
  assets[0] = loadImage("assets/Floor Plan.jpg");
  assets[1] = loadImage("assets/Floor Plan Simple.jpg");
  fonts[0] = loadFont("assets/fonts/Montserrat-BlackItalic.ttf");
}

// Create the canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 6; i++) {
    markers.push(new Marker("logan", random(0, 400), random(0, 400)));
  }
}

// Called when the database loads
function databaseLoaded() {
  for (let i = 0; i < Object.keys(database.rooms).length - 1; i++) {
    let key = Object.keys(database.rooms)[i];
    rooms.push(new Room(database.rooms[key].rects, key));
  }
}

// Room class
class Room {
  constructor(rects, name) {
    this.rects = [];
    this.maxX = 0;
    this.maxY = 0;
    this.minX = Infinity;
    this.minY = Infinity;
    this.name = name;
    for (let i = 0; i < rects.length; i++) {
      this.rects[i] = new Rectangle(...rects[i]);
      this.maxX = Math.max(this.maxX, rects[i][0] + rects[i][2]);
      this.maxY = Math.max(this.maxY, rects[i][1] + rects[i][3]);
      this.minX = Math.min(this.minX, rects[i][0]);
      this.minY = Math.min(this.minY, rects[i][1]);
    }
    this.center = [(this.maxX - this.minX) / 2 + this.minX, (this.maxY - this.minY) / 2 + this.minY];
    for (let i = 0; i < rects.length; i++) {
      if (this.rects[i].pointOver(...this.center)) {
        this.center[0] = this.rects[i].x + this.rects[i].w / 2;
        this.centerRect = i;
        break;
        //this.center[1] = this.rects[i].y + this.rects[i].h / 2;
      }
    }
  }

  display() {
    let fillColor = [255];
    let textColor = [40];
    for (let i = 0; i < this.rects.length; i++) {
      if (this.rects[i].pointOver(mouseX, mouseY)) {
        fillColor = [100, 150, 255];
        textColor = [255];
      }
    }
    for (let i = 0; i < this.rects.length; i++) {
      this.rects[i].display(true, fillColor, false);
    }
    fill(...textColor);
    textFont(fonts[0]);
    textAlign(CENTER, CENTER);
    textSize(1);
    textSize((this.rects[this.centerRect].w / textWidth(this.name.toUpperCase())) / 1.25);
    text(this.name.toUpperCase(), this.center[0], this.center[1]);
  }
}

// Rectangle class for the room class
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display(isFilled, fillColor, hasStroke, strokeWidth, strokeColor) {
    if (!isFilled) {
      noFill();
    } else {
      fill(...fillColor);
    }
    if (!hasStroke) {
      noStroke();
    } else {
      strokeWeight(strokeWidth);
      stroke(...strokeColor);
    }
    rect(this.x, this.y, this.w, this.h);
  }

  pointOver(x2, y2) {
    return x2 >= this.x && y2 >= this.y && x2 <= this.x + this.w && y2 <= this.y + this.h;
  }
}

class Marker {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.r = 20;
    this.xOff = 0;
    this.yOff = 0;
    this.dragged = false;
  }

  display() {
    fill(0, 25);
    ellipse(this.x, this.y, this.r * 2 - this.z / 5);

    fill(150, 200, 255, 225);
    ellipse(this.x - this.z / 3, this.y - this.z, this.r * 2);
  }

  update() {
    this.z += 0.75;
    this.z += -this.z / 5;
    if (this.pointOver(mouseX, mouseY) && mouse.pressed) {
      this.xOff = this.x - mouseX;
      this.yOff = this.y - mouseY;
      this.dragged = true;
    }

    if (this.dragged) {
      this.x = this.xOff + mouseX;
      this.y = this.yOff + mouseY;
      this.z += 2;
    }

    if (this.dragged && mouse.released) {
      this.dragged = false;
    }
  }

  pointOver(x, y) {
    return dist(this.x, this.y, x, y) < this.r;
  }
}

// Display everything
function draw() {
  background(40);
  if (Object.keys(database).length == 0) {
    fill(255);
    textFont(fonts[0]);
    textAlign(CENTER, CENTER);
    text("FETCHING DATA...", width / 2, height / 2);
    return;
  }
  if (!dataFetched) {
    databaseLoaded();
  }
  dataFetched = true;
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].display();
  }
  for (let i = 0; i < markers.length; i++) {
    markers[i].update();
    markers[i].display();
  }
  mouse.pressed = false;
  mouse.released = false;
}

function mousePressed() {
  mouse.pressed = true;
  mouse.held = true;
}

function mouseReleased() {
  mouse.released = true;
  mouse.held = false;
}

// Realtime database updates
firebase.on('child_added', function (snapshot) {
  let json = snapshot.val();
  database[json.key] = json;
});

firebase.on('child_changed', function (snapshot) {
  let json = snapshot.val();
  database[json.key] = json;
});

firebase.on('child_removed', function (snapshot) {
  let json = snapshot.val();
  delete database[json.key];
});

// Database edit functions
function updateChild(name, json) {
  firebase.ref().child(name).update(json);
}
function addChild(name, json) {
  firebase.ref().child(name).set(json);
}
function removeChild(name) {
  firebase.ref().child(name).remove();
}