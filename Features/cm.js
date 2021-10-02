const axios = require("axios");
module.exports.CryptoMmi = async ()=>{
        var config={
            method:'GET',
            url:'https://api.alternative.me/fng/?limit=1'
        }
        console.log('here');
        var fearIndex;
        await axios.request(config).then((res)=>{
                if(res<=20){
                    fearIndex=`Current MMI = ${res}
    High extreme fear zone (<20) suggests a good time to open fresh positions as markets are likely to be oversold and might turn upwards.`;
                }else if(res>20 && res<=50){
                    fearIndex=`Current MMI = ${res}
    Fear zone suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`;
                }else if(res>50 && res<=80){
                    fearIndex=`Current MMI=${res}
    Greed zone suggests that investors are acting greedy in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`;
                }else {
                    fearIndex=`Current MMI=${res}
    High extreme greed zone (>80) suggests to be cautious in opening fresh positions as markets are overbought and likely to turn downwards.`;
                }
                console.log('here1');
        }).catch((err)=>{
            fearIndex=`Not working`;
            console.log('www')
        })
        return fearIndex;
}