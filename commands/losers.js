const axios = require("axios");
class Command {
    constructor(){
this.command = 'losers' // command goes here
    }
    run = async(M)=>{
        try {
            const Data = await axios
              .get(
                "https://app.zenscrape.com/api/v1/get?apikey=828458c0-5f3d-11ec-8b46-9b2b76a91cc0&url=https://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json"
              )
              .then((response) => {
                return response.data;
              });
        
            const L = Data.data;
            let text = [];
            text.push("*Today's Losers (NSE)* 📉⬇️");
            for (let i = 0; i < L.length; i++) {
              const array = L[i];
              const lastp = Number(array.ltp.replace(/\,/g, ""));
              const previousprice = Number(array.previousPrice.replace(/\,/g, ""));
              var changev = lastp - previousprice;
              changev = changev.toFixed(2);
              let message = `📛Name : *${array.symbol}*\n🔻Change : *${changev}* *(${array.netPrice}%)*`;
              text.push(message);
            }
            const msg = text.join("\n\n");
            M.reply(msg);
          } catch (error) {
            console.log(error);
            M.reply("Something went wrong, please try again later.");
          }
    }
}
module.exports = Command