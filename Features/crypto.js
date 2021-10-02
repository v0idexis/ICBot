const axios  = require('axios')
module.exports.getPriceCrypto = async (coin) =>{
    var mainconfig = {
        method: 'get',
        url: 'https://public.coindcx.com/market_data/current_prices'
    }
    await axios.request(mainconfig).then((res)=>{
        console.log(res);
        return res;
    }).catch((err)=>{
        console.log('not working');
        return 'not working';
    })

}