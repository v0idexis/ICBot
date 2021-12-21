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

//Import section

const {
  WAConnection,
  MessageType,
  // Presence,
  // Mimetype,
  // GroupSettingChange,
  // MessageOptions,
  // WALocationMessage,
  // WA_MESSAGE_STUB_TYPES,
  // ReconnectMode,
  // ProxyAgent,
  // waChatKey,
  // mentionedJid,
  // processTime,
} = require("@adiwajshing/baileys");
const db = require("./database"); // Load Database connection
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const cron = require("node-cron");
const EventHandler = require("./Handlers/eventHandler");

// Import features
// const { help } = require("./Features/help");
// const { getPriceCrypto, CryptoMmi } = require("./Features/crypto");
// const { daaa, stockMMI } = require("./Features/stock");
// const weather = require("./Features/weather");
// const { scrapeVOL } = require("./Features/getvol");
// const { exr, currencycodes } = require("./Features/exchangerate");
// const { gold, silver } = require("./Features/gold_silver");
// const { getnews } = require("./Features/news");
// const getgainers = require("./Features/gainers.js");
// const getlosers = require("./Features/losers.js");


const table = process.env.SESSION;
//Function section
async function fetchauth() {
  try {
    auth_result = await db.query(`select * from ${table};`);
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
      `CREATE TABLE ${table}(clientID text, serverToken text, clientToken text, encKey text, macKey text);`
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
module.exports = { conn };
const commands = new Map();
const loadcommands = async () => {
  console.log(chalk.blueBright("loading commands..."));
  const paath = path.join(__dirname, "commands");
  const files = fs.readdirSync(paath);
  files.map(async (file) => {
    const fullpath = `./commands/${file}`;
    const cmd = new (require(fullpath))();
    console.log(cmd);
    console.log(
      chalk.cyan("loaded"),
      chalk.yellow(file),
      chalk.magenta("from"),
      chalk.green(fullpath)
    );
    commands.set(cmd.command, cmd.run);
  });
};
loadcommands();
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
    // console.clear();
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
    db.query(`INSERT INTO ${table} VALUES($1,$2,$3,$4,$5);`, [
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
      `UPDATE ${table} SET clientid = $1, servertoken = $2, clienttoken = $3, enckey = $4, mackey = $5;`,
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

      // daily 9:30 am
      cron.schedule(
        "30 9 * * *",
        async () => {
          const grp = fs.readFileSync("./grpjids.json");
          const items = JSON.parse(grp);
          console.log(items);
          for (let i = 0; i < items.length; i++) {
            conn.sendMessage(items[i], await getnews(), text);
          }
        },
        { scheduled: true, timezone: "Asia/Kolkata" }
      );
      const M = {
        reply,
        from,
        conn,
        mek,
        sender: {
          jid: sender,
          username,
        },
      };
      if (command == "") return null;
      const run = commands.get(command);
      if (!run) return reply("not found");
      await run(M, args);
    } catch (e) {
      console.log("Error : %s", e);
    }
  });
}
main();

module.exports = { conn };
