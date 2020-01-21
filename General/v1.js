const fs = require('fs');

const complex = false;
const aliases = ['get'];

function removeItems(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
        }
    }
}

function main(msg) {
  const words = fs.readFileSync('../wordlists/listeningJAN.csv')
    .toString()
    .split(';');
  removeItems(words, '\r\n');
  for (var i = 0; i < words.length; i++) {
     words[i] = words[i].split(",");
  }

  console.log(words);
  return words;
}



module.exports = {
  aliases,
  main,
  complex
}
