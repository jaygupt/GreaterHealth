// environment variables
require('dotenv').config();

// require the uuid package
const { v4: uuidv4 } = require('uuid');

// require axios
const axios = require('axios');

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
app.use("/tabulatorCSS", express.static(path.join(__dirname, "node_modules/tabulator-tables/dist/css")));
app.use("/tabulatorJS", express.static(path.join(__dirname, "node_modules/tabulator-tables/dist/js")))
app.use(express.urlencoded({extended: true})); // for parsing data

// set up views folder
app.set('views', './views');

// set view engine to ejs
app.set('view engine', 'ejs');

// ---Firebase---
var admin = require("firebase-admin"); // for using admin SDK
var serviceAccount = require("./serviceAccountKey.json"); // admin credentials for full read & write access

// Add Firebase products that will be used here
require("firebase/database");

// initialize Firebase
const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL
});

// get reference to database service
var database = firebase.database();
const dbRef = database.ref();

const marketplaceAPIKey = process.env.marketplaceAPIKey;

let stateLongName = { 'AL' : 'Alabama', 'AK' : 'Alaska', 'AZ' : 'Arizona', 'AR' : 'Arkansas', 'CA' : 'California', 'CO' : 'Colorado', 'CT' : 'Connecticut', 'DE' : 'Delaware', 'FL' : 'Florida', 'GA' : 'Georgia', 'HI' : 'Hawaii', 'ID' : 'Idaho', 'IL' : 'Illinois', 'IN' : 'Indiana', 'IA' : 'Iowa', 'KS' : 'Kansas', 
      'KY' : 'Kentucky', 'LA' : 'Louisiana', 'ME' : 'Maine', 'MD' : 'Maryland', 
      'MA' : 'Massachusetts', 'MI' : 'Michigan', 'MN' : 'Minnesota', 'MS' : 'Mississippi', 
      'MO' : 'Missouri', 'MT' : 'Montana', 'NE' : 'Nebraska', 'NV' : 'Nevada', 'NH' : 'New Hampshire', 
      'NJ' : 'New Jersey', 'NM' : 'New Mexico', 'NY' : 'New York', 'NC' : 'North Carolina', 
      'ND' : 'North Dakota', 'OH' : 'Ohio', 'OK' : 'Oklahoma', 'OR' : 'Oregon', 'PA' : 'Pennsylvania', 
      'RI' : 'Rhode Island', 'SC' : 'South Carolina', 'SD' : 'South Dakota', 'TN' : 'Tennessee', 'TX' : 'Texas', 
      'UT' : 'Utah', 'VT' : 'Vermont', 'VA' : 'Virginia', 'WA' : 'Washington', 'WV' : 'West Virginia', 
      'WI' : 'Wisconsin', 'WY' : 'Wyoming'};

// scraped from https://www.wikidoc.org/index.php/List_of_surgical_procedures (see webscraper.py)
var surgeries = ['Abdominal Surgery', 'Abdominoplasty', 
  'Acromioplasty', 'Adenoidectomy', 'Amputation', 'Angioplasty', 
  'Appendicectomy', 'Arthrodesis', 'Arthroplasty', 'Arthroscopy', 
  'Bilateral Cingulotomy', 'Biopsy', 'Neurosurgery', 'Cauterization', 
  'Cesarean Section', 'Cholecystectomy', 'Circumcision', 'Colostomy', 
  'Commissurotomy', 'Cordotomy', 'Corneal Transplantation', 'Discectomy', 
  'Episiotomy', 'Endarterectomy', 'Endoscopic Thoracic Sympathectomy', 'Foreskin Restoration', 
  'Fistulotomy', 'Frenectomy', 'Gastrectomy', 'Grafting', 'Heart Transplantation', 
  'Hemicorporectomy', 'Hemilaminectomy', 'Hemorrhoidectomy', 'Hepatectomy', 
  'Hernia Repair', 'Hypnosurgery', 'Hysterectomy', 'Kidney Transplantation', 
  'Khyphoplasty', 'Laminectomy', 'Laparoscopy', 'Laparotomy', 'Laryngectomy', 
  'Lithotripsy', 'Lobotomy', 'Lumpectomy', 'Lung Transplantation', 'Mammoplasty', 
  'Mastectomy', 'Mastoidectomy', 'Myotomy', 'Mryingotomy', 'Nephrectomy', 
  'Nissen Fundoplication', 'Oophorectomy', 'Orchidectomy', 'Pancreaticoduodenectomy', 
  'Parathyroidectomy', 'Penectomy', 'Phalloplasty', 'Pleurodesis', 'Pneumonectomy', 
  'Prostatectomy', 'Psychosurgery', 'Radiosurgery', 'Sphincterotomy', 'Splenectomy', 
  'Stapedectomy', 'Thoracotomy', 'Thrombectomy', 'Thymectomy', 'Thyroidectomy', 'Tonsillectomy', 
  'Tracheotomy', 'Tracheostomy', 'Tubal Ligation', 'Tubal Reversal', 
  'Ulnar Collateral Ligament Reconstruction', 'Ureterosigmoidostomy', 'Vaginectomy', 
  'Vasectomy', 'Vivisection', 'Vulvectomy'];

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
    longStateNames: longStateNames,
    surgeries: surgeries
  });
});

