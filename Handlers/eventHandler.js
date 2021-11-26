const { conn } = require('../index');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const fs = require('fs');

const HandleEvent = async (event) => {
    try {
        const mdata = await conn.fetchGroupMetadataFromWA(event.jid)
     const   num = event.participants[0]
       const num_split = `${num.split('@s.whatsapp.net')[0]}`
        if (event.action == 'add') {
            let text = `${mdata.subject}\n\n💎 *Group Description:*\n${mdata.desc}\n\nHope you follow the rules and have fun!\n*‣${event.participants.map((jid) => `@${jid.split('@')[0]}`).join(', ')}* `
            try {
                if(event.action == 'add'){
                    let image = await conn.getProfilePicture(event.jid) ||fs.readFileSync('./assets/404.png')
                    if(typeof image === 'string') image = (await axios.get(image,{responseType : "arraybuffer"})).data
            }
            } catch (error) {
                let image = fs.readFileSync('./assets/neko.png');
                conn.sendMessage(event.jid,image,MessageType.image,{contextInfo:{mentionedJid : [num]},mimetype: Mimetype.png, caption:text})
            }
           
        } else if (event.action == 'remove'){
            let text = `*@${event.participants[0].split('@')[0]}* has left the chat 👋`
            conn.sendMessage(event.jid,text,MessageType.text,{contextInfo :{ mentionedJid: [num] }});


        }
    } catch (e) {
        console.log(e)
    }
};

module.exports = HandleEvent
