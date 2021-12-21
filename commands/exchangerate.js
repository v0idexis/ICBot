const axios = require("axios");

class Command {
  constructor() {
    this.command = "exr"; // command goes here
  }
  run = async (M, args) => {
    if (!args[0]) throw "Please enter atlest two currency codes";
    if (!args[1]) throw "Please enter atlest two currency codes";

    try {
      let api = axios.get(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${args[0]}&to_currency=${args[1]}&apikey=${alphaapi}`
      );

      let body = await api;
      let Data = body.data;
      let Realtime_EXR = Data["Realtime Currency Exchange Rate"];
      let From_currencyCODE = Realtime_EXR["1. From_Currency Code"];
      let From_currency_fullname = Realtime_EXR["2. From_Currency Name"];
      let to_currencyCODE = Realtime_EXR["3. To_Currency Code"];
      let to_currencyfullname = Realtime_EXR["4. To_Currency Name"];
      let exchangeRate = Realtime_EXR["5. Exchange Rate"];
      exchangeRate = Number(exchangeRate).toFixed(4);
      let lastRefreshed = Realtime_EXR["6. Last Refreshed"];
      let timeZone = Realtime_EXR["7. Time Zone"];
      let bidPrice = Realtime_EXR["8. Bid Price"];
      let AskPrice = Realtime_EXR["9. Ask Price"];

      let msg = `*${From_currency_fullname}* To *${to_currencyfullname}*\n\nExchanage Rate\n*1 ${From_currencyCODE} = ${exchangeRate} ${to_currencyCODE}*\n\nlast refreshed : ${lastRefreshed}`;
      M.reply(msg);
    } catch {
      // console.log(e)
      M.reply(`Wrong currency code check /currencycodes for a list of currency codes`);
    }
  };
}
module.exports = Command;
