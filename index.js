// environment variables
require('dotenv').config();

// ---Server---

const express = require('express');
const app = express(); // app is instance of express() method
const port = process.env.PORT;
const path = require("path");

// ---Middleware---

// serve static files (images, CSS/JavaScript files)
app.use(express.static(path.join(__dirname, "public"))); 
app.use("/bootstrapCSS", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/bootstrapJS", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/jQuery", express.static(path.join(__dirname, "node_modules/jquery/dist")));

app.use(express.urlencoded({extended: true})); // for parsing data

// ---Firebase---
var firebase = require("firebase/app");

// Add Firebase products that will be used here
// require("firebase/auth");
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

// get reference to database service
var database = firebase.database();

const dbRef = database.ref();

// define hard-coded userId (for now) for use in Firebase
const userId = 22;

// form is homepage (for now)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/nationalpage.html");
});

app.get("/addExperience", (req, res) => {
  res.sendFile(__dirname + "/public/addExperience.html");
});

app.get("/findIdealPlan", (req, res) => {
  res.sendFile(__dirname + "/public/findIdealPlan.html");
});

// write to realtime-database
function writeUserData(userData) {
  if (!userData.hotuos) {
    userData.hotuos = "";
  }

  database.ref('experiences/' + userId).set({
    age: userData.age,
    city: userData.city,
    state: userData.state,
    hotuos: userData.hotuos,
    prevSurgeries: userData.prevSurgeries,
    oopCost: userData.oopCost,
    hospitalName: userData.hospitalName,
    hospitalCity: userData.hospitalCity,
    iooon: userData.iooon,
    companyName: userData.companyName,
    iofn: userData.iofn,
    planCategory: userData.planCategory,
    premium: userData.premium,
    deductible: userData.deductible,
    copay: userData.copay
  });
}

// when index.html form submitted, goes to this route
app.post("/add-experience", (req, res) => {
  // write to the firebase realtime database one req.body JSON object
  writeUserData(req.body);

  // go back to form
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// get data using .get()
// dbRef.child("experiences").child(userId).get().then((snapshot) => {
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

// database.ref(`experiences/${userId}`).remove((error) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("Successfully Deleted")
//   }
// });