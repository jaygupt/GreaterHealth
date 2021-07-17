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
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/bootstrapCSS", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/bootstrapJS", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/jQuery", express.static(path.join(__dirname, "node_modules/jquery/dist")));

app.use(express.urlencoded({extended: true})); // for parsing data

// set up views folder
app.set('views', './views');

// set view engine to ejs
app.set('view engine', 'ejs');

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

// homepage
app.get("/", (req, res) => {
  let stateLongName = { 'AL' : 'Alabama', 'AK' : 'Alaska', 'AZ' : 'Arizona', 'AR' : 'Arkansas', 'CA' : 'California', 'CO' : 'Colorado', 'CT' : 'Connecticut', 'DE' : 'Delaware', 'FL' : 'Florida', 'GA' : 'Georgia', 'HI' : 'Hawaii', 'ID' : 'Idaho', 'IL' : 'Illinois', 'IN' : 'Indiana', 'IA' : 'Iowa', 'KS' : 'Kansas', 
      'KY' : 'Kentucky', 'LA' : 'Louisiana', 'ME' : 'Maine', 'MD' : 'Maryland', 
      'MA' : 'Massachusetts', 'MI' : 'Michigan', 'MN' : 'Minnesota', 'MS' : 'Mississippi', 
      'MO' : 'Missouri', 'MT' : 'Montana', 'NE' : 'Nebraska', 'NV' : 'Nevada', 'NH' : 'New Hampshire', 
      'NJ' : 'New Jersey', 'NM' : 'New Mexico', 'NY' : 'New York', 'NC' : 'North Carolina', 
      'ND' : 'North Dakota', 'OH' : 'Ohio', 'OK' : 'Oklahoma', 'OR' : 'Oregon', 'PA' : 'Pennsylvania', 
      'RI' : 'Rhode Island', 'SC' : 'South Carolina', 'SD' : 'South Dakota', 'TN' : 'Tennessee', 'TX' : 'Texas', 
      'UT' : 'Utah', 'VT' : 'Vermont', 'VA' : 'Virginia', 'WA' : 'Washington', 'WV' : 'West Virginia', 
      'WI' : 'Wisconsin', 'WY' : 'Wyoming', 'DC' : 'Washngton DC' };

  // full path: views/pages/nationalPage.ejs
  res.render("pages/nationalPage", {stateLongName: stateLongName});
});

app.get("/states/:stateName", (req, res) => {
  const stateName = req.params.stateName;
  res.render("pages/statePage", {state: stateName});
});

// Add an Experience
app.get("/addExperience", (req, res) => {
  // full path: views/pages/addExperience.ejs
  res.render("pages/addExperience");
});

// when index.html form submitted, goes to this route
app.post("/addExperience", (req, res) => {
  // write to the firebase realtime database one req.body JSON object
  writeUserData(req.body);

  // go back to form
  res.redirect("/");
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

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});