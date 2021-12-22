const axios = require('axios');

class Command {
    constructor(){
this.command = 'cryptommi' // command goes here
    }
    run = async(M)=>{
        var config = {
            method: "GET",
            url: "https://api.alternative.me/fng/?limit=1",
          };
          var fearIndex;
          await axios
            .request(config)
            .then((res) => {
              var val = res.data.data[0].value;
              if (val <= 20) {
                fearIndex = `Current MMI = ${val}
        High extreme fear zone (<20) suggests a good time to open fresh positions as markets are likely to be oversold and might turn upwards.`;
              } else if (val > 20 && val <= 50) {
                fearIndex = `Current MMI = ${val}
        Fear zone suggests that investors are fearful in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`;
              } else if (val > 50 && val <= 80) {
                fearIndex = `Current MMI=${val}
        Greed zone suggests that investors are acting greedy in the market, but the action to be taken depends on the MMI trajectory. See all zones for details`;
              } else {
                fearIndex = `Current MMI=${val}
        High extreme greed zone (>80) suggests to be cautious in opening fresh positions as markets are overbought and likely to turn downwards.`;
              }
            })
            .catch((err) => {
              fearIndex = `Not working`;
            });
          M.reply(fearIndex);
    }
}
module.exports = Command