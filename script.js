// Core Variables
let assets = [];
let database = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
let keys = [];

// Other Variables
let rects =
  [
    [254, 0, 189, 96],
    [449, 0, 191, 93],
    [646, 0, 106, 93],
    [657, 93, 95, 120],
    [657, 219, 95, 173],
    [660, 402, 91, 105],
    [655, 520, 96, 199],
    [649, 576, 6, 143],
    [325, 146, 104, 125],
    [276, 271, 153, 50],
    [203, 328, 202, 118],
    [203, 452, 82, 67],
    [292, 453, 37, 29],
    [202, 526, 82, 67],
    [327, 588, 34, 47],
    [368, 586, 62, 80],
    [437, 586, 61, 80],
    [505, 586, 73, 61],
    [505, 653, 74, 66],
  ];

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
  for (let i = 0; i < rects.length; i++) {
    rect(...rects[i]);
    text(i, rects[i][0] + (rects[i][2] / 2), rects[i][1] + (rects[i][3] / 2));
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