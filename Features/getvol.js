const axios = require("axios");
const cheerio = require("cheerio");

var url_cboevix = "https://finance.yahoo.com/quote/%5EVIX/";
var url_indvix = "https://www.moneycontrol.com/indian-indices/india-vix-36.html";

const scrapeVOL = async() => {
  try {
      
    const cboeurl = await axios.get(url_cboevix);
    const $cb = cheerio.load(cboeurl.data);
    const cboevix = $cb('[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]').text();
    const cboevixmove = $cb('[class="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)"]').text();
    // console.log("CBOE VIX:\n",cboevix,cboevixmove)
const CBOE = "CBOE VIX:\n" + cboevix + cboevixmove;
    console.log("\n")

    const indurl = await axios.get(url_indvix);
    const $in = cheerio.load(indurl.data);
    const indvix = $in('[id="sp_val"]').text();
    // .attr("style");
    const indvixmove = $in('[id="sp_ch_prch"]').text().trim();
    // console.log("INDIA VIX:\n",indvix,indvixmove)
    const INDIAVIX = "INDIA VIX:\n" + indvix + indvixmove;
    return [CBOE,INDIAVIX]

  } catch (err) {
    console.error(err);
    console.log("Volatility is Down")
  }
}

scrapeVOL();

module.exports = {scrapeVOL};