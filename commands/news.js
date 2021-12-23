const { MessageType } = require("@adiwajshing/baileys");
const axios = require("axios");
const get = require('../lib/utils');
var TinyURL = require("tinyurl");
const newsapi = process.env.NEWS_API;
const api = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${newsapi}`;

class Command {
  constructor() {
    this.command = "news"; // command goes here
  }
  run = async (M) => {
    const { conn } = M;
    try {
      const res = await axios.get(api);
      const data = await res.data;

      const article1 = await res.data.articles[0];
      const img = (await article1.urlToImage.error)
        ? "https://www.ridetraffix.com/wp-content/uploads/2019/09/TopTen.jpg"
        : article1.urlToImage;

      let news = ``;

      for (let i = 0; i <= 9; i++) {
        var article = await res.data.articles[i];
        var a_title = await article.title;
        var t_url = await article.url;
        var a_url = await TinyURL.shorten(t_url);
        if (i <= 9) {
          news += `${a_title}\nlink : ${a_url}\n\n`;
        } else {
          news += `${a_title}\nlink : ${a_url}`;
        }
      }
      conn.sendMessage(M.from, (await get.buffer(img)), MessageType.image, {
        quoted: M.mek,
        caption: news,
      });
      return [news, img];
    } catch (error) {
      M.reply("sorry,something went wrong");
      console.error(error);
    }
  };
}
module.exports = Command;
