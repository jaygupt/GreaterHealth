// environment variables
require('dotenv').config();

// create a uuid
const { v4: uuidv4 } = require('uuid');

// ---Server---

const express = require('express');
const app = express(); // app is instance of express() method
const port = process.env.PORT;
const path = require("path");

// ---Middleware---

// serve static files (images, CSS/JavaScript files)
app.use(express.static(path.join(__dirname, "public"))); 
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
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
// const userId = 22;

let stateLongName = { 'AL' : 'Alabama', 'AK' : 'Alaska', 'AZ' : 'Arizona', 'AR' : 'Arkansas', 'CA' : 'California', 'CO' : 'Colorado', 'CT' : 'Connecticut', 'DE' : 'Delaware', 'FL' : 'Florida', 'GA' : 'Georgia', 'HI' : 'Hawaii', 'ID' : 'Idaho', 'IL' : 'Illinois', 'IN' : 'Indiana', 'IA' : 'Iowa', 'KS' : 'Kansas', 
      'KY' : 'Kentucky', 'LA' : 'Louisiana', 'ME' : 'Maine', 'MD' : 'Maryland', 
      'MA' : 'Massachusetts', 'MI' : 'Michigan', 'MN' : 'Minnesota', 'MS' : 'Mississippi', 
      'MO' : 'Missouri', 'MT' : 'Montana', 'NE' : 'Nebraska', 'NV' : 'Nevada', 'NH' : 'New Hampshire', 
      'NJ' : 'New Jersey', 'NM' : 'New Mexico', 'NY' : 'New York', 'NC' : 'North Carolina', 
      'ND' : 'North Dakota', 'OH' : 'Ohio', 'OK' : 'Oklahoma', 'OR' : 'Oregon', 'PA' : 'Pennsylvania', 
      'RI' : 'Rhode Island', 'SC' : 'South Carolina', 'SD' : 'South Dakota', 'TN' : 'Tennessee', 'TX' : 'Texas', 
      'UT' : 'Utah', 'VT' : 'Vermont', 'VA' : 'Virginia', 'WA' : 'Washington', 'WV' : 'West Virginia', 
      'WI' : 'Wisconsin', 'WY' : 'Wyoming'};

// longStateNames will be array of the values of stateLongName JSON object
let longStateNames = [];
for(let key of Object.keys(stateLongName)) {
  longStateNames.push(stateLongName[key]);
}

// homepage
app.get("/", (req, res) => {
  // full path: views/pages/nationalPage.ejs
  res.render("pages/nationalPage", {
    stateLongName: stateLongName, 
    longStateNames: longStateNames,
    pageName: "home"
  });
});

// Add an Experience
app.get("/addExperience", (req, res) => {
  // full path: views/pages/addExperience.ejs
  res.render("pages/addExperience", {
    pageName: "addExperience",
    longStateNames: longStateNames
  });
});

// Find my Ideal Plan
app.get("/findIdealPlan", (req, res) => {
  res.render("pages/findIdealPlan", {
    pageName: "findIdealPlan",
    longStateNames: longStateNames
  });
});

// Individual State Page
app.get("/states/:stateName", (req, res) => {
  const stateName = req.params.stateName;
  
  res.render("pages/statePage", {
    state: stateName,
    longStateNames: longStateNames,
    pageName: "state"
  });
});

// when index.html form submitted, goes to this route
app.post("/addExperience", (req, res) => {
  // write to the firebase realtime database one req.body JSON object
  writeUserDataToExperiences(req.body);

  // go back to form
  res.redirect("/");
});

// write to realtime-database's experiences route
function writeUserDataToExperiences(userData) {
  // if the user didn't input "History of Tobacco Use or Smoking"
  if (!userData.hotuos) {
    userData.hotuos = "";
  }

  // if the user didn't input "In or Out of Network"
  if (!userData.iooon) {
    userData.iooon = "";
  }

  // if the user didn't input "Individual or Family Network"
  if (!userData.iofn) {
    userData.iofn = "";
  }

  // generate a unique userID
  const userId = uuidv4();

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