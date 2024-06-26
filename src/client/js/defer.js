/* eslint-disable no-global-assign */
// EsLint global variables
/* global activeGameMode, themeColor, patch, OnlineMultiplayer, modal, ExperimentalLocalMultiplayer, chat, themeColor, animationSpeed, ExperimentalOnlineMultiplayer*/
// EsLint exported variables
/* exported los, rematch, changeAnimationSpeed, help, pat, backButton, neu, disconnect, chatting, onBlur, onFocus, sendMsg, chatOk, tutorialJa, tutorialNein, closeModal, showAlert, anination, experimentalTutorialDisableHint, switchTheme, fadeButton, animation, openPatchNotes */

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
    modal.classList.add('dontDisplay');
    document.getElementById('help').classList.remove('dontDisplay');
}

window.onclick = closePosibleOpen;
window.onkeydown = function(event) {
    if(event.key === 'Escape') {
        closeModal();
        closeChat();
        closePatch();
    }
};
// safari fix
window.ontouchstart = closePosibleOpen;

function closePosibleOpen(event) {
    if(event.target === modal) {
        closeModal();
    }
    else if(event.target === chat) {
        closeChat();
    }
    else if(event.target === patch){
        closePatch();
    }
}

function showAlert(text, isClosable = true) {
    document.getElementById('mote').innerHTML = text;
    modal.classList.remove('dontDisplay');
    if(!isClosable) {
        document.getElementById('closeModal').classList.add('dontDisplay');
    } else {
        document.getElementById('closeModal').classList.remove('dontDisplay');
    }
}

function changeAnimationSpeed(newSpeed){
    newSpeed /= 2;
    animationSpeed = newSpeed;
    localStorage.setItem('animationSpeed', newSpeed);
    document.documentElement.style.setProperty('--animationSpeed', newSpeed + 'ms');
    newSpeed = newSpeed * 2 / 3;
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
    patch.classList.remove('dontDisplay');
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
    patch.classList.add('dontDisplay');
}

async function fadeButton(fadeOut) {
    // Helper function to toggle classes
    function toggleClass(elements, className, add) {
        Array.from(elements).forEach(element => {
            element.classList[add ? 'add' : 'remove'](className);
        });
    }

    const slideElement = document.getElementById('slide');
    const moveRightElements = document.getElementsByClassName('moveRightElement');
    const moveLeftElements = document.getElementsByClassName('moveLeftElement');
    const fadeElements = document.getElementsByClassName('fadeElement');
    const groserElements = document.getElementsByClassName('groser');

    function toggleAllClasses(add) {
        toggleClass(moveRightElements, 'links', add);
        toggleClass(moveLeftElements, 'recht', add);
        toggleClass(fadeElements, 'hexhex', add);
        toggleClass(groserElements, 'kein', add);
    }

    if (fadeOut) {
        slideElement.disabled = true;
        toggleAllClasses(true);
    } else {
        toggleAllClasses(false);
        await sleep(animationSpeed);
        slideElement.disabled = false;
    }
}