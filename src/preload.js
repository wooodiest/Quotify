// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Electron Store API
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.send('electron-store-set', key, value),
    delete: (key) => ipcRenderer.send('electron-store-delete', key),
  },
});
