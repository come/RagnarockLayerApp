console.log('oooo');

const { contextBridge,ipcRenderer} = require('electron');



contextBridge.exposeInMainWorld('ragnarockApi', {
  chose: 'truc',
  ping: () => ipcRenderer.send('mainevent'),
  mainEvent: (event,title) => ipcRenderer.send('mainevent', event, title),
  onMessage: (callback) => ipcRenderer.on('wsmessage', callback)
});


