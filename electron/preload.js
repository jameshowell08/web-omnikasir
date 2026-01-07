const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Add any needed IPC methods here
    // example: send: (channel, data) => ipcRenderer.send(channel, data),
});
