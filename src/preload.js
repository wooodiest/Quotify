const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.send('electron-store-set', key, value),
    delete: (key) => ipcRenderer.send('electron-store-delete', key),
  },
});
