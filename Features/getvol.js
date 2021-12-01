const axios = require("axios");
const cheerio = require("cheerio");

var url_cboevix = "https://www.investing.com/indices/volatility-s-p-500";
var url_indvix = "https://www.investing.com/indices/india-vix";

const scrapeVOL = async () => {
  try {
    const cboeurl = await axios.get(url_cboevix);
    const $cb = cheerio.load(cboeurl.data);
    const cboevix = $cb('[data-test="instrument-price-last"]').text();
    const cboevixmove = $cb('[data-test="instrument-price-change"]').text();
    const cboevixperc = $cb(
      '[data-test="instrument-price-change-percent"]'
    ).text();
    const CBOEVIX =
      "CBOE VIX:\n" + cboevix + " " + cboevixmove + " " + cboevixperc;

    const indurl = await axios.get(url_indvix);
    const $in = cheerio.load(indurl.data);
    const indvix = $in('[data-test="instrument-price-last"]').text();
    const indvixmove = $in('[data-test="instrument-price-change"]').text();
    const indvixperc = $in(
      '[data-test="instrument-price-change-percent"]'
    ).text();
    const INDIAVIX =
      "INDIA VIX:\n" + indvix + " " + indvixmove + " " + indvixperc;

    return [CBOEVIX, INDIAVIX];
  } catch (err) {
    console.error(err);
    console.log("Unable to retrieve data, please try again later.");
  }
};

scrapeVOL();

module.exports = { scrapeVOL };
