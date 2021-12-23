class Command {
    constructor(){
this.command = 'example' // command goes here
this.aliases = ['ex','example'] // aliases to add optional
    }
    run = async(M,args)=>{
       M.reply('hi ') // function goes here
    }
}
module.exports = Command
