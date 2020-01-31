// Variables
let assets = [];
let database = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
let rects = [];

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
  if (mouseIsPressed) {
    [rects[rects.length - 1][2], rects[rects.length - 1][3]] = [mouseX - rects[rects.length - 1][0], mouseY - rects[rects.length - 1][1]];
  }
  noFill();
  stroke(255, 0, 0);
  strokeWeight(1);
  for (let i = 0; i < rects.length; i++) {
    rect(...rects[i]);
  }
}

function mousePressed() {
  rects.push([mouseX, mouseY, 0, 0]);
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