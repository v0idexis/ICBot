//WEB SERVER
require("dotenv").config();
const express = require("express");
const server = express();
const qrImage = require("qr-image");
const port = process.env.PORT || 8000;
server.get("/", (req, res) => {
  res.send("ICBot server running...");
});
server.listen(port, () => {
  console.clear();
  console.log("\nWeb-server running!\n");
});
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
} = require("@adiwajshing/baileys");
// LOAD DB CONNECTION
const db = require("./database");
const fs = require("fs");
const { help } = require("./Features/help");
const { getPriceCrypto, CryptoMmi } = require("./Features/crypto");
const { daaa, stockMMI } = require("./Features/stock");
const weather = require("./Features/weather");
const { scrapeVOL } = require("./Features/getvol");
const path = require("path");
const { exr, currencycodes } = require("./Features/exchangerate");
const { gold, silver } = require("./Features/gold_silver");
const { getnews } = require("./Features/news");
const getgainers = require("./Features/gainers");
const chalk = require("chalk");
const cron = require("node-cron");
const EventHandler = require("./Handlers/eventHandler");
const getlosers = require("./Features/losers.js");
//Function section
async function fetchauth() {
  try {
    auth_result = await db.query("select * from auth;");
    console.log("Fetching login data...");
    auth_row_count = await auth_result.rowCount;
    if (auth_row_count == 0) {
      console.log("No login data found!");
    } else {
      console.log("Login data found!");
      auth_obj = {
        clientID: auth_result.rows[0].clientid,
        serverToken: auth_result.rows[0].servertoken,
        clientToken: auth_result.rows[0].clienttoken,
        encKey: auth_result.rows[0].enckey,
        macKey: auth_result.rows[0].mackey,
      };
    }
  } catch {
    console.log("Creating database...");
    await db.query(
      "CREATE TABLE auth(clientID text, serverToken text, clientToken text, encKey text, macKey text);"
    );
    await fetchauth();
  }
}
const getGroupAdmins = (participants) => {
  admins = [];
  for (let i of participants) {
    i.isAdmin ? admins.push(i.jid) : "";
  }
  return admins;
};
const prefix = "/";
//MAIN Function
const conn = new WAConnection();
async function main() {
  // LOADING SESSION

  conn.logger.level = "warn";
  conn.on("qr", (qr) => {
    console.log("SCAN THE ABOVE QR CODE TO LOGIN!");
    const qr_code = qrImage.image(qr, { type: "png" });
    qr_code.pipe(fs.createWriteStream("QRcode.png"));
  });
  conn.version = [3, 3234, 9]; //needed

  conn.browserDescription[0] = "ICBOT - Trading Bot";
  server.get("/auth", (req, res) => {
    res.sendFile(path.join(__dirname, "QRcode.png"));
  });
  conn.on("qr", () => {
    console.log("SCAN THE ABOVE QR CODE TO LOGIN!");
  });
  await fetchauth(); //GET LOGIN DATA
  if (auth_row_count == 1) {
    conn.loadAuthInfo(auth_obj);
  }
  conn.on("connecting", () => {
    console.log("Connecting...");
  });
  conn.on("open", () => {
    console.clear();
    console.log("Connected!");
  });
  await conn.connect({ timeoutMs: 30 * 1000 });
  const authInfo = conn.base64EncodedAuthInfo(); // UPDATED LOGIN DATA
  load_clientID = authInfo.clientID;
  load_serverToken = authInfo.serverToken;
  load_clientToken = authInfo.clientToken;
  load_encKey = authInfo.encKey;
  load_macKey = authInfo.macKey;
  // INSERT / UPDATE LOGIN DATA
  if (auth_row_count == 0) {
    console.log("Inserting login data...");
    db.query("INSERT INTO auth VALUES($1,$2,$3,$4,$5);", [
      load_clientID,
      load_serverToken,
      load_clientToken,
      load_encKey,
      load_macKey,
    ]);
    db.query("commit;");
    console.log("New login data inserted!");
  } else {
    console.log("Updating login data....");
    db.query(
      "UPDATE auth SET clientid = $1, servertoken = $2, clienttoken = $3, enckey = $4, mackey = $5;",
      [
        load_clientID,
        load_serverToken,
        load_clientToken,
        load_encKey,
        load_macKey,
      ]
    );
    db.query("commit;");
    console.log("Login data updated!");
  }
  console.log(chalk.blueBright(`CONNECTED AS ${conn.user.name}`));

  conn.on("group-participants-update", EventHandler);

  conn.on("chat-update", async (mek) => {
    try {
      if (!mek.hasNewMessage) return;
      mek = JSON.parse(JSON.stringify(mek)).messages[0];
      if (!mek.message) return;
      if (mek.key && mek.key.remoteJid == "status@broadcast") return;
      if (mek.key.fromMe) return;
      const content = JSON.stringify(mek.message);
      global.prefix;
      const from = mek.key.remoteJid;
      const type = Object.keys(mek.message)[0];
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
        product,
      } = MessageType;

      body =
        type === "conversation" && mek.message.conversation.startsWith(prefix)
          ? mek.message.conversation
          : type == "imageMessage" &&
            mek.message.imageMessage.caption.startsWith(prefix)
          ? mek.message.imageMessage.caption
          : type == "videoMessage" &&
            mek.message.videoMessage.caption.startsWith(prefix)
          ? mek.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            mek.message.extendedTextMessage.text.startsWith(prefix)
          ? mek.message.extendedTextMessage.text
          : "";
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const isCmd = body.startsWith(prefix);

      const botNumber = conn.user.jid;
      const isGroup = from.endsWith("@g.us");
      const sender = isGroup ? mek.participant : mek.key.remoteJid;
      const groupMetadata = isGroup ? await conn.groupMetadata(from) : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      const groupMembers = isGroup ? groupMetadata.participants : "";
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
      const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
      const isGroupAdmins = groupAdmins.includes(sender) || false;
      const username =
        conn.contacts[sender].notify || conn.contacts[sender].short;

      const reply = (teks) => {
        conn.sendMessage(from, teks, text, {
          quoted: mek,
        });
      };

      const costum = (pesan, tipe, target, target2) => {
        conn.sendMessage(from, pesan, tipe, {
          quoted: {
            key: {
              fromMe: false,
              participant: `${target}`,
              ...(from
                ? {
                    remoteJid: from,
                  }
                : {}),
            },
            message: {
              conversation: `${target2}`,
            },
          },
        });
      };

      const isMedia = type === "imageMessage" || type === "videoMessage";
      const isQuotedImage =
        type === "extendedTextMessage" && content.includes("imageMessage");
      const isQuotedVideo =
        type === "extendedTextMessage" && content.includes("videoMessage");
      const isQuotedSticker =
        type === "extendedTextMessage" && content.includes("stickerMessage");
      if (isCmd && isGroup)
        console.log(
          chalk.blue(`[${conn.user.name}]`.toUpperCase()),
          chalk.green("[COMMAND]"),
          chalk.yellow(command),
          "[FROM]",
          chalk.green(username),
          "[IN]",
          chalk.cyanBright(groupName)
        );
      if (!isCmd)
        console.log(
          `${chalk.blueBright("[MSG]")} from ${chalk.green(
            username
          )} in ${chalk.cyanBright(groupMetadata.subject || "[DM]")}`
        );

      if (mek.message.buttonsResponseMessage) {
        const ButtonResponse =
          JSON.parse(content).buttonsResponseMessage.selectedButtonId || "";
        console.log(ButtonResponse);
        switch (ButtonResponse) {
          case "icbot":
            reply("hellow response from button 1");
            break;
          case "icbot 2":
            reply("hii response from butt 2");
            break;
        }

        console.log("bottuon yes");
      } else if (mek.message.listResponseMessage) {
        const listResponse = JSON.parse(content).listResponseMessage.title;
        switch (listResponse) {
          case "R1":
            reply("hellow r1");
            break;
          case "R2":
            reply("elluw r2");
            break;
        }

        console.log("list button yes");
      }

      // daily 9:30 pm
      cron.schedule(
        "30 21 * * *",
        async () => {
          const grp = fs.readFileSync("./grpjids.json");
          const items = JSON.parse(grp);
          console.log(items);
          for (let i = 0; i < items.length; i++) {
            conn.sendMessage(items[i], await getgainers(), text);
          }
        },
        { scheduled: true, timezone: "Asia/Kolkata" }
      );

      switch (command) {
        case "hello": {
          reply(`hello`);
          break;
        }
        case "hi": {
          reply(`HI ${username}`);
          break;
        }
        case "help": {
          const s = await help();
          conn.sendMessage(from, s, MessageType.text);
          break;
        }

        case "news": {
          const news = (await getnews())[0];
          const imgurl = (await getnews())[1];
          await conn.sendMessage(from, { url: imgurl }, image, {
            mimetype: Mimetype.png,
            caption: news,
          });
          break;
        }
        case "crypto": {
          var coin = args[0];
          const s1 = await getPriceCrypto(coin);
          reply(`${s1}`);
          break;
        }
        case "crypto_mmi": {
          const s2 = await CryptoMmi();
          await conn.sendMessage(
            from,
            { url: "https://alternative.me/crypto/fear-and-greed-index.png" },
            image,
            { mimetype: Mimetype.png, caption: s2 }
          );          
          break;
        }

        case "stocks": {
          const s3 = await daaa(args[0].toUpperCase());
          reply(`${s3}`);
          break;
        }
        case "stock_mmi": {
          const s4 = await stockMMI();
          reply(`${s4}`);
          break;
        }
        case "weather": {
          const arguement = args[0];
          const getweather = await weather(arguement);
          reply(getweather);
          break;
        }
        case "exr": {
          if (!args[0]) reply("Please enter atlest two currency codes");
          if (args[0] && !args[1])
            reply("Please enter the second currency code");
          const arguement = args;
          const data = await exr(arguement);
          reply(data);
          break;
        }
        case "currencycodes": {
          reply(currencycodes);
          break;
        }
        case "goldpr": {
          reply(await gold());
          break;
        }
        case "silverpr": {
          reply(await silver());
          break;
        }
        case "vol": {
          const CV = (await scrapeVOL())[0];
          const IV = (await scrapeVOL())[1];
          reply(`${CV}\n${IV}`);
          break;
        }
        case "button": {
          // button example
          const rows = [
            {
              title: "R1",
              description: "Hello it's description 1",
              rowId: "rowid1",
            },
            {
              title: "R2",
              description: "Hello it's description 2",
              rowId: "rowid2",
            },
          ];
          const r = [
            { title: "R1", rowId: "rowid1" },
            { title: "R2", rowId: "rowid2" },
          ];

          const sections = [
            { title: "Shmmmm 1", rows: rows },
            { title: "Shmmmm 2", rows: r },
          ];

          const button = {
            buttonText: "help i guess!",
            description: "Hello it's list message",
            sections: sections,
            listType: 1,
          };

          conn.sendMessage(from, button, MessageType.listMessage);
          break;
        }
        case "listbutton": {
          const buttons = [
            {
              buttonId: "icbot",
              buttonText: { displayText: "butttn" },
              type: 1,
            },
            {
              buttonId: "icbot 2",
              buttonText: { displayText: "butttn 2" },
              type: 1,
            },
          ];
          const buttonMessage = {
            contentText: "hi it's button",
            footerText: "ICBot",
            buttons: buttons,
            headerType: 1,
          };
          conn.sendMessage(from, buttonMessage, MessageType.buttonsMessage);
          break;
        }
        case "eval": {
          let out;
          console.log(args.toString().replace(/\,/g, " "));
          const output =
            eval(args.toString().replace(/\,/g, " ")) ||
            "Executed JS Successfully!";
          console.log(output);
          out = JSON.stringify(output);
          reply(out);
          break;
        }

        case "enable": {
          const value = fs.readFileSync("./grpjids.json");
          const obj = JSON.parse(value);
          obj.push(from);
          fs.writeFileSync("grpjids.json", JSON.stringify(obj));
          reply("successfully enabled");
          break;
        }

        case "gainers": {
          const gainersval = await getgainers();
          conn.sendMessage(from, gainersval, MessageType.text);
          // reply(`${gainersval}`);
          break;
        }

        case "losers": {
          const losersval = await getlosers();
          conn.sendMessage(from, losersval, MessageType.text);
          // reply(`${losersval}`);
          break;
         
        }

        /////////////// ADMIN COMMANDS \\\\\\\\\\\\\\\

        case "add":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          if (!isBotGroupAdmins) return reply(errors.admin_error);
          if (args.length < 1) return;
          var num = "";
          if (args.length > 1) {
            for (let j = 0; j < args.length; j++) {
              num = num + args[j];
            }
            num = `${num.replace(/ /g, "")}@s.whatsapp.net`;
          } else {
            num = `${args[0].replace(/ /g, "")}@s.whatsapp.net`;
          }
          if (num.startsWith("+")) {
            num = `${num.split("+")[1]}`;
          }
          const response = await conn.groupAdd(from, [num]);
          get_status = `${num.split("@s.whatsapp.net")[0]}`;
          get_status = response[`${get_status}@c.us`];
          if (get_status == 400) {
            reply("_❌ ERROR: Invalid number! ❌_");
          }
          if (get_status == 403) {
            reply("_❌ ERROR: Number has privacy on adding group! ❌_");
          }
          if (get_status == 408) {
            reply("_❌ ERROR: Number has left the group recently! ❌_");
          }
          if (get_status == 409) {
            reply("_❌ ERROR: Number is already exists! ❌_");
          }
          if (get_status == 500) {
            reply("_❌ ERROR: Group is currently full! ❌_");
          }
          if (get_status == 200) {
            reply("_✔ SUCCESS: Number added to group! ✔_");
          }
          break;

        case "kick": 
          break;
        case "remove":
          break;
        case "ban":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          if (!isBotGroupAdmins) return reply(errors.admin_error);
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return;
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          if (groupAdmins.includes(`${mentioned}`) == true) return;
          if (mentioned.length > 1) {
            return;
          } else {
            conn.groupRemove(from, mentioned);
          }
          break;

        case "promote":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          if (!isBotGroupAdmins) return reply(errors.admin_error);
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return;
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          if (groupAdmins.includes(`${mentioned}`) == true) return;
          if (mentioned.length > 1) {
            return;
          } else {
            conn.groupMakeAdmin(from, mentioned);
          }
          break;

        case "demote":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          if (!isBotGroupAdmins) return reply(errors.admin_error);
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return reply("_⚠ USAGE: /demote <@mention> ⚠_");
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          if (groupAdmins.includes(`${mentioned}`) == false) return;
          if (mentioned.length > 1) {
            return;
          } else {
            conn.groupDemoteAdmin(from, mentioned);
          }
          break;

        case "chat":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          if (!isBotGroupAdmins) return reply(errors.admin_error);
          if (args.length < 1) return;
          if (args[0] == "on") {
            conn.groupSettingChange(
              from,
              GroupSettingChange.messageSend,
              false
            );
          } else if (args[0] == "off") {
            conn.groupSettingChange(from, GroupSettingChange.messageSend, true);
          } else {
            return;
          }
          break;

        case "rename":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          if (!isBotGroupAdmins) return reply(errors.admin_error);
          if (args.length < 1) return;
          get_subject = "";
          for (i = 0; i < args.length; i++) {
            get_subject = get_subject + args[i] + " ";
          }
          conn.groupUpdateSubject(from, get_subject);
          break;

        case "removebot":
          if (!isGroup) return;
          if (!isGroupAdmins) return;
          conn.groupLeave(from);
          break;
      }
    } catch (e) {
      console.log("Error : %s", e);
    }
  });
}
main();

module.exports = { conn };
