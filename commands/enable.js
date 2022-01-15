class Command {
    constructor(){
this.command = 'enable' // command goes here
    }
    run = async(M)=>{
const value = fs.readFileSync(path.join(__dirname,'..','grpjids.json'));
          const obj = JSON.parse(value);
          obj.push(from);
          fs.writeFileSync("grpjids.json", JSON.stringify(obj));
          reply("successfully enabled");


       M.reply(`hi ${M.sender.username}`)
    }
}
module.exports = Command
