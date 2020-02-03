// Discord
const Discord = require("discord.js");
const general = require('./General/Browser.js');
const lists = require('./wordlists/Browser.js');
const fs = require("fs");

const client = new Discord.Client();

const cfg = require('./config.js');
const token = require('./token.js').token;

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

// On bot login
client.on("ready", () => {
  console.log("Logged in as " + client.user.username);
  client.user.setPresence({
    game: { name: 'revising' },
    status: 'online'
  });
  lists.fetch(client);
});


client.on('message', msg => { // On message sent
  msg.content = msg.content.toLowerCase(); // Makes message content lowercase and such caps work
  // TODO: remove for capitilisation?
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

  if(!found && msg.content.startsWith(cfg.messageChar)) {
    msg.react('❓');
  }
});
client.login(token);
