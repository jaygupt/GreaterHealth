// environment variables
require('dotenv').config();

// server
const express = require('express');
const app = express();
const port = process.env.PORT;

// ---Middleware---

// serve static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// firebase
var firebase = require("firebase/app");

// Add Firebase products that will be used here
// require("firebase/auth");
// require("firebase/firestore");
require("firebase/database");

var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database(); // get reference to database service
// const dbRef = database.ref();

const userId = 22;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// write to realtime-database
function writeUserData(userId, age, city, state, historyOfTobaccoOrSmoking, previousSurgeries, oopCost) {
  database.ref('experiences/' + userId).set({
    age: age,
    city: city,
    state: state,
    historyOfTobaccoOrSmoking: historyOfTobaccoOrSmoking,
    previousSurgeries: previousSurgeries,
    oopCost: oopCost
  });
}

app.post("/add-experience", (req, res) => {
  var age = req.body.age;
  var city = req.body.city;
  var state = req.body.state;
  var historyOfTobaccoOrSmoking = req.body.hotuos;
  if (!historyOfTobaccoOrSmoking) {
    historyOfTobaccoOrSmoking = "";
  }
  var previousSurgeries = req.body.prevSurgeries;
  var oopCost = req.body.oopCost;

  // write to the firebase realtime database
  writeUserData(
    userId, 
    age, 
    city, 
    state, 
    historyOfTobaccoOrSmoking,
    previousSurgeries,
    oopCost
  );

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// get data using .get()
// dbRef.child("users").child(userId).child("username").get().then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });

// get data with .on()
// var usernameRef = database.ref('users/' + userId + '/username');
// usernameRef.on('value', (snapshot) => {
//   const data = snapshot.val();
//   console.log(data);
// });

// update the data
// var updates = {
//   email: "sidthesloth@yahoo.com"
// };

// database.ref('users/' + userId).update(updates, (error) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("Successfully Updated!");
//   }
// });

// database.ref('users/' + userId + '/email').remove((error) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("Successfully Deleted")
//   }
// });