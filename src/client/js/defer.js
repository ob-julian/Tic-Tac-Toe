/* eslint-disable no-global-assign */
// EsLint global variables
/* global activeGameMode, themeColor, patch, OnlineMultiplayer, modal, ExperimentalLocalMultiplayer, chat, themeColor, animationSpeed*/
// EsLint exported variables
/* exported los, rematch, changeAnimationSpeed, help, pat, backButton, neu, disconnect, chatting, onBlur, onFocus, sendMsg, chatOk, tutorialJa, tutorialNein, closeModal, showAlert, anination, experimentalTutorialDisableHint, switchTheme, fadebutton */

// ttt wrapper for class based game modes
function los(index) {
    if(activeGameMode) {
        activeGameMode.makeMove(index);
    }
}

function rematch() {
    if(activeGameMode) {
        activeGameMode.rematch();
    }
}

function help() {
    if(activeGameMode) {
        activeGameMode.help();
    }
}

function tutorialJa() {
    if(activeGameMode) {
        activeGameMode.tutorialJa();
    }
}

function tutorialNein() {
    closeModal();
    document.getElementById('help').style.display = 'block';
}

function anination() {
    if(activeGameMode) {
        activeGameMode.animation();
    }
}

function neu() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.neu();
    }
}

function disconnect() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.disconnect();
    }
}

function chatting() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.chatting();
    }
}

function closeChat() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.closeChat();
    }
}

function onBlur() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.blurChatInput();
    }
}

function onFocus() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.focusChatInput();
    }
}

function sendMsg() {
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.sendChat();
    }
}

function chatOk(){
    closeModal();
    if(activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.chatOk();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function experimentalTutorialDisableHint() {
    if (activeGameMode instanceof ExperimentalLocalMultiplayer) {
        activeGameMode.disableTutorialHint();
    }
}

function backButton() {
    const hash = String(window.location.hash).replace('#', '').trim();
    let newHash = '';
    switch (hash) {
        case 'easyBot':
        case 'mediumBot':
        case 'hardBot':
            newHash = 'singleplayer';
            break;
        case 'experimental-local-multiplayer':
        case 'experimental-multiplayer':
            newHash = 'experimental-area';
            break;
        case 'singleplayer':
        case 'multiplayer':
        case '1v1':
        case 'experimental-area':
            newHash = '';
            break;
        default:
            newHash = '';
            break;
    }
    window.location.hash = newHash;
    activeGameMode = null;
}

// TODO: Rest of this


async function closeModal() {
    modal.style.display = 'none';
    document.getElementById('help').style.display = 'block';
}

window.onclick = function(event) {
    if(event.target === modal) {
        closeModal();
    }
    else if(event.target === chat) {
        closeChat();
    }
    else if(event.target === patch){
        closePatch();
    }
};

function showAlert(text, isClosable = true) {
    document.getElementById('mote').innerHTML = text;
    modal.style.display = 'block';
    if(!isClosable) {
        document.getElementsByClassName('close')[0].style.display = 'none';
    } else {
        document.getElementsByClassName('close')[0].style.display = 'block';
    }
}

function switchTheme() {
    if(themeColor === 'light') {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        themeColor = 'dark';
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        themeColor = 'light';
    }
    localStorage.setItem('themeColor', themeColor);
}

async function fadebutton(fadeOut){
    let ff;
    if(fadeOut){
        document.getElementsByClassName('slide')[0].disabled = true;
        ff = document.getElementsByClassName('moveRightElement');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('links');
        }
        ff = document.getElementsByClassName('moveLeftElement');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('recht');
        }
        ff = document.getElementsByClassName('fadeElement');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('hexhex');
        }
        ff = document.getElementsByClassName('groser');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('kein');
        }
    }
    else {
        ff = document.getElementsByClassName('moveRightElement');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('links');
        }
        ff = document.getElementsByClassName('moveLeftElement');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('recht');
        }
        ff = document.getElementsByClassName('fadeElement');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('hexhex');
        }
        ff = document.getElementsByClassName('groser');
        for (let i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('kein');
        }
        await sleep(animationSpeed);
        document.getElementsByClassName('slide')[0].disabled = false;
    }
}

function changeAnimationSpeed(ff){
    ff /= 2;
    animationSpeed = ff;
    localStorage.setItem('animationSpeed', ff);
    document.documentElement.style.setProperty('--animationSpeed', ff + 'ms');
    ff = (ff * 2) / 3;
    document.documentElement.style.setProperty('--animationSpeed2', ff + 'ms');

}

async function closePatch(){
    document.getElementsByClassName('patch-window')[0].classList.remove('movechat');
    patch.classList.remove('chatopa');
    await sleep(animationSpeed);
    patch.style.display = 'none';
}

async function pat(){
    patch.style.display = 'block';
    await sleep(100);
    document.getElementsByClassName('patch-window')[0].classList.add('movechat');
    patch.classList.add('chatopa');
    const yourscripttag = document.getElementById('patchh');
    yourscripttag.remove();
    const newscript = document.createElement('style');
    newscript.type = 'text/css';
    newscript.id = 'patchh';
    newscript.appendChild(document.createTextNode('#note::after{display:none}'));
    document.getElementsByTagName('head').item(0).appendChild(newscript);
    localStorage.setItem('patchversion', document.getElementById('version').innerHTML);
}
