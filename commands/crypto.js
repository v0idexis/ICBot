class Command {
  constructor() {
    this.command = "crypto"; // command goes here
  }
  run = async (M) => {
    var mainconfig = {
      method: "get",
      url: "https://public.coindcx.com/market_data/current_prices",
    };
    var t = "t";
    await axios
      .request(mainconfig)
      .then((res) => {
        console.log("here");
        var cc = coin;
        var cc1 = cc.toUpperCase() + "INR";
        var cc2 = cc.toUpperCase() + "USDT";
        var cc3 = cc.toUpperCase() + "BTC";
        var kprice = res.data[cc2];
        var iPrice = res.data[cc1];
        var bPrice = res.data[cc3];

        if (kprice) {
          console.log("if block");
          var w = `*${cc2}* = $${Number(kprice)}
                        *${cc1}* = ₹${Number(iPrice)}
                        *${cc3}* = ${Number(bPrice)}`;

          t = "" + w;
          console.log(t);
        } else {
          t = "coin not found";
        }
      })
      .catch((err) => {
        console.log("not working");
        t = "catch";
      });
    M.reply(t);
  };
}
module.exports = Command;
