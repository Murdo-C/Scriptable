let clientId = "XXXXXXXXX"
let clientSecret = "XXXXXXXXX"
let username = "XXXXXXXXX"
let password = "XXXXXXXXX"
let homeId = "XXXXXXXXX"
let roomId = "XXXXXXXXX"
let scope = "read_homecoach"

 // import this script                    
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

// Insert device_id where XXXXXXXXX is
 let reqAir = new BetterRequest("https://api.netatmo.com/api/gethomecoachsdata?device_id=XXXXXXXXX"); 
 reqAir.method = "get";                     
 reqAir.headers = { "Authorization": "Bearer " + accessToken};      
 log(reqAir.headers)                                 
 let resAir = await reqAir.loadJSON(); 
 // QuickLook.present(resAir)
 let time = resAir.body.devices[0].dashboard_data.time_utc;
 log(time)

var date = new Date(time * 1000);

var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();

console.log(year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
const timeText = '@ ' + hours + ":" + minutes
log(timeText)
 let co2 = resAir.body.devices[0].dashboard_data.CO2;
 log(co2)
const co2Text = 'Air quality: ' + co2
log(co2Text)

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
  
  let airTxt = w.addText(co2Text)
  airTxt.applyHeadlineTextStyling()
  airTxt.textColor = textColor
  airTxt.lineLimit = 2

  w.addSpacer(7)
  
  let timeTxt = w.addText(timeText)
  timeTxt.applyBodyTextStyling()
  timeTxt.textColor = textColor
  timeTxt.textOpacity = 0.8
  timeTxt.textSize = 12
  
  return w
}
