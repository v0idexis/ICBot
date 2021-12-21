const yahooStockPrices = require("yahoo-stock-prices");

class Command {
  constructor() {
    this.command = "stock"; // command goes here
  }
  run = async (M, sto) => {
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
                s =
                  "The stock specified could not be found in Indian or US exchanges, Please enter a valid ticker symbol";
                console.log(s);
              });
          });
      });
    M.reply(s);
  };
}
module.exports = Command;
