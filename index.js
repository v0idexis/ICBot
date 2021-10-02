//WEB SERVER
const express = require('express')
const server = express()
const port = process.env.PORT || 8000;
server.get('/', (req, res) => {res.send('Blender server running...')})
server.listen(port, () => {
    console.clear()
    console.log('\nWeb-server running!\n')
})
//import section
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    processTime,
} = require('@adiwajshing/baileys')
    // LOAD DB CONNECTION
const db = require('./database');
const fs = require('fs')
const {help} = require('./Features/help');
const {getPriceCrypto,CryptoMmi} = require('./Features/crypto');
const {daa}=require('./Features/stock')
//Function section
async function fetchauth() {
    try{
    auth_result = await db.query('select * from auth;');
    console.log('Fetching login data...')
    auth_row_count = await auth_result.rowCount;
    if (auth_row_count == 0) {
        console.log('No login data found!')
    } else {
        console.log('Login data found!')
        auth_obj = {
            clientID: auth_result.rows[0].clientid,
            serverToken: auth_result.rows[0].servertoken,
            clientToken: auth_result.rows[0].clienttoken,
            encKey: auth_result.rows[0].enckey,
            macKey: auth_result.rows[0].mackey
        }
    }
    } catch {
        console.log('Creating database...')
        await db.query('CREATE TABLE auth(clientID text, serverToken text, clientToken text, encKey text, macKey text);');
        await fetchauth();
    }

}
const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}
const prefix = '/';
//MAIN Function
async function main(){

     // LOADING SESSION
     const conn = new WAConnection();
     conn.logger.level = 'warn'
     conn.on('qr', () => {console.log('SCAN THE ABOVE QR CODE TO LOGIN!')})
     await fetchauth(); //GET LOGIN DATA
     if (auth_row_count == 1) {conn.loadAuthInfo(auth_obj)}
     conn.on('connecting', () => {console.log('Connecting...')})
     conn.on('open', () => {
         console.clear()
         console.log('Connected!')
     })
     await conn.connect({timeoutMs: 30 * 1000})
     const authInfo = conn.base64EncodedAuthInfo() // UPDATED LOGIN DATA
     load_clientID = authInfo.clientID;
     load_serverToken = authInfo.serverToken;
     load_clientToken = authInfo.clientToken;
     load_encKey = authInfo.encKey;
     load_macKey = authInfo.macKey;
     // INSERT / UPDATE LOGIN DATA
     if (auth_row_count == 0) {
         console.log('Inserting login data...')
         db.query('INSERT INTO auth VALUES($1,$2,$3,$4,$5);',[load_clientID,load_serverToken,load_clientToken,load_encKey,load_macKey])
         db.query('commit;')
         console.log('New login data inserted!')
     } else {
         console.log('Updating login data....')
         db.query('UPDATE auth SET clientid = $1, servertoken = $2, clienttoken = $3, enckey = $4, mackey = $5;',[load_clientID,load_serverToken,load_clientToken,load_encKey,load_macKey])
         db.query('commit;')
         console.log('Login data updated!')
     }

     conn.on('group-participants-update', async (anu) => {
		try {
			const mdata = await conn.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				num_split = `${num.split('@s.whatsapp.net')[0]}`
                console.log('Joined: ', num)
			}
		} catch (e) {
			console.log(e)
		}
	})

    conn.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = JSON.parse(JSON.stringify(mek)).messages[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid == 'status@broadcast') return
            if (mek.key.fromMe) return
            const content = JSON.stringify(mek.message)
            global.prefix
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const {
                text,
                extendedText,
                contact,
                location,
                liveLocation,
                image,
                video,
                sticker,
                document,
                audio,
                product
            } = MessageType
           
             body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)


            const botNumber = conn.user.jid
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false

            const reply = (teks) => {
                conn.sendMessage(from, teks, text, {
                    quoted: mek
                })
            }

            const costum = (pesan, tipe, target, target2) => {
                conn.sendMessage(from, pesan, tipe, {
                    quoted: {
                        key: {
                            fromMe: false,
                            participant: `${target}`,
                            ...(from ? {
                                remoteJid: from
                            } : {})
                        },
                        message: {
                            conversation: `${target2}`
                        }
                    }
                })
            }

            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            if (isCmd && isGroup) console.log('[COMMAND]', command, '[FROM]', sender.split('@')[0], '[IN]', groupName)
           
            switch(command){
                case 'hello':{
                    reply(`hello`);
                    break;
                }
                case 'help':{
                    const s = await help();
                    console.log(s);
                    conn.sendMessage(from,s,MessageType.text);
                    break;
                }
                case 'crypto':{
                    var coin = args[0];
                   const s1=await getPriceCrypto(coin);
                   reply(`${s1}`);
                   break;
                }


                case 'stocks':
                    const sT=await daa(args[0]);
                    reply(`*STOCK* :-_${args[0]}_
                    *Currency* :-_${sT.currency}_                   
                    *Price*:-_${sT.price}_                   `
                    )
                    break;

                
                case 'crypto_mmi':{
                    await conn.sendMessage(
                        from, 
                        { url: `https://alternative.me/crypto/fear-and-greed-index.png` }, // send directly from remote url!
                        MessageType.image, 
                        { mimetype: Mimetype.png, caption: "~ICBot",quoted: mek }
                    );
                    const s2 = await CryptoMmi();
                    reply(`${s2}`);
                    break;
                }
            }
        }catch(e){
            console.log('Error : %s', e)
        } 
    });
}
main();