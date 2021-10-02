const yahooStockPrices = require("yahoo-stock-prices");
const daaa = async (sto) => {
	const ganu = await yahooStockPrices.getCurrentData(`${sto}`);//sto=args[0]
	console.log(ganu);
	return ganu;
}; // { currency: 'USD', price: 132.05 }
module.exports={
	daaa
}
