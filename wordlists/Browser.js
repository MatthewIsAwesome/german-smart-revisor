const fs = require("fs");
const files = ["test"];

function removeItems(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
        }
    }
}

function fetch(client) {
  var words = {}

  for (file of files) {
    var content = fs.readFileSync('wordlists/'.concat(file, '.csv')).toString().split(';');
    removeItems(content, '\r\n');
    for (var i = 0; i < content.length; i++) {
       content[i] = content[i].split(",");
    }
    words = {...words, [file]: content};
  }
  client.words = words
}

function set(client, file) {
  if (file.match(/([<>:"/\\|?*])/g)) {
    return "invalid filename";
  } else {
    if (file.endsWith(".csv")) {
      file = file.slice(0, -4);
    }

  }
}

module.exports = {
  fetch,
  set
}
