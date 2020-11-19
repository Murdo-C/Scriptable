// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: chart-line;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: book; share-sheet-inputs: plain-text;
// Stock Ticker Widget
let stocksInfo = await getStockData()
let widget = await createWidget()
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
  
  let upticker = SFSymbol.named("chevron.up");
  let downticker = SFSymbol.named("chevron.down");
 
  let widget = new ListWidget()
  // Add background gradient
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("32323d"),
    new Color("32323d")
  ]
  widget.backgroundGradient = gradient
  
  let redColor = new Color("EB5494")
  let greenColor = new Color("75FBDE")

  for(j=0; j<8; j++)
  {
   
    let currentStock = stocksInfo[j];
    let nextStock = stocksInfo[j+1];
    let row1 = widget.addStack();
    // Add Stock Symbol
    let stockSymbol = row1.addText(currentStock.symbol);
    stockSymbol.textColor = Color.white();
    stockSymbol.font = Font.boldMonospacedSystemFont(12);
   
    //Add Today's change in price
    row1.addSpacer();
    let changeValue = row1.addText(currentStock.changepercent+"%");
    if(currentStock.changepercent < 0) {
      changeValue.textColor = redColor;
    } else {
      changeValue.textColor = greenColor;
    }
    changeValue.font = Font.boldMonospacedSystemFont(12);
    
    // Add Ticker icon
    row1.addSpacer(2);
    let ticker = null;
    if(currentStock.changevalue < 0){
      ticker = row1.addImage(downticker.image);
      ticker.tintColor = redColor;
    } else {
      ticker = row1.addImage(upticker.image);
      ticker.tintColor = greenColor;
    }
       
    ticker.imageSize = new Size(8,8);
   
    widget.addSpacer(2);
   
  }
  return widget
}

async function getStockData() { 
  let stocks = null;
// Read from WidgetParameter if present or use hardcoded values
// Provide values in Widget Parameter as comma seperated list  
  if(args.widgetParameter == null) {
    stocks = ["SNAP", "PTON", "ZM", "TSLA", "AAPL", "ETSY", "CVNA", "DOCU", "SHOP", "SQ", "FSLY", "GOOGL", "NFLX", "AMZN", "SPOT", "IPOC"];
  } else {
    stocks = args.widgetParameter.split(",");
  }
 
  let stocksdata = [];
  for(i=0; i< stocks.length; i++)
  {
    let stkdata = await queryStockData(stocks[i].trim());
    let price = stkdata.quoteSummary.result[0].price;
    let priceKeys = Object.keys(price);
 
    let data = {};
    data.symbol = price.symbol;
    data.changepercent = (price.regularMarketChangePercent.raw * 100).toFixed(2);
    data.changevalue = price.regularMarketChange.raw.toFixed(2);
    data.price = price.regularMarketPrice.raw.toFixed(2);
    data.high = price.regularMarketDayHigh.raw.toFixed(2);
    data.low = price.regularMarketDayLow.raw.toFixed(2);
    data.prevclose = price.regularMarketPreviousClose.raw.toFixed(2);
    data.name = price.shortName;
    stocksdata.push(data);
   
  }
  return stocksdata;
}

async function queryStockData(symbol) {
  let url = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + symbol + "?modules=price"
  let req = new Request(url)
  return await req.loadJSON()
}