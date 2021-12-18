
class Command {
    constructor(){
this.command = 'hi' // command goes here
    }
    run = async(M)=>{
       M.reply(`hi ${M.sender.username}`)
    }
}
module.exports = Command