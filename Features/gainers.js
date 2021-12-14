const axios = require("axios");

const getgainers = async () => {
  try {
     const headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Host': 'www1.nseindia.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
        'X-Requested-With': 'XMLHttpRequest'
}
    const Data = await axios
      .get(
        "https://www1.nseindia.com/live_market/dynaContent/live_analysis/gainers/niftyGainers1.json",
    { headers: headers }
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
      var changev = lastp - previousprice;
      changev = changev.toFixed(2);
      let message = `📛Name : *${array.symbol}*\n🔺Change : *${changev}* *(${array.netPrice}%)*`;
      text.push(message);
    }
    const msg = text.join("\n\n");
    return msg;
  } catch (error) {
    console.log(error);
    return "Something went wrong, please try again later.";
  }
};
console.log(getgainers());

module.exports = getgainers;
