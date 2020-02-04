// Core Variables
let assets = [];
let database = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
let keys = [];
let fonts = [];

// Other Variables
let scale = 1.5;
let rooms = [];
let dataFetched = false;

function preload() {
  assets[0] = loadImage("assets/Floor Plan.jpg");
  assets[1] = loadImage("assets/Floor Plan Simple.jpg");
  fonts[0] = loadFont("assets/fonts/Montserrat-Light.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function databaseLoaded() {
  for (let i = 0; i < Object.keys(database.rooms).length - 1; i++) {
    let key = Object.keys(database.rooms)[i];
    rooms.push(new Room(database.rooms[key].rects, key));
  }
}

class Room {
  constructor(rects, name) {
    this.rects = [];
    for (let i = 0; i < rects.length; i++) {
      this.rects[i] = new Rectangle(...rects[i]);
    }
    this.name = name;
  }

  display() {
    let color = [255, 255, 255];

    for (let i = 0; i < this.rects.length; i++) {
      if (this.rects[i].mouseOn()) {
        color = [255, 100, 100];
      }
    }

    for (let i = 0; i < this.rects.length; i++) {
      this.rects[i].display(true, color, false);
    }
  }
}

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

  mouseOn() {
    return mouseX > this.x && mouseY > this.y && mouseX < this.x + this.w && mouseY < this.y + this.h;
  }
}

// function displayRooms() {
//   textFont(fonts[0]);
//   noStroke();
//   textAlign(CENTER, CENTER);
//   for (let i = 0; i < Object.keys(rooms).length - 1; i++) {
//     let key = Object.keys(rooms)[i];
//     let x = 0, y = 0, sum = 0;
//     for (let j = 0; j < rooms[key].rects.length; j++) {
//       let roomRect = rooms[key].rects[j];
//       colorMode(HSB);
//       fill((i / Object.keys(rooms).length * 360), 50, 100);
//       colorMode(RGB);
//       rect(roomRect[0] * scale, roomRect[1] * scale, roomRect[2] * scale, roomRect[3] * scale);
//       sum += roomRect[2] * roomRect[3];
//       x += (roomRect[0] + roomRect[2] / 2) * (roomRect[2] * roomRect[3]);
//       y += (roomRect[1] + roomRect[3] / 2) * (roomRect[2] * roomRect[3]);
//     }
//     x /= sum;
//     y /= sum;
//     for (let j = 0; j < rooms[key].rects.length; j++) {
//       let roomRect = rooms[key].rects[j];
//       if (x > roomRect[0] && y > roomRect[1] && x < roomRect[0] + roomRect[2] && y < roomRect[1] + roomRect[3]) {
//         fill(51);
//         textSize(1);
//         textSize(roomRect[2] / textWidth(key) * scale * 0.75);
//         text(key, (roomRect[0] + roomRect[2] / 2) * scale, y * scale);
//       }
//     }
//   }
// }

function draw() {
  background(51);
  if (Object.keys(database).length == 0) {
    fill(255);
    textFont(fonts[0]);
    textAlign(CENTER, CENTER);
    text("FETCHING DATA...", width / 2, height / 2);
    return;
  } else {
    if (!dataFetched) {
      databaseLoaded();
    }
    dataFetched = true;
    for (let i = 0; i < rooms.length; i++) {
      rooms[i].display();
    }
  }
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