const axios = require("axios");
const cheerio = require("cheerio");
var url_string = "https://www.tickertape.in/market-mood-index";
const yahooStockPrices = require("yahoo-stock-prices");

const daaa = async (sto) => {
  var s = "";
  await yahooStockPrices
    .getCurrentData(`${sto}.NS`)
    .then((res) => {
      console.log(res);
      s = `*Stock Details*\n\nSymbol: ${sto}\nCurrency: ${res.currency}\nPrice: ${res.price}`;
    })
    .catch(async (err) => {
		await yahooStockPrices
		.getCurrentData(`${sto}.BO`)
		.then((res) => {
		  console.log(res);
		  s = `*Stock Details*\n\nSymbol: ${sto}\nCurrency: ${res.currency}\nPrice: ${res.price}`;
		})
		.catch(async (err) => {
			await yahooStockPrices
			.getCurrentData(`${sto}`)
			.then((res) => {
			  console.log(res);
			  s = `*Stock Details*\n\nSymbol: ${sto}\nCurrency: ${res.currency}\nPrice: ${res.price}`;
			})
			.catch((err) => {
			  s='The stock specified could not be found in Indian or US exchanges, Please enter a valid ticker symbol';
			  console.log(s);
			});
		});
    });
  return s;
};

const stockMMI = async () => {
  var stockmmi;
  try {
    const { data } = await axios.get(url_string);
    const cload = cheerio.load(data);
    val = cload(".jsx-3758077420.jsx-2597977578,.number").text();
    if (val <= 30) {
      stockmmi = `*Current MMI = ${val}*\n*Extreme Fear zone (<30)*\n\nHigh extreme Fear zone (<20) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards\nmore info: https://cutt.ly/icbsmmi`;
    } else if (val > 30 && val <= 50) {
      stockmmi = `*Current MMI = ${val}*\n*Fear zone (30-50)*\n\nIt suggests that investors are fearful in the market\nDropping from Greed to Fear means that fear is increasing in the market & investors should wait till it reaches Extreme Fear, as that is when the market is expected to turn upwards.\nComing down from Extreme fear means fear is reducing in the market. If not best, might be a good time to open fresh positions.\nmore info: https://cutt.ly/icbsmmi`;
    } else if (val > 50 && val <= 70) {
      stockmmi = `*Current MMI = ${val}*\n*Greed zone (50-70)*\n\nIt suggests that investors are acting greedy in the market\nIf MMI is coming Neutral towards Greed zone, it means greed is increasing in the market and investors should be cautious in opening new positions.\nDropping from Extreme Greed means greed is reducing in the market. More patience is suggested before looking for fresh opportunities.\nmore info: https://cutt.ly/icbsmmi`;
    } else {
      stockmmi = `*Current MMI = ${val}*\n*Extreme Greed Zone (>70)*\n\nHigh extreme greed zone (>80) suggests to be cautious in opening fresh positions as markets are overbought and likely to turn downwards.\nmore info: https://cutt.ly/icbsmmi`;
    }
    //   console.log(stockmmi);
  } catch (err) {
    console.error(err);
    stockmmi = "MMI is Down";
    //   console.log(stockmmi);
  }
  return stockmmi;
};

module.exports = {
  daaa,
  stockMMI,
};
