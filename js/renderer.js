
const lightForm = document.querySelector('#light-form');
const lightRefresh = document.querySelector('#light-refresh');
const form = document.querySelector('#light-form');

function toggleLight() {
    ipcRenderer.send('light:toggle');
}


function refreshLight() {
    ipcRenderer.send('light:refresh');
}


lightForm.addEventListener('submit', toggleLight);
lightRefresh.addEventListener('submit', refreshLight);
form.addEventListener('submit', toggleLight);
