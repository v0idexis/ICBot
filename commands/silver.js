const axios = require("axios");
const cheerio = require("cheerio");

class Command {
  constructor() {
    this.command = "silverpr"; // command goes here
  }
  run = async (M) => {
    const silverURL = "https://www.policybazaar.com/silver-rate/";
    try {
      const { data } = await axios.get(silverURL);
      const $ = cheerio.load(data);

      // const sitetitle = $("title").text().slice(0, 55);
      const LastRefreshed = $(".boxyWrap")
        .find(".goldyBox")
        .find(".lastUpdate")
        .html();

      // const perGram = $(".boxyWrap").find(".flatgray").find(".wd50").html();
      const perGramprice = $(".boxyWrap")
        .find(".flatgray")
        .find(".right")
        .html();
      // const perKilo = $(".boxyWrap").find(".last").find(".wd50").html();
      const perKiloPrice = $(".boxyWrap").find(".last").find(".right").html();

      let srate = `*Silver Price in India, today*\n\n1 gram : ${perGramprice}\n1 Kg : ${perKiloPrice}\n\nLast Refreshed : ${LastRefreshed}`;
      console.log(srate);
      M.reply(srate);

      // conn.reply(m.chat,`${sitetitle}\n ${perGram} : ${perGramprice}\n${perKilo}:${perKiloPrice}/n last refreshed : ${LastRefreshed} `,m)
    } catch (error) {
      M.reply("something went wrong");
      console.log(error);

      return error;
    }
  };
}
module.exports = Command;
