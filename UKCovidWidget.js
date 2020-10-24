var today = new Date();
var dd = String(today.getDate()-1).padStart(2, '0');
var ddT = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

// Add your own lower authority, can find here by using the location dropdown: https://coronavirus.data.gov.uk/cases
const ltla = "Falkirk"

yday = yyyy + '-' + mm + '-' + dd
tday = yyyy + '-' + mm + '-' + ddT
log(yday)
log(tday)

const yday_API__URL = `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=ltla;areaName=${ltla};date=${yday}&structure=%7b%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDate%22,%22cumCases%22:%22cumCasesByPublishDate%22%7d`
const yday_API__REQ = new Request(yday_API__URL)
const yday_API__RES = await yday_API__REQ.loadJSON()

const yday__NEW_CASES = `${yday_API__RES.data[0].newCases}`
log(yday__NEW_CASES)
const yday__CUM_CASES = `${yday_API__RES.data[0].cumCases}`
log(yday__CUM_CASES)


const tday_API__URL = `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=ltla;areaName=${ltla};date=${tday};&structure=%7b%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDate%22,%22cumCases%22:%22cumCasesByPublishDate%22%7d`;

const tday_API__REQ = new Request(tday_API__URL)
const tday_API__RES = await tday_API__REQ.loadJSON()
const status = tday_API__REQ.response.statusCode;
log(status)

 if ( status >= 400 ) {
        log("URL not available yet")
        var tday__NEW_CASES = "TBC"
        log(tday__NEW_CASES)
        var tday__CUM_CASES = yday__CUM_CASES
        log(tday__CUM_CASES);
} else { 
 
        let tday__NEW_CASES = `${tday_API__RES.data[0].newCases}`
        log(tday__NEW_CASES)
        let tday__CUM_CASES = `${tday_API__RES.data[0].cumCases}`
        log(tday__CUM_CASES)
}
 
let widget = await createWidget()
if (!config.runsInWidget) {
  await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  
  const list = new ListWidget()
  
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  if(Device.isUsingDarkAppearance()){
    gradient.colors = [
      new Color("111111"),
      new Color("222222")
    ]
  } else {
    gradient.colors = [
      new Color("DDDDDD"),
      new Color("FFFFFF")
    ]
  }
  list.backgroundGradient = gradient
  
  const header = list.addText("🦠 Cases".toUpperCase())
  header.font = Font.mediumSystemFont(13)
  
  list.addSpacer()
  
  if(tday__NEW_CASES = "TBC"){  
    const mainContent = list.addStack()
    mainContent.layoutHorizontally()
    mainContent.useDefaultPadding()
    mainContent.centerAlignContent()
      const incidenceLabel = mainContent.addText(tday__NEW_CASES)
  incidenceLabel.font = Font.boldSystemFont(24)
  incidenceLabel.textColor = Color.black()
  mainContent.addSpacer(2)
  const ydayLabel = mainContent.addText("("+yday__NEW_CASES+")")
  ydayLabel.font = Font.systemFont(14)
  ydayLabel.textColor = Color.gray()
  
} else {

  const incidenceLabel = list.addText(tday__NEW_CASES)
  incidenceLabel.font = Font.boldSystemFont(24)
  incidenceLabel.textColor = Color.green()
  
}
  const totalCasesLabel = list.addText(tday__CUM_CASES + " total")
  totalCasesLabel.font = Font.boldSystemFont(16)
  
  const location = list.addText(ltla)
  location.font = Font.systemFont(10)
  location.textOpacity = 0.5
  
  return list
}