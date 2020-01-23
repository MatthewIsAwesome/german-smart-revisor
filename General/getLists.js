const fs = require('fs');

const complex = false;
const aliases = ['get', 'all', 'getall'];

function main(msg, client) {
  words = client.words["test"];
  msg.channel.send(words);
}



module.exports = {
  aliases,
  main,
  complex
}
