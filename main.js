const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const http = require('http');
const path = require('path');

let mainWindow;

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin';

// Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Foundation Controller',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Open devtools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

// Respond to light request
ipcMain.on('light:toggle', (e) => {
    toggleLight();
});

function toggleLight () {
    var request = http.request();

    request.setHeader(['hue-application-key', '2K2USkwaF7zMvWlD0XhHkkL4KhLwMLe2yz9hTSSP'])
}

//App is ready

app.whenReady().then(() => {
    createMainWindow();

    // Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null));

    app.on('activate', () => { 
        if (BrowserWindow.getAllWindows().length === 0){
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});