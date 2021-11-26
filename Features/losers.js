const axios = require('axios');

const getlosers = async() =>{
    try {
    const Data = await  axios.get('https://financialmodelingprep.com/api/v3/stock/losers?apikey=de0479db838561c9b214df54a3ef3eb4')
        .then((response)=>{return response.data});

        const G = Data.mostLoserStock;

        let text = `Ticker : *${G[0].ticker}*\nChanged : *${G[0].changes}*\nPrice : *${G[0].price}*\nChanges In percentage : *${G[0].changesPercentage}*\nCompanyName : *${G[0].companyName}*       
\nTicker : *${G[2].ticker}*\nChanged : *${G[1].changes}*\nPrice : *${G[1].price}*\nChanges In percentage : *${G[1].changesPercentage}*\nCompanyName : *${G[1].companyName}*
\nTicker :*${G[2].ticker}*\nChanged :*${G[2].changes}*\nPrice : *${G[2].price}*\nChanges In percentage : *${G[2].changesPercentage}*\nCompanyName : *${G[2].companyName}*
\nTicker : *${G[3].ticker}*\nChanged :*${G[3].changes}*\nPrice : *${G[3].price}*\nChanges In percentage : *${G[3].changesPercentage}*\nCompanyName : *${G[3].companyName}*
\nTicker : *${G[4].ticker}*\nChanged :*${G[4].changes}*\nPrice : *${G[4].price}*\nChanges In percentage : *${G[4].changesPercentage}*\nCompanyName : *${G[4].companyName}*
\nTicker : *${G[5].ticker}*\nChanged :*${G[5].changes}*\nPrice : *${G[5].price}*\nChanges In percentage : *${G[5].changesPercentage}*\nCompanyName : *${G[5].companyName}*
\nTicker : *${G[6].ticker}*\nChanged :*${G[6].changes}*\nPrice : *${G[6].price}*\nChanges In percentage : *${G[6].changesPercentage}*\nCompanyName : *${G[6].companyName}*
\nTicker : *${G[7].ticker}*\nChanged :*${G[7].changes}*\nPrice : *${G[7].price}*\nChanges In percentage : *${G[7].changesPercentage}*\nCompanyName : *${G[7].companyName}*
\nTicker : *${G[8].ticker}*\nChanged :*${G[8].changes}*\nPrice : *${G[8].price}*\nChanges In percentage : *${G[8].changesPercentage}*\nCompanyName : *${G[8].companyName}*
\nTicker : *${G[9].ticker}*\nChanged :*${G[9].changes}*\nPrice : *${G[9].price}*\nChanges In percentage : *${G[9].changesPercentage}*\nCompanyName : *${G[9].companyName}*`

        return text

    } catch (error) {
        console.log(error);
        return 'sorry something went wrong'
    }
}

module.exports = getlosers;
