const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  windowControl: (action) => {
    if (['minimize', 'maximize', 'close'].includes(action)) {
      ipcRenderer.send(`window-${action}`);
    }
  },
  verifyPasskey: (payload) => ipcRenderer.invoke('usafe-passkey-verify', payload),
});
