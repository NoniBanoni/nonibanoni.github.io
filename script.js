// Core Variables
let assets = [];
let database = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
let keys = [];
let fonts = [];

// Other Variables
let scale = 1.5;
let rooms = {
  "Chat": {
    "rects": [
      [55, 0, 190, 95]
    ]
  },
  "Ideate": {
    "rects": [
      [250, 0, 190, 95]
    ]
  },
  "Make": {
    "rects": [
      [445, 0, 110, 95],
      [460, 95, 95, 120]
    ]
  },
  "Library": {
    "rects": [
      [460, 220, 95, 175]
    ]
  },
  "Cafe Corner": {
    "rects": [
      [460, 400, 95, 115]
    ]
  },
  "Independence": {
    "rects": [
      [460, 520, 95, 55],
      [450, 575, 105, 145]
    ]
  },
  "Develop": {
    "rects": [
      [125, 145, 105, 125],
      [75, 270, 155, 50]
    ]
  },
  "Discover": {
    "rects": [
      [0, 325, 205, 120]
    ]
  },
  "Head Office": {
    "rects": [
      [0, 450, 85, 70]
    ]
  },
  "Connect": {
    "rects": [
      [90, 450, 40, 30]
    ]
  },
  "Curate": {
    "rects": [
      [0, 525, 85, 70]
    ]
  },
  "Communication": {
    "rects": [
      [125, 585, 40, 50]
    ]
  },
  "Coach": {
    "rects": [
      [170, 585, 60, 80]
    ]
  },
  "Mentor": {
    "rects": [
      [235, 585, 65, 80]
    ]
  },
  "Create": {
    "rects": [
      [305, 585, 75, 65]
    ]
  },
  "Explore": {
    "rects": [
      [305, 655, 75, 65]
    ]
  },
  "Commons": {
    "rects": [
      [125, 100, 330, 40],
      [235, 140, 220, 185],
      [210, 325, 245, 125],
      [135, 450, 320, 35],
      [90, 485, 365, 85],
      [90, 570, 30, 25],
      [120, 570, 325, 10],
      [385, 580, 60, 140]
    ]
  },
};

function preload() {
  assets[0] = loadImage("assets/Floor Plan.jpg");
  assets[1] = loadImage("assets/Floor Plan Simple.jpg");
  fonts[0] = loadFont("assets/fonts/Montserrat-Black.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function displayRooms() {
  textFont(fonts[0]);
  noStroke();
  textAlign(CENTER, CENTER);
  for (let i = 0; i < Object.keys(rooms).length; i++) {
    let key = Object.keys(rooms)[i];
    let x = 0, y = 0, sum = 0;
    for (let j = 0; j < rooms[key].rects.length; j++) {
      let roomRect = rooms[key].rects[j];
      colorMode(HSB);
      fill((i / Object.keys(rooms).length * 360), 50, 100);
      colorMode(RGB);
      rect(roomRect[0] * scale, roomRect[1] * scale, roomRect[2] * scale, roomRect[3] * scale);
      sum += roomRect[2] * roomRect[3];
      x += (roomRect[0] + roomRect[2] / 2) * (roomRect[2] * roomRect[3]);
      y += (roomRect[1] + roomRect[3] / 2) * (roomRect[2] * roomRect[3]);
    }
    x /= sum;
    y /= sum;
    for (let j = 0; j < rooms[key].rects.length; j++) {
      let roomRect = rooms[key].rects[j];
      if (x > roomRect[0] && y > roomRect[1] && x < roomRect[0] + roomRect[2] && y < roomRect[1] + roomRect[3]) {
        fill(51);
        textSize(1);
        textSize(roomRect[2] / textWidth(key.toUpperCase()) * scale * 0.75);
        text(key.toUpperCase(), (roomRect[0] + roomRect[2] / 2) * scale, y * scale);
      }
    }
  }
}

function draw() {
  background(51);
  displayRooms();
}

// Realtime database updates
firebase.on('child_added', function (snapshot) {
  database[snapshot.val().id] = json;
});
firebase.on('child_changed', function (snapshot) {
  database[snapshot.val().id] = json;
});
firebase.on('child_removed', function (snapshot) {
  delete data[snapshot.val().id];
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