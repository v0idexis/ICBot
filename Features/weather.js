const axios = require("axios");
const opwethapi = process.env.OPWETH_API;

let weather = async (args) => {
  if (!args[0]) throw "Please provide the name of a location";
  try {
    const response = axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=${opwethapi}`
    );
    const res = await response;
    const name = res.data.name;
    const Country = res.data.sys.country;
    const Weather = res.data.weather[0].description;
    const Temperature = res.data.main.temp + "°C";
    const Minimum_Temperature = res.data.main.temp_min + "°C";
    const Maximum_Temperature = res.data.main.temp_max + "°C";
    const Humidity = res.data.main.humidity + "%";
    const Wind = res.data.wind.speed + " km/h";
    const wea = `🗺️ *${name}, ${Country}*\n☁️ Weather: ${Weather}\n🌡️ Temp: ${Temperature}\n⬇️ Min: ${Minimum_Temperature}\n⬆️ Maximum Temp: ${Maximum_Temperature}\n💧 Humidity: ${Humidity}\n🍃 Wind: ${Wind}`;
    return wea;
  } catch (e) {
    return "The location you entered could not be found, please try again";
  }
};

module.exports = weather;
