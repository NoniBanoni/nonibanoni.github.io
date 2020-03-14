ref.ref().on('child_added', function (snapshot) {
  let json = snapshot.val();
  database[json.key] = json;
  if (json.key == "markers" && loaded) {
    for (let i = 0; i < Object.keys(json).length - 1; i++) {
      let markerJSON = json[Object.keys(json)[i]];
      markers.push(new Marker(markerJSON.name, markerJSON.x, markerJSON.y));
    }
  }
});

ref.ref().on('child_changed', function (snapshot) {
  console.log("changes");
  let json = snapshot.val();
  database[json.key] = json;
  if (json.key == "markers" && loaded) {
    for (let i = 0; i < Object.keys(json).length - 1; i++) {
      markers[i].pos.x = json[Object.keys(json)[i]].x;
      markers[i].pos.y = json[Object.keys(json)[i]].y;
    }
  }
});

ref.ref().on('child_removed', function (snapshot) {
  let json = snapshot.val();
  delete database[json.key];
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