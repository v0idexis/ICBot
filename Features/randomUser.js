const axios = require('axios');


const getuser = async()=>{

    try {
   
        const data = axios.get('https://randomuser.me/api')
    const res = await data
    const user = res.data.results
    const mr = user[0].name.title
    const midname = user[0].name.first
    const lastname = user[0].name.last
    return {mr,midname,lastname}



    } catch (error) {
        console.error(error)
    }

   
}
getuser();

module.exports = {getuser}