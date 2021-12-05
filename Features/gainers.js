const axios = require("axios");

const getgainers = async () => {
  try {
    const Data = await axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_analysis/gainers/niftyGainers1.json"
      )
      .then((response) => {
        return response.data;
      });

    const G = Data.data;
    let text = [];
    text.push("*Today's Gainers (NSE)* 📈⬆️");
    for (let i = 0; i < G.length; i++) {
      const array = G[i];
      const lastp = Number(array.ltp.replace(/\,/g, ""));
      const previousprice = Number(array.previousPrice.replace(/\,/g, ""));
      var change = lastp - previousprice;
      change = change.toFixed(2);
      let message = `📛Name : *${array.symbol}*\n🔖change : *${array.netPrice}%*\n🏷Change : *${change}*`
	text.push(message);
    }
    const msg = text.join("\n\n");
    return msg;
  } catch (error) {
    console.log(error);
    return "Something went wrong, please try again later.";
  }
};

module.exports = getgainers;
