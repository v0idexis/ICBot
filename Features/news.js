const axios = require("axios");
const api =
  "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=a7eac679277542249131f57f759e5eed";

const getnews = async () => {
  try {
    const res = await axios.get(api);
    const data = await res.data;
    const article = await res.data.articles[1];
    const source = await article.source.name;
    const title = await article.title;
    const url = await article.url;
    const img = await article.urlToImage;
    const publised = await article.publisedAt;
    // console.log(article)
    let news = `${title}
        link to news : ${url}
        published at : ${publised}`;
    return [news, img];
  } catch (error) {
    console.error(error);
  }
};
getnews();
module.exports = { getnews };
