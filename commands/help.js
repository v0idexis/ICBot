
class Command {
    constructor(){
this.command = 'hi' // command goes here
    }
    run = async(M)=>{
        const str = `  ⚖️IC BOT⚖️
    💵Crypto
    note : sends you crypto values
    \n💶Crypto_mmi
    note : sends you values of crypto mmi
    \n💠Stock
    note : sends you stock market details
    \n🌐Stock_mmi
    note : sends you stock mmi details
    \n🔰Volatility
    note : sends you volatility of market index
    \n🥇Gold
    note : sends you recent gold prices
    \n🥈 Silver
    note : sends you recent silver prices
    \n📜Exchange rate
    note : sends you exchange rates of different countries
    \n🌦️Weather
    note : sends you weather report of a particular place
    \n💰Currency codes
    note : sends you currency codes of different countries
    \n📰News
    note : sends you news according to a topic`;
    M.reply(str)
    }
}
module.exports = Command