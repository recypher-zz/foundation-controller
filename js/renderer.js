const form = document.querySelector('#light-form');

function toggleLight() {
    ipcRenderer.send('light:toggle');
}


form.addEventListener('submit', toggleLight);