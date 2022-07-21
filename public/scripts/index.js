const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");

// Elements for sensor readings
const tempCElement = document.getElementById("tempC");
const tempFElement = document.getElementById("tempF");
const humElement = document.getElementById("hum");
const FlameElement = document.getElementById("apiState");
const PintuElement = document.getElementById("pintu");

// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display ='block';
    userDetailsElement.style.display ='block';
    userDetailsElement.innerHTML = user.email;

    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);

    // Database paths (with user UID)
    var dbPathTempC = 'UsersData/' + uid.toString() + '/temperatureC';
    var dbPathTempF = 'UsersData/' + uid.toString() + '/temperatureF';
    var dbPathHum = 'UsersData/' + uid.toString() + '/humidity';
    var dbPathFlame = 'UsersData/' + uid.toString() + '/apiState';
    var dbPintuPath = 'UsersData/' + uid.toString() + '/pintu';
    //log
    var logPath = 'UsersData/' + uid.toString() + '/storage';

    // Database references
    var dbRefTempC = firebase.database().ref().child(dbPathTempC);
    var dbRefTempF = firebase.database().ref().child(dbPathTempF);
    var dbRefHum = firebase.database().ref().child(dbPathHum);
    var dbRefFlame = firebase.database().ref().child(dbPathFlame);
    var dbRefPintu = firebase.database().ref().child(dbPintuPath);
    
    // Update page with new readings
    dbRefTempC.on('value', snap => {
      tempCElement.innerText = snap.val().toFixed(2);
    });
    dbRefTempF.on('value', snap => {
        tempFElement.innerText = snap.val().toFixed(2);
      });
    dbRefHum.on('value', snap => {
      humElement.innerText = snap.val().toFixed(2);
    });
    dbRefFlame.on("value", (snap) => {
      FlameElement.innerText =
          snap.val() === 1 ? "Api tidak terdeteksi" : "Api terdeteksi";
        });
    dbRefPintu.on("value", (snap) => {
      PintuElement.innerText =
          snap.val() === 1 ? "Pintu tertutup" : "Pintu terbuka";
    });

    const htmlFormat = (no, tempC, tempF, humidity, apiState, pintu) => {
      return `
        <div class="logs--data">
          <p>${no}.</p>
          <p>${tempC}</p>
          <p>${tempF}</p>
          <p>${humidity}</p>
          <p>${apiState}</p>
          <p>${pintu}</p>
        </div>
      `
    }

    const logsPlaceholder = document.querySelector(".logs");
    let no = 1;
    const dbLogs = firebase.database().ref(logPath).once('value',(logs)=>{
      logs.forEach(log=>{
        logsPlaceholder.insertAdjacentHTML("beforeend", htmlFormat(no, log.val().tempC ? `${log.val().tempC} &deg;C` : "No record", log.val().tempF ? `${log.val().tempF} &deg;F` : "No record", log.val().humidity ? `${log.val().humidity} &percnt;` : "No record", log.val().apiState === 1 ? "Api Tidak Terdeteksi" : "Api Terdeteksi", log.val().pintu === 1 ? "Pintu Tertutup" : "Pintu Terbuka",))
        no++;
      })
    }) 
  // if user is logged out
  } else{
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display ='none';
    userDetailsElement.style.display ='none';
    contentElement.style.display = 'none';
  }
}


//Code by @Tuyiiiing