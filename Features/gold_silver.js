const axios = require('axios');     
const cheerio = require('cheerio');


let gold = async ()=>{

    const url = "https://www.policybazaar.com/gold-rate/"
   
    
        try{
            const {data} = await axios.get(url);
            const $ = cheerio.load(data);
    
             
        const siteHeading = await $('title').text()
        const Gold24_key = $('.boxyWrap').find('.last').find('.wd50').html()
        const Gold24_price = $('.boxyWrap').find('.last').find('.right').html()
        const Gold22_key = $('.boxyWrap').find('.flatgray').find('.wd50').html()
        const Gold22_price = $('.boxyWrap').find('.flatgray').find('.right').html()
        const Last_Refreshed = $('.boxyWrap').find('.goldyBox').find('.lastUpdate').html()
        const MCX  = $('.boxyWrap').find('.mcx').html().replace('<br>','')
          
const rate = `${siteHeading}\n ${MCX} ${Gold24_key} : ${Gold24_price}\n${Gold22_key}:${Gold22_price}/n last refreshed : ${Last_Refreshed} `   
      //  conn.reply(m.chat,`${siteHeading}\n ${MCX} ${Gold24_key} : ${Gold24_price}\n${Gold22_key}:${Gold22_price}/n last refreshed : ${Last_Refreshed} `,m)
return rate

}catch(e) {

   console.error(e)
}}

const silverURL = "https://www.policybazaar.com/silver-rate/"

let silver = async() =>{

try {
    const {data} = await axios.get(silverURL);
    const $ = cheerio.load(data);


    const sitetitle = $('title').text().slice(0,55)
    const LastRefreshed= $('.boxyWrap').find('.goldyBox').find('.lastUpdate').html()

    const perGram = $('.boxyWrap').find('.flatgray').find('.wd50').html()
    const perGramprice = $('.boxyWrap').find('.flatgray').find('.right').html()
    const perKilo = $('.boxyWrap').find('.last').find('.wd50').html()
    const perKiloPrice = $('.boxyWrap').find('.last').find('.right').html()

let srate = `${sitetitle}\n ${perGram} : ${perGramprice}\n${perKilo}:${perKiloPrice}/n last refreshed : ${LastRefreshed} `
return srate

    // conn.reply(m.chat,`${sitetitle}\n ${perGram} : ${perGramprice}\n${perKilo}:${perKiloPrice}/n last refreshed : ${LastRefreshed} `,m)



} catch (error) {

    return error
    console.log(error)
}






}





module.exports = {gold,silver}

