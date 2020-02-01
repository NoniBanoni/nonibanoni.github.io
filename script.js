// Core Variables
let assets = [];
let database = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
let keys = [];

// Other Variables
let rooms = {
  "Chat": {
    "rects": [
      [255, 0, 190, 95]
    ]
  },
  "Ideate": {
    "rects": [
      [450, 0, 190, 95]
    ]
  },
  "Make": {
    "rects": [
      [645, 0, 105, 95],
      [660, 95, 95, 120]
    ]
  },
  "Library": {
    "rects": [
      [660, 220, 95, 175]
    ]
  },
  "Cafe Corner": {
    "rects": [
      [660, 400, 90, 105]
    ]
  },
  "Independence": {
    "rects": [
      [655, 520, 95, 200],
      [650, 575, 5, 145]
    ]
  },
  "Develop": {
    "rects": [
      [325, 145, 105, 125],
      [275, 270, 155, 50]
    ]
  },
  "Discover": {
    "rects": [
      [203, 328, 202, 118]
    ]
  },
  "Head Office": {
    "rects": [
      [203, 452, 82, 67]
    ]
  },
  "Connect": {
    "rects": [
      [292, 453, 37, 29]
    ]
  },
  "Curate": {
    "rects": [
      [202, 526, 82, 67]
    ]
  },
  "Communication": {
    "rects": [
      [327, 588, 34, 47]
    ]
  },
  "Coach": {
    "rects": [
      [368, 586, 62, 80]
    ]
  },
  "Mentor": {
    "rects": [
      [437, 586, 61, 80]
    ]
  },
  "Create": {
    "rects": [
      [505, 586, 73, 61]
    ]
  },
  "Explore": {
    "rects": [
      [505, 653, 74, 66]
    ]
  },
  "Commons": {
    "rects": [
      [0, 0, 0, 0]
    ]
  },
};

function preload() {
  assets[0] = loadImage("assets/Floor Plan.jpg");
  assets[1] = loadImage("assets/Floor Plan Simple.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  cursor("crosshair");
  background(255);
  image(assets[1], 0, 0);
  noFill();
  stroke(255, 0, 0);
  strokeWeight(1);
  for (let i = 0; i < Object.keys(rooms).length; i++) {
    let key = Object.keys(rooms)[i];
    for (let j = 0; j < rooms[key].rects.length; j++) {
      let roomRect = rooms[key].rects[j]
      rect(...roomRect);
      text(key, roomRect[0] + roomRect[2] / 2, roomRect[1] + roomRect[3] / 2);
    }
  }
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