const axios = require("axios");
const cheerio = require("cheerio");
const goldURL = "https://www.policybazaar.com/gold-rate/";
const silverURL = "https://www.policybazaar.com/silver-rate/";

let gold = async () => {
  try {
    const { data } = await axios.get(goldURL);
    const $ = cheerio.load(data);
    const Gold24_key = $(".boxyWrap").find(".last").find(".wd50").html();
    const Gold24_price = $(".boxyWrap").find(".last").find(".right").html();
    const Gold22_key = $(".boxyWrap").find(".flatgray").find(".wd50").html();
    const Gold22_price = $(".boxyWrap").find(".flatgray").find(".right").html();
    const Last_Refreshed = $(".boxyWrap")
      .find(".goldyBox")
      .find(".lastUpdate")
      .html();

    const rate = `*Gold Price in India, today*\n\n${Gold24_key} : ${Gold24_price}\/tola\n${Gold22_key} : ${Gold22_price}\/tola\n1 tola = 10 grams\n\nLast Refreshed : ${Last_Refreshed}`;
    return rate;
  } catch (e) {
    console.error(e);
  }
};

let silver = async () => {
  try {
    const { data } = await axios.get(silverURL);
    const $ = cheerio.load(data);

    const sitetitle = $("title").text().slice(0, 55);
    const LastRefreshed = $(".boxyWrap")
      .find(".goldyBox")
      .find(".lastUpdate")
      .html();

    const perGram = $(".boxyWrap").find(".flatgray").find(".wd50").html();
    const perGramprice = $(".boxyWrap").find(".flatgray").find(".right").html();
    const perKilo = $(".boxyWrap").find(".last").find(".wd50").html();
    const perKiloPrice = $(".boxyWrap").find(".last").find(".right").html();

    let srate = `*Silver Price in India, today*\n\n1 gram : ${perGramprice}\n1 Kg : ${perKiloPrice}\n\nLast Refreshed : ${LastRefreshed}`;
    return srate;
  } catch (error) {
    return error;
    console.log(error);
  }
};

module.exports = { gold, silver };
