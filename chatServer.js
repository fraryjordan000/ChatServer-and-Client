const net = require('net');
const fs = require('fs');
let users = [];

function closed() {
  for(let i in users) {
    if(users[i].readable != true) {
      let tmp = users[i].name + ' has left the chat';
      console.log(tmp);
      broadcast(tmp);
      serverLog(tmp);
      users.splice(i, 1);
    }
  }
}

function broadcast(str, excludeID) {
  for(let i in users) {
    if(excludeID != undefined && users[i].id == excludeID) {
      continue;
    }
    try {
      users[i].client.write(str);
    } catch {
      console.log('Problem broadcasting');
    }
  }
  serverLog(str);
}

function post(str, id) {
  let usr;
  for(let i in users) {
    if(users[i].id == id) {
      usr = users[i].name;
      break;
    }
  }
  let msg = `[${usr}]: ${str}`;
  broadcast(msg);
}

function getDate() {
  let d = new Date();
  let rtn = `[${d.getMonth()}/${d.getDate()}/${d.getFullYear()}%${d.getHours()}:${d.getMinutes()}] `;
  return rtn;
}

function serverLog(str, cb) {
  fs.appendFile('./server.log', getDate() + str + '\n', () => {if(cb != undefined) {cb()}});
}

let server = net.createServer(client => {
  let id = users.length+1;
  client.write('[server]: Welcome to the app!\n');
  client.setEncoding('utf-8');

  client.on('data', data => {
    data = data.toString();
    tmp = data.split(' ');
    if(tmp[0] == '/msg') {
      
    } else {
      post(data, id);
    }
  });

  client.on('close', () => {
    closed();
  });
  users.push({
    id: users.length+1,
    name: 'Client ' + (users.length+1),
    client: client
  });
  console.log(users[users.length-1].name + ' has entered the chat');
  broadcast(users[users.length-1].name + ' has entered the chat');
}).listen(5000);

serverLog('Server Started');

let exiting = false;
process.on('SIGINT', () => {
  if(!exiting) {
    serverLog('Server Terminated', () => {
      process.exit();
    });
    exiting = true;
  }
});

console.log(`Listening on port 5000`);