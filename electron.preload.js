const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showOpenDialog: (opts) => ipcRenderer.invoke('show-open-dialog', opts),
  dbBackup: (target) => ipcRenderer.invoke('db/backup', target),
  dbQuerySample: () => ipcRenderer.invoke('db/querySample')
});
