const net = require('net');
const fs = require('fs');

function getDate() {
  let d = new Date();
  let rtn = `[${d.getMonth()}/${d.getDate()}/${d.getFullYear()}%${d.getHours()}:${d.getMinutes()}] `;
  return rtn;
}

function serverLog(str, cb) {
  fs.appendFile('./server.log', getDate() + str + '\n', () => {if(cb != undefined) {cb()}});
}



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