const fs = require('fs');

class command {
    constructor(){
this.command = 'grpjids' // command goes here
this.aliases = ['gj']
    }
    run = async(m)=>{
     const jids = fs.readFileSync('../../grpjids.json');

       m.reply(JSON.stringify(JSON.parse(jids)))
    }
}
module.exports = command
