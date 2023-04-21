const { app, BrowserWindow,ipcMain  } = require('electron');
const path = require('path');
const fs = require('fs');
const ini = require('ini');
const WebSocket = require('ws');
const ip = require("ip");

//lets see if the config is here

function checkConfig() {
  const fileData = fs.readFileSync(process.env.LOCALAPPDATA + '/Ragnarock/Saved/Config/WindowsNoEditor/Game.ini',{encoding:'utf8'});
  var config = ini.parse(fileData);
  console.log('file ', fileData, config);
  console.log('ip', ip.address());
  return false;
}


function createWindow() {
  const mainWindow = new BrowserWindow({
    /*transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      devTools: false
    },*/
    transparent: true,
    frame: false,
    resizable: true,
    hasShadow: false,
    webPreferences: {
      devTools: true
    },
    x:0,
    y:0,
    //width:550,
    //height:400,
    fullscreen :true,
    alwaysOnTop:true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  mainWindow.setIgnoreMouseEvents(true);
 // ipcMain.handle('ping', () => 'pong');

  ipcMain.on('mainevent', (event, title) => {
    console.log('mainevent', event, title);
  })


  checkConfig();

  const webSocketServer = new WebSocket.Server({ port: 8033 });
  webSocketServer.on('connection', (webSocketConnection) => {
    console.log('Received connection from UE4 WebSocket client.');
    webSocketConnection.on('message', (message) => {
      console.log('Received message from UE4 WebSocket client: %s.', message);
      jsonmessage = JSON.parse(message);
      mainWindow.webContents.send('wsmessage', jsonmessage);
    });

    webSocketConnection.send('{"event": "welcome", "data": "welcome message data"}');
  });

  mainWindow.loadFile('public/index.html');
  //mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') app.quit()
})

