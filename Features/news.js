const axios = require("axios");
const shortUrl = require("node-url-shortener");
const newsapi = process.env.NEWS_API;
const api = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${newsapi}`;

const getnews = async () => {
  try {
    const res = await axios.get(api);
    const data = await res.data;

    const article1 = await res.data.articles[1];
    const img = await article1.urlToImage;

    let news = ``;

    for (let i = 1; i <= 10; i++) {
      var article = await res.data.articles[i];
      var title = await article.title;
      var lurl = await article.url;
      var url = shortUrl.short(lurl, function (err, url) {
        console.log(url);
      });
      news += `${title}\nlink : ${url}\n\n`;
    }
    return [news, img];
  } catch (error) {
    console.error(error);
  }
};
getnews();
module.exports = { getnews };
