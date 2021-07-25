// environment variables
require('dotenv').config();

// require the uuid package
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

// write to realtime-database's experiences route
function writeUserDataToExperiences(userData) {
  // set the radio questions to a blank
  if (!userData.hotuos) {
    userData.hotuos = "";
  }

  if (!userData.iooon) {
    userData.iooon = "";
  }

  if (!userData.iofn) {
    userData.iofn = "";
  }

  // add a dollar sign in front of monetary inputs
  userData.oopCost = "$" + userData.oopCost;
  userData.premium = "$" + userData.premium;
  userData.deductible = "$" + userData.deductible;
  userData.copay = "$" + userData.copay;

  // go through each key-value pair in userData
  for (key in userData) {
    // if the value is not provided, set it to N/A
    if (userData[key] == "") {
      userData[key] = "N/A";
    }
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

// when addExperience.ejs's form is submitted, goes to this route
app.post("/addExperience", (req, res) => {
  // write the user's data to the firebase realtime database
  writeUserDataToExperiences(req.body);

  // go back to form
  res.redirect("/");
});

function queryExperiences(req) {
  // return a Promise; it will wait for .then to get resolved before returning
  return new Promise((resolve, reject) => {
    dbRef.child("experiences").get().then((snapshot) => {
      if (snapshot.exists) {
        // experiences from other users: same state and city
        var sameCityAndStateCounter = 0;
        var experiencesWithSameCityAndState = {};
  
        var sameStateCounter = 0;
        var experiencesWithSameState = {};
  
        // snapValue is the data in experiences
        var snapValue = snapshot.val();
  
        // loop through each user (represented by userID) in snapValue
        for (user in snapValue) {
          // if the inputted city and state matches with a city and state in the database
          if (req.body.city == snapValue[user].city && req.body.state == snapValue[user].state) {
            experiencesWithSameCityAndState[sameCityAndStateCounter] = snapValue[user]; 
            sameCityAndStateCounter++;
            continue;
          }
  
          // if the inputted state matches with a state in the database (and city doesn't match)
          if (req.body.state == snapValue[user].state) {
            experiencesWithSameState[sameStateCounter] = snapValue[user]; 
            sameStateCounter++;
          }
        }
  
        return resolve({experiencesWithSameState, experiencesWithSameCityAndState});
      } else {
        // snapshot doesn't exist
        console.log("Snapshot doesn't exist.");
      }
    }).catch((error) => {
      // if there is an error, log it to console
      return reject(error);
    });
  });
}

function queryStates(theState) {
  return new Promise((resolve, reject) => {
    // send the plans in the user's state
    dbRef.child("states").child(theState).get().then((snapshot) => {
      if (snapshot.exists()) {
        return resolve(snapshot.val());
      } else {
        return reject(false);
      }
    }).catch((error) => {
      return reject(false);
    });
  });
}

// when findIdealPlan.ejs's form is submitted, goes to this route
app.post("/findIdealPlan", (req, res) => {
  var toBeSent = {};

  // send two things: experiences from other users & state plans 
  queryExperiences(req)
    .then(responseFromQueryExperiences => {
      toBeSent["fromExperiences"] = responseFromQueryExperiences;
      queryStates(req.body.state)
      .then(responseFromQueryStates => {
        toBeSent["fromStates"] = responseFromQueryStates;
      })
      .catch(responseFromQueryStates => {
        // error; likely, that state isn't in the database
        toBeSent["fromStates"] = false;
      })
      .then(() => {
        res.send(toBeSent);
      })
    })
    .catch((err) => {
      // in case of error
      console.log(err);
    });
});

// listen on the specified port
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});