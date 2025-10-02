/* global sleep, fadeButton, OnlineMultiplayer, LocalMultiplayer, EasyBot, MediumBot, HardBot, ExperimentalLocalMultiplayer, ExperimentalOnlineMultiplayer, changeAnimationSpeed, showAlert */
/* exported modal, chat, patch, animationSpeed, intervall, modus, erro, activeGameMode, host */

//const host = 'https://oberflow.dev:3000';
const host = 'localhost:3000';

let modal, chat, patch, animationSpeed, intervall;
let modus = 0;
let erro = false;
let activeGameMode = null;


function fadeout(action) {
    return async function() {
        fadeButton(true);
        if (animationSpeed > 0)
            await sleep(animationSpeed);
        action();
        if (animationSpeed > 0)
            await sleep(100);
        fadeButton(false);
    };
}

function getAction() {
    const hash = String(window.location.hash);
    const actionLockup = hash.trim().replace('#', '');
    const actions = {
        '': back,
        '1v1': changeToLocalMultiplayer,
        'singleplayer': changeToSingleplayerArea,
        'easyBot': changeToEasyBot,
        'mediumBot': changeToMediumBot,
        'hardBot': changeToHardBot,
        'multiplayer': changeToOnlineMultiplayer,
        'experimental-area': changeToExperimentalArea,
        'experimental-local-multiplayer': changeToExperimentalLocalMultiplayer,
        'experimental-multiplayer': changeToExperimentalMultiplayer
    };
    return actions[actionLockup];
}

function handleHashChange(action) {
    if (action) {
        fadeout(action)();
    } else {
        // Unknown hash just go back
        fadeout(back)();
    }
}

window.onhashchange = function() {
    handleHashChange(getAction());
};


window.addEventListener('DOMContentLoaded', function() {
    modal = document.getElementById('myModal');
    patch = document.getElementById('patch');
    chat = document.getElementById('chatModal');

    // The Site Version is saved in the meta tag with the name "version"
    // This code reads the version and displays it on the page
    const metas = document.getElementsByTagName('meta');
    for(let i = 0; i < metas.length; i++) {
        if(metas[i].getAttribute('name') === 'version') {
            document.getElementById('version').innerHTML = metas[i].getAttribute('content');
        }
    }

    const nameOnline = localStorage.getItem('nameOnline');
    document.getElementById('inpu').value = nameOnline;

    const newversion = document.getElementById('version').innerHTML;
    let patchversion;

    try{patchversion = localStorage.getItem('patchversion');}catch{localStorage.setItem('patchversion', '0.0.0');patchversion = '0.0.0';};
    if(patchversion === null){localStorage.setItem('patchversion', '0.0.0');patchversion = '0.0.0';};
    if(patchversion < newversion){
        const scripttag = document.getElementById('patchh');
        scripttag.remove();
        const newscript = document.createElement('style');
        newscript.id = 'patchh';
        newscript.appendChild(document.createTextNode('#note::after{display:block}'));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }

    const action = getAction();
    if (action && action !== back) {
        action();
    } else {
        // Unknown hash just go back: do nothing
    }

    animationSpeed = localStorage.getItem('animationSpeed');
    if(animationSpeed === null) {
        localStorage.setItem('animationSpeed', 750);
        animationSpeed = 750;
    }
    changeAnimationSpeed(animationSpeed * 2);
    document.getElementById('slide').value = animationSpeed * 2;


    // site.webmanifest offline handling
    function toggleMultiplayerButtons(isOnline) {
        const multiplayerButtons = document.getElementsByClassName('multiplayerButton');
        for (const button of multiplayerButtons) {
            isOnline ? button.classList.remove('disabled') : button.classList.add('disabled');
        }
    }

    function setupMultiplayerButtonListeners() {
        const multiplayerButtons = document.getElementsByClassName('multiplayerButton');
        for (const button of multiplayerButtons) {
            const parent = button.parentElement;
            parent.addEventListener('click', (event) => {
                if (!navigator.onLine) { // Check the online status at the time of click
                    event.preventDefault();
                    showAlert('Du bist offline, bitte überprüfe deine Internetverbindung.');
                }
            });
        }
    }

    // Initial setup
    toggleMultiplayerButtons(navigator.onLine);
    setupMultiplayerButtonListeners();

    // Listen for changes
    window.addEventListener('online', () => toggleMultiplayerButtons(true));
    window.addEventListener('offline', () => toggleMultiplayerButtons(false));

});

function notInGame() {
    modus = 0;
}

function inNormalGame() {
    modus = 1;
}

function inExperimentalGame() {
    modus = 2;
}

function switchToBoard() {
    show('gameBoardContainer');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').classList.remove('dontDisplay');
}

function showSubMenuScreen() {
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').classList.add('dontDisplay');
}

function back() {
    show('gameMenuContainer');
    document.getElementById('settingsBox').classList.remove('ingame');
    document.getElementById('help').classList.add('dontDisplay');
    notInGame();
}

function changeToOnlineMultiplayer() {
    activeGameMode = new OnlineMultiplayer();
    show('multiplayer');
    showSubMenuScreen()
    inNormalGame();
}

function changeToLocalMultiplayer() {
    activeGameMode = new LocalMultiplayer();
    switchToBoard()
    inNormalGame();
}

function changeToSingleplayerArea() {
    show('singleplayer');
    showSubMenuScreen()
    notInGame();
}

function changeToEasyBot() {
    activeGameMode = new EasyBot();
    switchToBoard()
    inNormalGame();
}

function changeToMediumBot() {
    activeGameMode = new MediumBot();
    switchToBoard()
    inNormalGame();
}

function changeToHardBot() {
    activeGameMode = new HardBot();
    switchToBoard()
    inNormalGame();
}


function changeToExperimentalLocalMultiplayer() {
    activeGameMode = new ExperimentalLocalMultiplayer();
    switchToBoard()
    inExperimentalGame();
}

function changeToExperimentalMultiplayer() {
    activeGameMode = new ExperimentalOnlineMultiplayer();
    show('multiplayer');
    showSubMenuScreen()
    inExperimentalGame();
}

function changeToExperimentalArea() {
    show('experimental-area');
    showSubMenuScreen()
    notInGame();
}

function show(contain){
    document.getElementById('gameMenuContainer').classList.add('dontDisplay');
    document.getElementById('gameBoardContainer').classList.add('dontDisplay');
    document.getElementById('queueAnimationContainer').classList.add('dontDisplay');
    document.getElementById('singleplayer').classList.add('dontDisplay');
    document.getElementById('multiplayer').classList.add('dontDisplay');
    document.getElementById('experimental-area').classList.add('dontDisplay');
    document.getElementById('pin').classList.add('dontDisplay');
    chat.classList.add('dontDisplay');
    patch.classList.add('dontDisplay');
    modal.classList.add('dontDisplay');
    document.getElementById(contain).classList.remove('dontDisplay');
}

function scaleContent() {
    // + 10 pixel to avoid floating point errors
    const baseWidth = 410;
    const baseHeight = 610;
    const viewport = document.querySelector('meta[name="viewport"]');
    const deviceWidth = window.screen.width;
    const deviceHeight = window.screen.height;
    const scaleWidth = Math.min(1, deviceWidth / baseWidth);
    const scaleHeight = Math.min(1, deviceHeight / baseHeight);
    const scale = Math.min(scaleWidth, scaleHeight);
    //viewport.content = `width=${baseWidth}, initial-scale=${scale}`;
    viewport.content = `width=device-width, initial-scale=${parseFloat(scale)}`;
}

scaleContent();
window.addEventListener('resize', scaleContent);