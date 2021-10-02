const yahooStockPrices = require("yahoo-stock-prices");
const daaa = async (sto) => {
	var s='';
 await yahooStockPrices.getCurrentData(`${sto}`).then((res)=>{
		console.log(res);
	 s = `*STOCK* :- _${sto}_
*Currency* :- _${res.currency}_                   
*Price*:- _${res.price}_`;
	}).catch((err)=>{
		s='Not Found';
	});
	return s;
}; 
module.exports={
	daaa
}
