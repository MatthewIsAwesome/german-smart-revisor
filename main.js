// Discord
const Discord = require("discord.js");
const general = require('./General/Browser.js');
const fs = require("fs");

const client = new Discord.Client();

const cfg = require('./config.js');
const token = require('./token.js').token;
//const helpResponse = "You broke something dm me with what you did (Etch-a-sketch#6122)"; //Now LEGACY

// Gets all methods of an object
const getAllMethods = (obj) => {
    let props = [];
    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) =>
                typeof obj[p] === 'function'  //only the methods
            );
        props = props.concat(l);
    }
    while (
        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
    );

    return props;
}

// TODO: Should be moved back to logging - LEGACY.js

// NOTE:  MSGlog function : not done in logging.js
function MSGlog(msg, server, name, time, chan) { // Log message to console and file
  output = "Server: "+server+",Channel: "+chan+",Username "+name+",Time: "+time+",Message: "+msg+"\n";
  if(cfg.debugLevel >= 2){
    console.log("[INFO] Logging: "+output);
  }
  var serverTxt = "./Servers/Logs/" + server + ".txt"
  if (fs.existsSync(serverTxt) == false) { // Check if file exists, if not, create it.
    files.create_file(serverTxt);
  }
  fs.appendFileSync(serverTxt, output);
}

function getUserFromMention(mention) { // Self explanatory
  mention = String(mention).slice(2, -1);
  return client.users.get(mention);
}

client.on("ready", () => { // On ready
  console.log("Logged in as " + client.user.username);
  client.user.setPresence({
    game: { name: 'Indev' },
    status: 'online'
  });
  client.userData = require('./userData.json');
  client.serverData = require('./serverData.json')
  console.log("[INFO] Userdata: "+JSON.stringify(client.userData));
});


client.on('message', msg => { // On message sent
  if (msg.author.bot == true) {
    //
  } else if (msg.guild == undefined) {
    msg.channel.send(":x: Please send me messages in a server");
  } else {
  msg.content = msg.content.toLowerCase(); // Makes message content lowercase and such caps work.

  if(client.serverData[msg.guild.id] == undefined) {
    // DEBUG: console.log("No serverdata");
    client.serverData[msg.guild.id] = gcfg.defaultServerData;
  }

  if (client.userData[msg.author.id] == undefined) {
    // DEBUG: console.log("No userdata");
    client.userData[msg.author.id] = gcfg.defaultUserData;
  }

  // Pulls in both sets of commands for general and games recursively
  found = false;
  // General commands
  Object.entries(general).forEach(function(command) {
    command[1].aliases.forEach(function(alias) {
      if(msg.content.split(' ')[0] == (cfg.messageChar + alias)) { // TODO: Allow the bot to be mentioned to trigger commands and allow servers to set own message character/emoji (also ! is  not a good default)
        command[1].main(msg, client);
        found = true;
      }
    })
  })

  /*if(!found && msg.content.startsWith(cfg.messageChar)) {
    let reaction = Discord.MessageReaction = await message.react('💰');
    let reactionUsers = await reaction.fetchUsers();
    setTimeout(function() {
      msg.channel.send("```"+JSON.stringify(reaction)+"```");//reaction.remove(client)
    }, 5*//*000*//*); // On unrecognised command
  }*/


  fs.writeFile('./serverData.json', JSON.stringify(client.serverData, null, 4), function(err, result) {if(err) console.log('error', err)}); // update userdata
  fs.writeFile('./userData.json', JSON.stringify(client.userData, null, 4), function(err, result) {if(err) console.log('error', err)}); // update userdata
}});
client.login(token);
