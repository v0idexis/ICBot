const yahooStockPrices = require("yahoo-stock-prices");

class Command {
    constructor(){
this.command = 'stock' // command goes here
    }
    run = async(M)=>{
        var s='';
        await yahooStockPrices.getCurrentData(`${sto}`).then((res)=>{
               console.log(res);
            s = `*STOCK* :- _${sto}_
       *Currency* :- _${res.currency}_                   
       *Price*:- _${res.price}_`;
           }).catch((err)=>{
               s='Not Found';
           });
           M.reply(s)
    }
}
module.exports = Command