// Find my Ideal Plan
app.get("/findIdealPlan", (req, res) => {
  res.render("pages/findIdealPlan", {
    pageName: "findIdealPlan",
    longStateNames: longStateNames,
    surgeries: surgeries
  });
});

// queries Realtime Database for experiences in that state (based on individual state page)
function experiencesInState(theState) {
  return new Promise((resolve, reject) => {
    dbRef.child("experiences").get().then((snapshot) => {
      if (snapshot.exists) {
        var counter = 0;
        var experiencesInState = {};

        // snapValue is the data in experiences
        var snapValue = snapshot.val();

        // loop through each user (represented by userID) in snapValue
        for (user in snapValue) {
          // if the requested state matches with a state in the database, store it in experiencesInState
          if (theState == snapValue[user].state) {
            experiencesInState[counter] = snapValue[user];
            counter++;
          }
        }

        return resolve(experiencesInState);
      } else {
        // snapshot doesn't exist
        console.log("Snapshot doesn't exist.");
      }
    }).catch(error => {
      // if error, log it to console
      return reject(error);
    });
  });
}

// Individual State Page
app.get("/states/:stateName", (req, res) => {
  const stateName = req.params.stateName;

  experiencesInState(stateName)
    .then((responseFromExperiencesInState) => {
      res.render("pages/statePage", {
        state: stateName,
        longStateNames: longStateNames,
        pageName: "state",
        responseFromExperiencesInState: responseFromExperiencesInState
      })
    })
    .catch((error) => {
      console.log(error);
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

  // city and state that person is from
  var zipTasticObjectOfPerson = 
    queryZiptasticAPI(userData.zipCode)
      .then(responseFromQueryZiptasticAPI => {
        return responseFromQueryZiptasticAPI;
      })
      .catch(errorFromQueryZiptasticAPI => {
        console.log(errorFromQueryZiptasticAPI);
      });
  
  // city and state that hospital is located in
  var zipTasticObjectOfHospital = 
    queryZiptasticAPI(userData.hospitalZipCode)
      .then(responseFromQueryZiptasticAPI => {
        return responseFromQueryZiptasticAPI;
      })
      .catch(errorFromQueryZiptasticAPI => {
        console.log(errorFromQueryZiptasticAPI);
      });

  zipTasticObjectOfPerson
    .then(personCityAndState => {
      zipTasticObjectOfHospital
        .then(hospitalCityAndState => {
          database.ref('experiences/' + userId).set({
            age: userData.age,
            city: personCityAndState.city,
            state: personCityAndState.state,
            hotuos: userData.hotuos,
            prevSurgeries: userData.prevSurgeries,
            oopCost: userData.oopCost,
            hospitalName: userData.hospitalName,
            hospitalCity: hospitalCityAndState.city,
            iooon: userData.iooon,
            companyName: userData.companyName,
            iofn: userData.iofn,
            planCategory: userData.planCategory,
            premium: userData.premium,
            deductible: userData.deductible,
            copay: userData.copay
          });
        })
        .catch(errorFromZipTasticObjectOfHospital => {
          console.log(errorFromZipTasticObjectOfHospital)
        });
    })
    .catch(errorFromZipTasticObjectOfPerson => {
      console.log(errorFromZipTasticObjectOfPerson);
    });
}

// when addExperience.ejs's form is submitted, goes to this route
app.post("/addExperience", (req, res) => {
  // write the user's data to the firebase realtime database
  writeUserDataToExperiences(req.body);

  // go to homepage
  res.redirect("/");
});

// parameters: city and state of the zipcode the user inputted
function queryExperiences(theCity, theState) {
  // return a Promise; it will wait for .then to get resolved before returning
  return new Promise((resolve, reject) => {
    dbRef.child("experiences").get().then((snapshot) => {
      if (snapshot.exists) {
        // experiences from other users: same state and city
        var sameCityAndStateCounter = 0;
        var experiencesWithSameCityAndState = {};
  
        // experiences from other users: same state but not same city
        var sameStateCounter = 0;
        var experiencesWithSameState = {};
  
        // snapValue is the data in experiences
        var snapValue = snapshot.val();
  
        // loop through each user (represented by userID) in snapValue
        for (user in snapValue) {
          // if the inputted city and state matches with a city and state in the database
          if (theCity == snapValue[user].city && theState == snapValue[user].state) {
            experiencesWithSameCityAndState[sameCityAndStateCounter] = snapValue[user]; 
            sameCityAndStateCounter++;
          } else if (theState == snapValue[user].state) {
            // if the inputted state matches with a state in the database (and city doesn't match)
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

// on success, returns country, state, and city
function queryZiptasticAPI(zipCode) {
  return new Promise((resolve, reject) => {
    axios.get(`http://ZiptasticAPI.com/${zipCode}`)
      .then((res) => {
        var stateAndCity = res.data;

        // if zip code is found (no error key/value pair)
        if (!stateAndCity.error) {
          // put city in proper case (each word's first letter capitalized)
          var city = stateAndCity.city;
          city = city.toLowerCase();
          var arrayOfWords = city.split(" ");
          for (var i = 0; i < arrayOfWords.length; i++) {
              arrayOfWords[i] = arrayOfWords[i][0].toUpperCase() + arrayOfWords[i].substr(1);
          }
          city = arrayOfWords.join(" ");
          stateAndCity.city = city;
          
          // put state in long form (not two letters)
          var state = stateLongName[stateAndCity.state];
          stateAndCity.state = state;

          resolve(stateAndCity);
        } else {
          // if zipcode not found, return N/A for city and state
          resolve({
            city: "N/A",
            state: "N/A"
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// when findIdealPlan.ejs's form is submitted, goes to this route
app.post("/findIdealPlan", (req, res) => {
  // make call to queryZiptasticAPI function to get city and state
  var zipTasticObject = 
    queryZiptasticAPI(req.body.zipCode)
      .then((responseFromQueryZiptasticAPI) => {
        return responseFromQueryZiptasticAPI;
      })
      .catch((errorFromQueryZiptasticAPI) => {
        console.log(errorFromQueryZiptasticAPI);
      });

  zipTasticObject
    .then(stateAndCity => {
      queryExperiences(stateAndCity.city, stateAndCity.state) // gets experiences based on city and state
        .then(responseFromQueryExperiences => {
          // send city, state, and the experiences to findIdealPlan.ejs for the user to view
          res.send({
            "city": stateAndCity.city, 
            "state": stateAndCity.state, 
            "queryExperiences": responseFromQueryExperiences
          });
        })
        .catch(errorFromQueryExperiences => {
          console.log(errorFromQueryExperiences);
        })
    })
    .catch((errorFromZipTasticObject) => {
      console.log(errorFromZipTasticObject);
    });
});

// configure value of "place" key when calling Marketplace API
function getPlaceValue(zipcode) {
  return new Promise((resolve, reject) => {
    var placeValue = {};

    placeValue["zipcode"] = zipcode;

    axios.get(`https://marketplace.api.healthcare.gov/api/v1/counties/by/zip/${zipcode}?apikey=${marketplaceAPIKey}`)
      .then((res) => {
        var mainInfo = res.data.counties[0];
        placeValue["countyfips"] = mainInfo.fips;
        placeValue["state"] = mainInfo.state;
        return resolve(placeValue);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

app.post("/marketplaceapi", (request, response) => {
  request.body.income = parseFloat(request.body.income);

  // if gender is male, set is_pregnant to false
  if (request.body.gender == "Male") {
    request.body.is_pregnant = "false";
  }

  // value of place in Marketplace API call
  var placeValue = "";

  // use getPlaceValue function to get the value of the place attribute
  placeValue = getPlaceValue(request.body.zipCode)
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(err);
    });
  
  // use placeValue in the Marketplace API call
  placeValue.then(thePlaceValue => {
    axios.post(`https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${marketplaceAPIKey}`, {
      "household": {
        "income": request.body.income,
        "people": [
          {
            "aptc_eligible": request.body.aptc_eligible === true,
            "dob": request.body.dob,
            "has_mec": false,
            "is_pregnant": request.body.is_pregnant === true,
            "is_parent": request.body.is_parent === true,
            "uses_tobacco": request.body.uses_tobacco === true,
            "gender": request.body.gender,
            "utilization_level": request.body.utilization_level
          }
        ],
        "has_married_couple": request.body.has_married_couple === true
      },
      "market": "Individual",
      "place": thePlaceValue,
      "limit": 10,
      "offset": 0,
      "order": "asc",
      "year": 2020
    })
    .then(res => {
      // success: API returned JSON object containing plans

      // send the API's data & the full name of the state using a JSON object
      response.send({
        "apiData": res.data,
        "state": stateLongName[thePlaceValue.state]
      });
    })
    .catch(err => {
      // if any error when calling API, log it to console
      console.log(err);
    });
  });
});

// listen on the specified port
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});