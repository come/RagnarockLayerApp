console.log('oooo');

const { contextBridge,ipcRenderer} = require('electron');
const Store = require("electron-store");

const store = new Store();

contextBridge.exposeInMainWorld('configStore', {
  get: (key, defaultValue) => store.get(key, defaultValue),
  set: (key, value) => store.set(key, value)
});
contextBridge.exposeInMainWorld('ragnarockApi', {
  chose: 'truc',
  ping: () => ipcRenderer.send('mainevent'),
  mainEvent: (event,title) => ipcRenderer.send('mainevent', event, title),
  onMessage: (callback) => ipcRenderer.on('wsmessage', callback)
});


