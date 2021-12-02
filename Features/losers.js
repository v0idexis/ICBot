const axios = require('axios');

const getlosers = async() =>{
    try {
    const Data = await  axios.get('https://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json')
        .then((response)=>{return response.data});

        const L = Data.data;
        let text =[]
        for(let i = 0;i<L.length;i++){
            const array = L[i];
            const ltp = Number(array.ltp.replace(/\,/g,''));
            const previousprice = Number(array.previousPrice.replace(/\,/g,''));
            var change = lastp - previousprice;
            change = change.toFixed(2);
            let message = `📛Name : *${array.symbol}*\n🔖change : *${array.netPrice}%*\n🏷Change : *${change}*`
            text.push(message)
        }
        const msg = text.join('\n')
        return msg

    } catch (error) {
        console.log(error);
        return 'sorry something went wrong'
    }
}
module.exports = getlosers;
