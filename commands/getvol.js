const axios = require("axios");
const cheerio = require("cheerio");

var url_cboevix = "https://finance.yahoo.com/quote/%5EVIX/";
var url_indvix =
  "https://www.moneycontrol.com/indian-indices/india-vix-36.html";
class Command {
  constructor() {
    this.command = "vol"; // command goes here
  }
  run = async (M) => {
    try {
      const cboeurl = await axios.get(url_cboevix);
      const $cb = cheerio.load(cboeurl.data);
      const cboevix = $cb(
        '[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]'
      ).text();
      const cboevixmove = $cb(
        '[class="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)"]'
      ).text();
      const CBOE = "CBOE VIX:\n" + cboevix + cboevixmove;
      const indurl = await axios.get(url_indvix);
      const $in = cheerio.load(indurl.data);
      const indvix = $in('[id="sp_val"]').text();
      const indvixmove = $in('[id="sp_ch_prch"]').text().trim();
      const INDIAVIX = "INDIA VIX:\n" + indvix + indvixmove;
      M.reply(CBOE + "\n" + INDIAVIX);
      // return [CBOE,INDIAVIX]
    } catch (err) {
      console.error(err);
      M.reply("Volatility is Down");
      console.log("Volatility is Down");
    }
  };
}
module.exports = Command;
