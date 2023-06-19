const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.version.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});