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

// get reference to database service
var database = firebase.database();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/add-experience", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// write to realtime-database
// function writeUserData(userId, name, email, imageUrl) {
//   database.ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture: imageUrl
//   });
// }

// writeUserData(
//   22, 
//   "Jay Gupta", 
//   "jaythegupta@gmail.com", 
//   "https://media-exp1.licdn.com/dms/image/C4D03AQGFo3JNzPUsOw/profile-displayphoto-shrink_800_800/0/1597692097185?e=1631145600&v=beta&t=Dblhw1rSsSPLf0QTOXKvMu0P4N_EOBPdqwpjE36a9ys"
// );

// const dbRef = database.ref();
// const userId = 22;

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