let logo;

function preload() {
  logo = loadImage("assets/logo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  image(logo, windowWidth / 2 - (min(windowWidth, windowHeight) / 2), windowHeight / 2 - (min(windowWidth, windowHeight) / 2), min(windowWidth, windowHeight), min(windowWidth, windowHeight));
}

let data = {};
let firebase = new Firebase('https://roomonitor-4e09e.firebaseio.com');
firebase.on('child_added', function (snapshot) {
  data[snapshot.val().id] = json;
});
firebase.on('child_changed', function (snapshot) {
  data[snapshot.val().id] = json;
});
firebase.on('child_removed', function (snapshot) {
  delete data[snapshot.val().id];
});
function updateChild(name, json) {
  firebase.ref().child(name).update(json);
}
function addChild(name, json) {
  firebase.ref().child(name).set(json);
}
function removeChild(name) {
  firebase.ref().child(name).remove();
}
