// Get the below details by making an account at dev.netatmo.com

let clientId = "XXXXXXXXX"
let clientSecret = "XXXXXXXXX"
let username = "XXXXXXXXX"
let password = "XXXXXXXXX"
let homeId = "XXXXXXXXX"
let roomId = "XXXXXXXXX"
let macId = "XX:XX:XX:XX:XX:XX"
let scope = "read_homecoach"

 // copy BetterRequest from https://gist.github.com/schl3ck/2009e6915d10036a916a1040cbb680ac and save as a module in Scriptable called BetterRequest
 let BetterRequest = importModule("BetterRequest"); 
                                          
 // use it                                
 let req = new BetterRequest("https://api.netatmo.com/oauth2/token"); 
 req.method = "post";                     
 req.form = {                             
    "grant_type": "password",
    "client_id": clientId,
    "client_secret": clientSecret,
    "username": username,
    "password": password,
    "scope": scope                            
 };                                       
 let res = await req.loadJSON();          
// QuickLook.present(res)
let accessToken = res['access_token'];
// QuickLook.present(accessToken)

 let reqHome = new BetterRequest("https://api.netatmo.com/api/homestatus?home_id=" + homeId); 
 reqHome.method = "get";                     
 reqHome.headers = { "Authorization": "Bearer " + accessToken};      
 log(reqHome.headers)                                 
 let resHome = await reqHome.loadJSON(); 
//  QuickLook.present(resHome)
 let setPoint = resHome.body.home.rooms[0].therm_setpoint_temperature;
 log(setPoint)
 let measuredPoint = resHome.body.home.rooms[0].therm_measured_temperature;
 log(measuredPoint)
 

let mode = heatMode(setPoint, measuredPoint)
log(mode)


function heatMode(i,j) {
  if (i < j) {
    return "Off";
  }
  return "Set to " + setPoint + "°C";
}


//  let co2 = resAir.body.devices[0].dashboard_data.CO2;
//  log(co2)
// const co2Text = co2 + ' ppm'
// log(co2Text)
//  let humidity = resAir.body.devices[0].dashboard_data.Humidity;
// const humidText = humidity + "%"
//  log(humidText)
// 

 let reqAir = new BetterRequest("https://api.netatmo.com/api/gethomecoachsdata?device_id=" + encodeURIComponent(macId)); 
 reqAir.method = "get";                     
 reqAir.headers = { "Authorization": "Bearer " + accessToken};      
 log(reqAir.headers)                                 
 let resAir = await reqAir.loadJSON(); 
let time = resAir.body.devices[0].dashboard_data.time_utc;
 log(time)

var date = new Date(time * 1000);

var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();

console.log(year + "-" + month + "-" + day + " " + addZero(hours) + ":" + addZero(minutes) + ":" + seconds);
const timeText = '' + addZero(hours) + ":" + addZero(minutes)
log(timeText)
 let co2 = resAir.body.devices[0].dashboard_data.CO2;
 log(co2)
const co2Text = co2 + ' ppm'
log(co2Text)
 let humidity = resAir.body.devices[0].dashboard_data.Humidity;
const humidText = humidity + "%"
 log(humidText)


// Create widget
let widget = await createWidget()

// Update the widget with the output of the script or present
// a preview if the script was run

if (config.runsInWidget) {

  Script.setWidget(widget)

} else {

  widget.presentSmall()

}
Script.complete()

async function createWidget() {

  // Create widget
  let widget = new ListWidget();

  // Widget color
  let gradient = new LinearGradient()

  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("1c1c1e"),
    new Color("0c0c0e")
  ]

  widget.backgroundGradient = gradient;
  
//   widget.setPadding(16, 16, 16, 0)

  // Title stack
  let titleStack = widget.addStack()
  let titleIcon = SFSymbol.named('house.fill')
  titleIcon.applyMediumWeight()
  let titleIconElement = titleStack.addImage(titleIcon.image)
  titleIconElement.imageSize = new Size(17, 19)
    titleIconElement.tintColor = Color.white()
  titleStack.addSpacer(6)  
  let titleElement = titleStack.addText('Indoor air')
  titleElement.textColor = Color.white()
  titleElement.font = Font.boldRoundedSystemFont(16)
  titleStack.addSpacer()

  widget.addSpacer()

  // Battery stack
  let batteryStack = widget.addStack()

  // Battery icon
  let boltIcon = SFSymbol.named('thermometer');
  let boltIconElement = batteryStack.addImage(boltIcon.image)
  boltIconElement.imageSize = new Size(15, 15)
  batteryStack.addSpacer(8)

  // Set color based on charging state
  if (mode === "Off") {
    boltIconElement.tintColor = Color.white()
  } else {
    boltIconElement.tintColor = Color.orange()
  }

  let batteryElement = batteryStack.addText(mode)
  batteryElement.textColor = Color.white()
  batteryElement.font = Font.mediumRoundedSystemFont(14)
  widget.addSpacer()

  // Range stack
  let rangeStack = widget.addStack()

  let rangeIcon = SFSymbol.named('wind.snow');
  let rangeIconElement = rangeStack.addImage(rangeIcon.image)
  rangeIconElement.imageSize = new Size(15, 15)
  rangeIconElement.tintColor = Color.white()
  rangeStack.addSpacer(8)

  let rangeElement = rangeStack.addText(co2 + ' ppm')
  rangeElement.textColor = Color.white()
  rangeElement.font = Font.mediumRoundedSystemFont(14)

  widget.addSpacer()

  // Humidy stack
  let humidStack = widget.addStack()

  let humidIcon = SFSymbol.named('drop.triangle.fill');
  let humidIconElement = humidStack.addImage(humidIcon.image)
  humidIconElement.imageSize = new Size(15, 15)
  humidIconElement.tintColor = Color.white()
  humidStack.addSpacer(8)

  let humidElement = humidStack.addText(humidity + "%")
  humidElement.textColor = Color.white()
  humidElement.font = Font.mediumRoundedSystemFont(14)

  widget.addSpacer()

  

// Last updated stack
  let lastUpdatedStack = widget.addStack()
  let currentDate = new Date()
  let lastUpdated = currentDate.toLocaleString("default", {
//     month: 'short',
//     day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
  let lastUpdatedElement = lastUpdatedStack.addText(timeText)
  lastUpdatedElement.textColor = Color.white()
  lastUpdatedElement.font = Font.mediumRoundedSystemFont(10)

  return widget
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}