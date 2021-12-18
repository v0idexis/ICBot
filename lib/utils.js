const axios = require('axios');


const get = {
    json : async(link) =>(await axios.get(link)).data,
    buffer: async(link)=>(await axios.get(link,{responseType:'arraybuffer'})).data
}



const parsedargs = (args) =>{

    return {
        joined : args.join('').trim()

    }
}

module.exports = {
    get,
    parsedargs
}
