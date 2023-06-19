const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const axios = require('axios');
const path = require('path');
const https = require('https');

require('dotenv').config();

let HUE_KEY = process.env.HUE_KEY;
let HUE_IP = process.env.HUE_IP;

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


//Build new httpsClient
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});


// Respond to light request
ipcMain.on('light:toggle', (e) => {
    toggleLight();
});

ipcMain.on('light:refresh', (e) => {
    refreshLight();
})

//Build light search and refresh

function refreshLight() {
    const HEADER = {
        'hue-application-key' : `${HUE_KEY}`,
        'Content-type' : 'text/plain'
    }

    const DATA = '';

    const URL = `https://${HUE_IP}/clip/v2/resource/device`;

    axios
        .get(URL, DATA, {
            headers: HEADER,
            httpsAgent: httpsAgent
        })
        .then((response) => {
            if (response.status === 201) {
                console.log('Req body:', response.data);
                console.log('Req header : ', response.headers);
            }
        })
        .catch((e) => {
            console.error(e);
        }) 
}

//Build light toggle info 

function toggleLight () {
    console.log('Toggling lights...');
    const DATA = {
        "on": {
            "on":true
        }
    }

    const HEADER = {

            'hue-application-key' : `${HUE_KEY}`,
            'Content-Type' : 'text/plain'
    }

    const URL = `https://${HUE_IP}/clip/v2/resource/light/cb4df8c2-9653-4b9d-b124-6622b0ebcb51`

    axios
        .post(`https://${HUE_IP}/clip/v2/resource/light/cb4df8c2-9653-4b9d-b124-6622b0ebcb51`, DATA, HEADER, { httpsAgent })
        .then((response) => {
            if (response.status === 201) {
                console.log('Req body:', response.data);
                console.log('Req header : ', response.headers);
            }
        })
        .catch((e) => {
            console.error(e);
        })
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