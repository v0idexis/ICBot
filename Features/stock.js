const yahooStockPrices = require("yahoo-stock-prices");
const daaa = async (sto) => {
	const ganu = await yahooStockPrices.getCurrentData(`${sto}`);//sto=args[0]
	console.log(ganu);
	var s = `*STOCK* :- _${sto}_
*Currency* :- _${ganu.currency}_                   
*Price*:- _${ganu.price}_`;
	return s;
}; // { currency: 'USD', price: 132.05 }
module.exports={
	daaa
}
