const lightForm = document.querySelector('#light-form');
const lightRefresh = document.querySelector('#light-refresh');

function toggleLight() {
    ipcRenderer.send('light:toggle');
}

function refreshLight() {
    ipcRenderer.send('light:refresh');
}


lightForm.addEventListener('submit', toggleLight);
lightRefresh.addEventListener('submit', refreshLight);
