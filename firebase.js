ref.ref().on('child_added', function(snapshot) {
  let json = snapshot.val();
  database[snapshot.key] = json;
  if (loaded) {
    updateObjects();
  }
});

ref.ref().on('child_changed', function(snapshot) {
  let json = snapshot.val();
  database[snapshot.key] = json;
  if (loaded) {
    updateObjects();
  }
});

ref.ref().on('child_removed', function(snapshot) {
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
  }
}

function updateObjects() {
  for (let i = 0; i < Object.keys(database.markers).length; i++) {
    let key = Object.keys(database.markers)[i];
    let inArray = false;
    let index = 0;
    for (let j = 0; j < markers.length; j++) {
      if (database.markers[key].name == markers[j].name) {
        inArray = true;
        index = i;
      }
    }
    if (inArray) {
      if (markers[index].name !== user.Qt.Ad) {
        markers[index].pos.x = database.markers[key].x;
        markers[index].pos.y = database.markers[key].y;
      }
    } else {
      markers.push(new Marker(database.markers[key].name, database.markers[key].x, database.markers[key].y));
    }
  }

  for (let i = 0; i < Object.keys(database.rooms).length; i++) {
    let key = Object.keys(database.rooms)[i];
    let inArray = false;
    let index = 0;
    for (let j = 0; j < rooms.length; j++) {
      if (key == rooms[j].name) {
        inArray = true;
        index = i;
      }
    }
    if (inArray) {
    } else {
      rooms.push(new Room(database.rooms[key].rects, key));
    }
  }
}