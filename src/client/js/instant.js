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
    const modal = document.getElementById('myModal');
    const patch = document.getElementById('patch');
    const chat = document.getElementById('chatModal');

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


    // Handle explaining the small screen size
    const callBack = function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Element is visible');
                window.addEventListener('resize', calculateWhyWindowIsTooSmall);
                calculateWhyWindowIsTooSmall(); // Initial calculation
            } else {
                console.log('Element is not visible');
                window.removeEventListener('resize', calculateWhyWindowIsTooSmall);
            }
        });
    };
    const observer = new IntersectionObserver(callBack, {root: null, threshold: 0.1});
    const toSmallDeviceDiv = document.getElementById('noaccsize');
    if (toSmallDeviceDiv === null) {
        console.error('Element with id "noacc" not found.');
        return;
    } else {
        observer.observe(toSmallDeviceDiv);
    }


});

function calculateWhyWindowIsTooSmall(){
    const toSmallDeviceDiv = document.getElementById('noaccsize');
    if (toSmallDeviceDiv === null) {
        console.error('Element with id "noaccsize" not found.');
        return;
    }
    const deviceScaledWidth = window.innerWidth;
    const deviceScaledHeight = window.innerHeight;
    const deviceWidth = window.screen.width;
    const deviceHeight = window.screen.height;
    console.log(`Actual Width: ${deviceWidth}, Actual Height: ${deviceHeight}`);
    console.log(`CSS Pixel Width: ${deviceScaledWidth}, CSS Pixel Height: ${deviceScaledHeight}`);
    let minWidth = 400;
    let minHeight = 600;
    let usedWidth = deviceScaledWidth;
    let usedHeight = deviceScaledHeight;
    if (deviceWidth > minWidth && deviceHeight > minHeight) {
        // This is a resized window on a large device
        if (deviceScaledWidth < minWidth) {
            usedWidth = "<span style='color: red;'>" + deviceScaledWidth + "</span>";
        }
        if (deviceScaledHeight < minHeight) {
            usedHeight = "<span style='color: red;'>" + deviceScaledHeight + "</span>";
        }
        toSmallDeviceDiv.innerHTML = `Dein Browserfenster ist zu klein.<br>Bitte vergrößere es auf mindestens ${minWidth}&nbsp;x&nbsp;${minHeight}&nbsp;(px). Dein aktuelles Browserfenster hat eine Größe von ${usedWidth}&nbsp;x&nbsp;${usedHeight}&nbsp;(px).<br>Verkleinerendern der Zoomstufe (Strg + Minus) kann auch helfen.`;
        return;
    }
    if (deviceWidth <= 100 && deviceHeight > 150) {
        minWidth = 100;
        minHeight = 150;
    } else {
        minWidth = 150;
        minHeight = 150;
    }
    let usedDeviceWidth = deviceWidth;
    let usedDeviceHeight = deviceHeight;
    if (deviceWidth < minWidth) {
        usedDeviceWidth = "<span style='color: red;'>" + deviceWidth + "</span>";
    }
    if (deviceHeight < minHeight) {
        usedDeviceHeight = "<span style='color: red;'>" + deviceHeight + "</span>";
    }
    toSmallDeviceDiv.innerHTML = `Dein Gerät ist zu klein.<br>Es unterschreitet die Mindesgröße von ${minWidth}&nbsp;x&nbsp;${minHeight}&nbsp;(px). Dein Gerät hat eine Größe von ${usedDeviceWidth}&nbsp;x&nbsp;${usedDeviceHeight}&nbsp;(px).`;
    /*
    if (deviceWidth < minWidth) {
        usedWidth = "<span style='color: red;'>" + deviceWidth + "</span>";
    }
    if (deviceHeight < minHeight) {
        usedHeight = "<span style='color: red;'>" + deviceHeight + "</span>";
    }

    toSmallDeviceDiv.innerHTML = `Es unterschreitet die Mindesgröße von ${minWidth}&nbsp;x&nbsp;${minHeight}&nbsp;(px). Dein Gerät hat eine Größe von ${deviceWidth}&nbsp;x&nbsp;${deviceHeight}&nbsp;(px).`;*/
}

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