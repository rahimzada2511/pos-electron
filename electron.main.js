const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

const { Database } = require('./src/backend/db');

let db;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron.preload.js')
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(async () => {
  // initialize DB
  const userData = app.getPath('userData');
  if (!fs.existsSync(userData)) fs.mkdirSync(userData, { recursive: true });
  const dbPath = path.join(userData, 'pos.sqlite');
  db = new Database(dbPath);
  await db.init();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('db/backup', async (evt, targetFolder) => {
  try {
    const backupPath = await db.createBackup(targetFolder);
    return { ok: true, path: backupPath };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('show-open-dialog', async (evt, opts) => {
  const result = await dialog.showOpenDialog(opts);
  return result;
});

ipcMain.handle('db/querySample', async () => {
  try {
    const p = await db.listProducts();
    return { ok: true, products: p };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});
