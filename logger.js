const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs.txt');

function formatLine(eventName, data) {
  const time = new Date().toISOString();
  const payload = data === undefined ? '' : JSON.stringify(data);
  return `[${time}] ${eventName}: ${payload}\n`;
}

function writeLog(eventName, data) {
  fs.appendFile(LOG_FILE, formatLine(eventName, data), (err) => {
    if (err) {
      console.error('Logger write error:', err.message);
    }
  });
}

function setupLogger(app) {
  app.on('server:started', (port) => {
    writeLog('server:started', { port });
  });

  app.on('server:stopped', () => {
    writeLog('server:stopped', {});
  });

  app.on('request:received', (info) => {
    writeLog('request:received', info);
  });
}

module.exports = { setupLogger };
