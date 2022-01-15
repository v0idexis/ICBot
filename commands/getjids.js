const fs = require('fs');
const path = require('path');
class command {
    constructor(){
this.command = 'grpjids' // command goes here
this.aliases = ['gj']
    }
    run = async(m)=>{
     const jids = fs.readFileSync(path.join(__dirname,'grpjids.json'));

       m.reply(JSON.stringify(JSON.parse(jids)))
    }
}
module.exports = command
