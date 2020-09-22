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

 let reqAir = new BetterRequest("https://api.netatmo.com/api/gethomecoachsdata?device_id=" + encodeURIComponent(macId)); 
 reqAir.method = "get";                     
 reqAir.headers = { "Authorization": "Bearer " + accessToken};      
 log(reqAir.headers)                                 
 let resAir = await reqAir.loadJSON(); 
//  QuickLook.present(resAir)
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

let widget = createWidget();

if (config.runsInWidget) {
    let widget = createWidget();
    Script.setWidget(widget);
    Script.complete();
}

function createWidget(item) {
  const textColor = new Color("#ffffff")
  let gradient = new LinearGradient()
  gradient.colors = [new Color("#1c1c1e"), new Color("#0c0c0e")]
  gradient.locations = [0.5, 1]

  let w = new ListWidget()
  w.backgroundGradient = gradient
  w.setPadding(10, 20, 10, 20)
  
  let header = w.addText("Indoor air")
  header.applyBodyTextStyling()
  header.textColor = textColor
  header.textSize = 14
  header.textOpacity = 0.8

  w.addSpacer(7)
      
  let airTxt = w.addText(co2Text)
  airTxt.applyHeadlineTextStyling()
  airTxt.textColor = textColor
  let airTxtSub = w.addText("CO2")
  airTxtSub.applyBodyTextStyling()
  airTxtSub.textColor = textColor
  airTxtSub.textOpacity = 0.8
  airTxtSub.textSize = 12

  w.addSpacer(7)
  
  let humidTxt = w.addText(humidText)
  humidTxt.applyHeadlineTextStyling()
  humidTxt.textColor = textColor
  let humidTxtSub = w.addText("Humidity")
  humidTxtSub.applyBodyTextStyling()
  humidTxtSub.textColor = textColor
  humidTxtSub.textOpacity = 0.8
  humidTxtSub.textSize = 12

  w.addSpacer(7)
  
  let timeTxt = w.addText(timeText)
  timeTxt.rightAlignText()
  timeTxt.applyBodyTextStyling()
  timeTxt.textColor = textColor
  timeTxt.textOpacity = 0.8
  timeTxt.textSize = 12

//   w.url = "netatmoenergy://"
  
  return w
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
