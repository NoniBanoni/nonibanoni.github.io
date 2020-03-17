ref.ref().on('child_added', function (snapshot) {
  let json = snapshot.val();
  database[snapshot.key] = json;
  if (loaded) {
    updateObjects();
  }
});

ref.ref().on('child_changed', function (snapshot) {
  console.log("CHANGES");
  let json = snapshot.val();
  database[snapshot.key] = json;
  if (loaded) {
    updateObjects();
  }
});

ref.ref().on('child_removed', function (snapshot) {
  let json = snapshot.val();
  delete database[snapshot.key];
});

// Database edit functions
function updateChild(name, json) {
  ref.ref().child(name).update(json);
}
function addChild(name, json) {
  ref.ref().child(name).set(json);
}
function removeChild(name) {
  ref.ref().child(name).remove();
}

function onSignIn(callback) {
  if (callback) {
    user = callback;
    signedIn = true;
    for (let i = 0; i < Object.keys(database.markers).length; i++) {
      if (Object.keys(database.markers)[i].name == user.Qt.Ad) {
        return;
      }
    }
    addChild("markers/" + user.Qt.Ad, {
      "name": user.Qt.Ad,
      "x": 0.5,
      "y": 0.5
    });
  }
}

function updateObjects() {
  if (Object.keys(database.markers).length > markers.length) {
    let len = markers.length;
    for (let i = Object.keys(database.markers).length - 1; i >= len; i--) {
      let key = Object.keys(database.markers)[i];
      markers.push(new Marker(database.markers[key].name, database.markers[key].x, database.markers[key].y));
    }
  } else {
    for (let i = 0; i < Object.keys(database.markers).length; i++) {
      let key = Object.keys(database.markers)[i];
      markers[i].x = database.markers[key].x;
      markers[i].y = database.markers[key].y;
    }
  }

  if (Object.keys(database.rooms).length > rooms.length) {
    let len = rooms.length;
    for (let i = Object.keys(database.rooms).length - 1; i >= len; i--) {
      let key = Object.keys(database.rooms)[i];
      rooms.push(new Room(database.rooms[key].rects, key));
    }
  }
}