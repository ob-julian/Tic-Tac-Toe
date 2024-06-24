/* eslint-disable no-global-assign */
// EsLint global variables
/* global activeGameMode, themeColor, patch, OnlineMultiplayer, modal, ExperimentalLocalMultiplayer, chat, themeColor, animationSpeed*/
// EsLint exported variables
/* exported los, rematch, changeAnimationSpeed, help, pat, backButton, neu, disconnect, chatting, onBlur, onFocus, sendMsg, chatOk, tutorialJa, tutorialNein, closeModal, showAlert, anination, experimentalTutorialDisableHint, switchTheme, fadebutton */

// ttt wrapper for class based game modes
function executeGameModeMethod(methodName, requiredClass = null, ...args) {
    const isInstanceOfRequiredClass = requiredClass ?
        (Array.isArray(requiredClass) ?
            requiredClass.some(cls => activeGameMode instanceof cls) :
            activeGameMode instanceof requiredClass) :
        true;

    if (activeGameMode && isInstanceOfRequiredClass) {
        activeGameMode[methodName]?.(...args);
    }
}

// Simplified function calls
function los(index) {
    executeGameModeMethod('makeMove', null, index);
}

function rematch() {
    executeGameModeMethod('rematch');
}

function help() {
    executeGameModeMethod('help');
}

function tutorialJa() {
    executeGameModeMethod('tutorialJa');
}

function tutorialNein() {
    closeModal();
}

function animation() {
    executeGameModeMethod('animation');
}

function neu() {
    executeGameModeMethod('neu', OnlineMultiplayer);
}

function disconnect() {
    executeGameModeMethod('disconnect', OnlineMultiplayer);
}

function chatting() {
    executeGameModeMethod('chatting', OnlineMultiplayer);
}

function closeChat() {
    executeGameModeMethod('closeChat', OnlineMultiplayer);
}

function onBlur() {
    executeGameModeMethod('blurChatInput', OnlineMultiplayer);
}

function onFocus() {
    executeGameModeMethod('focusChatInput', OnlineMultiplayer);
}

function sendMsg() {
    executeGameModeMethod('sendChat', OnlineMultiplayer);
}

function chatOk() {
    closeModal();
    executeGameModeMethod('chatOk', OnlineMultiplayer);
}

function experimentalTutorialDisableHint() {
    executeGameModeMethod('disableTutorialHint', [ExperimentalLocalMultiplayer, ExperimentalOnlineMultiplayer]);
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        document.getElementById('closeModal').style.display = 'none';
    } else {
        document.getElementById('closeModal').style.display = 'block';
    }
}

function changeAnimationSpeed(newSpeed){
    newSpeed /= 2;
    animationSpeed = newSpeed;
    localStorage.setItem('animationSpeed', newSpeed);
    document.documentElement.style.setProperty('--animationSpeed', newSpeed + 'ms');
    newSpeed = newSpeed * 2/3;
    document.documentElement.style.setProperty('--animationSpeed2', newSpeed + 'ms');
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


async function openPatchNotes(){
    patch.style.display = 'block';
    await sleep(100);
    document.getElementById('patch-window').classList.add('movechat');
    patch.classList.add('chatopa');

    // rmove the red dot indicating new patch notes
    const patchNotesCss = document.getElementById('patchh');
    patchNotesCss.remove();
    const newscript = document.createElement('style');
    newscript.type = 'text/css';
    newscript.id = 'patchh';
    newscript.appendChild(document.createTextNode('#note::after{display:none}'));
    document.getElementsByTagName('head').item(0).appendChild(newscript);
    localStorage.setItem('patchversion', document.getElementById('version').innerHTML);
}

async function closePatch(){
    document.getElementById('patch-window').classList.remove('movechat');
    patch.classList.remove('chatopa');
    await sleep(animationSpeed);
    patch.style.display = 'none';
}

// TODO: Rest of this



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


