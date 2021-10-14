const axios = require('axios')

const {WAConnection} = require('@adiwajshing/baileys')
const conn = new WAConnection();
let weather = async (args)=>{


if(!args[0]) throw " please provide place or location name"
console.log('AHOOOO') 
console.log('lol'+`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`)
  try{

        const response = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`)





let handler = async (m, { conn, args  , usedPrefix, command })=>{


if(!args[0]) throw " please provide place or location name"
  
    try{

        const response = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args[0]}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`)

        const res = await response
        
        const name = res.data.name
        const Country = res.data.sys.country
        const Weather= res.data.weather[0].description
        const Temperature = res.data.main.temp + '°C'
        const Minimum_Temperature= res.data.main.temp_min + '°C'
        const Maximum_Temperature= res.data.main.temp_max + '°C'
        const Humidity= res.data.main.humidity + '%'
        const Wind= res.data.wind.speed + 'km/h'

        // console.log(Country)
  const wea = `
  🌸 Place: ${name}\n💮 Country: ${Country}\n🌈 Weather: ${Weather}\n🎋 Temperature: ${Temperature}\n💠 Minimum Temperature: ${Minimum_Temperature}\n📛 Maximum Temperature: ${Maximum_Temperature}\n💦 Humidity: ${Humidity}\n🎐 Wind: ${Wind}
  `
//    console.log('the weather is :'+wea)
    return wea
  
//   conn.sendMessage(from,`
//         🌸 Place: ${name}\n💮 Country: ${Country}\n🌈 Weather: ${Weather}\n🎋 Temperature: ${Temperature}\n💠 Minimum Temperature: ${Minimum_Temperature}\n📛 Maximum Temperature: ${Maximum_Temperature}\n💦 Humidity: ${Humidity}\n🎐 Wind: ${Wind}
//         `.trim())
    }catch(e){
return 'Error location not found!!!'

        

        conn.reply(m.chat,`
        🌸 Place: ${name}\n💮 Country: ${Country}\n🌈 Weather: ${Weather}\n🎋 Temperature: ${Temperature}\n💠 Minimum Temperature: ${Minimum_Temperature}\n📛 Maximum Temperature: ${Maximum_Temperature}\n💦 Humidity: ${Humidity}\n🎐 Wind: ${Wind}
        `.trim(),m)
    }catch(e){
throw 'location not found' 

console.log(e)

    }




}

module.exports = weather


}

handler.help = ['weather']
handler.tags = ['internet']
handler.command = /^(weather|wthr)$/i

module.exports = handler

