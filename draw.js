let files = {}; // Files
let database = {}; // Database in json format
let ref = firebase.database(); // Firebase refrence
let user;
let name;


let loaded = false; // Is everything loaded?
let signedIn = false; // Is user signed in?
let dataFetched = false; // Is firebase data fetched?
let shake = 0;

let palate = {
  yellow: [201, 221, 59],
  blue: [92, 203, 224],
  purple: [118, 145, 204],
  mainColor: [40],
  subColor: [200],
  borderColor: [80]
}
let mouse = { // Mouse actions
  "pressed": false,
  "held": false,
  "released": false
};

let rooms = []; // Array of Room objects
let markers = []; // Array of Marker objects

let roomScale = 0; // Scale for the rooms
let w = Math.floor(Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16);
let h = Math.floor(Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9);

// Loading assets and fonts
function preload() {
  $(".g-signin2")[0].style.display = "none";
  files.background = loadImage("assets/background.png");
  files.fonts = {
    "blackItalic": loadFont("assets/fonts/Montserrat-BlackItalic.ttf"),
    "light": loadFont("assets/fonts/Montserrat-Light.ttf")
  };
}

function setup() {
  // Create a 16 by 9 canvas that is optimally fit to the screen
  createCanvas(w, h);

  // Set scale so that the rooms will fit the canvas perfectly.
  roomScale = Math.min(w / 555, h / 720) * 0.8;
}

// Display everything
function draw() {
  background(255);

  push();
  translate(random(-shake * width / 10, shake * width / 10), random(-shake * width / 10, shake * width / 10));

  shake *= 0.8;

  fill(...palate.mainColor);
  rect(0, 0, width, height);

  image(files.background, 0, 0, w, h);
  
  loaded = true;
  if (Object.keys(database).length == 0 || frameCount < 60) {
    dataFetched = false;
    fill(255);
    textSize(100);
    textFont(files.fonts.blackItalic);
    textAlign(CENTER, CENTER);
    text("FETCHING DATA...", w / 2, h / 2);
    loaded = false;
    return;
  }

  if (!dataFetched) {
    updateObjects();
    if (signedIn) {
      for (let i = 0; i < Object.keys(database.markers).length; i++) {
        if (Object.keys(database.markers)[i].name == name) {
          return;
        }
      }
      addChild("markers/" + name, {
        "name": name,
        "x": 0.5,
        "y": 0.5
      });
    }
  }

  dataFetched = true;
    
  if (!signedIn) {
    $(".g-signin2")[0].style.display = "";
    let button = $(".abcRioButton")[0];
    button.style.transform = `scale(${w / 500})`;
    buttonWidth = parseInt(button.style.width.substring(0, button.style.width.length - 2));
    buttonHeight = parseInt(button.style.height.substring(0, button.style.height.length - 2));
    $(".g-signin2")[0].style.position = `absolute`;
    $(".g-signin2")[0].style.left = `${w / 2 - buttonWidth / 2}px`;
    $(".g-signin2")[0].style.top = `${h / 2 - buttonHeight / 2}px`;
    noStroke();
    textAlign(CENTER);
    textSize(w / 50);
    textFont(files.fonts.blackItalic);
    fill(255);
    text("YOU ARE SIGNED OUT.", w / 2, h / 2 - buttonWidth);
    return;
  }

  $(".g-signin2")[0].style.display = "none";

  fill(palate.mainColor);
  rectMode(CENTER);
  rect(w / 2, h / 2, 555 * (roomScale * 1.125), 720 * (roomScale * 1.125), w / 75);
  rectMode(CORNER);

  rect((h - 720 * (roomScale * 1.125)) / 2, (h - 720 * (roomScale * 1.125)) / 2, (w / 2 - (720 * (roomScale * 1.125) / 2)), 720 * (roomScale * 1.125), h / 75);
  rect(w / 2 + ((555 * (roomScale * 1.125)) / 2) + ((h - 720 * (roomScale * 1.125)) / 2), (h - 720 * (roomScale * 1.125)) / 2, (w / 2 - (720 * (roomScale * 1.125) / 2)), 720 * (roomScale * 1.125), width / 75);


  for (let i = 0; i < rooms.length; i++) {
    rooms[i].display();
  }
  for (let i = 0; i < markers.length; i++) {
    markers[i].update();
    markers[i].display();
  }
  mouse.pressed = false;
  mouse.released = false;
  pop();
}

function mousePressed() {
  mouse.pressed = true;
  mouse.held = true;
}

function mouseReleased() {
  mouse.released = true;
  mouse.held = false;
}
