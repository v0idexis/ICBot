const axios = require("axios");
const getPriceCrypto = async (coin) => {
  var mainconfig = {
    method: "get",
    url: "https://public.coindcx.com/market_data/current_prices",
  };
  var t = "t";
  await axios.request(mainconfig).then((res) => {
      console.log("here");
      var cc = coin;
      var cc1 = cc.toUpperCase() + "INR";
      var cc2 = cc.toUpperCase() + "USDT";
      var cc3 = cc.toUpperCase() + "BTC";
      var kprice = res.data[cc2];
      var iPrice = res.data[cc1];
      var bPrice = res.data[cc3];
      
      if (kprice) {
        console.log('if block');
        var w = `*${cc2}* = $${Number(kprice)}
                        *${cc1}* = ₹${Number(iPrice)}
                        *${cc3}* = ${Number(bPrice)}`;

        
        t=''+w;
        console.log(t);
        
      }else{
          t = "coin not found";
      }
    }).catch((err) => {
      console.log("not working");
      t="catch"
     });
     return t;
};


// const CryptoMmi = async() =>{
//     var config={
//         method:'GET',
//         url:'https://api.alternative.me/fng/?limit=1'
//     }
//     let fearIndex;
//     await axios.request(config).then((res)=>{
//             if(res<=20){
//                 fearIndex=`Current MMI = ${res}
// High extreme fear zone (<20) suggests a good time to open fresh positions as markets are likely to be oversold and might turn upwards.`;
//             }else if(res>20 && res<=50){
//                 fearIndex=`Current MMI = ${res}
// Fear zone suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`;
//             }else if(res>50 && res<=80){
//                 fearIndex=`Current MMI=${res}
// Greed zone suggests that investors are acting greedy in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`;
//             }else {
//                 fearIndex=`Current MMI=${res}
// High extreme greed zone (>80) suggests to be cautious in opening fresh positions as markets are overbought and likely to turn downwards.`;
//             }
//     }).catch((err)=>{
//         fearIndex=`Not working`;
//     })
//     return fearIndex;
// }
module.exports={
  getPriceCrypto
  //CryptoMmi
}