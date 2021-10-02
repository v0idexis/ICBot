const axios  = require('axios')
module.exports.getPriceCrypto = async () =>{
    var mainconfig = {
        method: 'get',
        url: 'https://public.coindcx.com/market_data/current_prices'
    }
    console.log("here1");
    await axios.request(mainconfig).then((res)=>{
        console.log('here');
        console.log(res);

        return res;
    }).catch((err)=>{
        console.log('not working');
        return 'not working';
    })

}