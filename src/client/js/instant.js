/* global sleep, fadebutton, OnlineMultiplayer, LocalMultiplayer, EasyBot, MediumBot, HardBot, experimentalLocalMultiplayer, experimentalMultiplayer, changeAnimationSpeed */
/* exported modal, chat, patch, animationSpeed, intervall, modus, erro, activeGameMode, host */

//const host = 'https://oberhofer.ddns.net:3000';
const host = 'localhost:3000';

let modal, chat, patch, animationSpeed, intervall;
let modus = 0;
let erro = false;
let activeGameMode = null;


function fadeout(action) {
    return async function() {
        fadebutton(true);
        if (animationSpeed > 0)
            await sleep(animationSpeed);
        action();
        if (animationSpeed > 0)
            await sleep(100);
        fadebutton(false);
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
    document.getElementsByClassName('slide')[0].value = animationSpeed * 2;

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

function back() {
    show('div0');
    document.getElementById('settingsBox').classList.remove('ingame');
    document.getElementById('help').style.display = 'none';
    notInGame();
}

function changeToOnlineMultiplayer() {
    activeGameMode = new OnlineMultiplayer();
    show('multiplayer');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'none';
    inNormalGame();
}

function changeToLocalMultiplayer() {
    activeGameMode = new LocalMultiplayer();
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    inNormalGame();
}

function changeToSingleplayerArea() {
    show('singleplayer');
    document.getElementById('settingsBox').classList.add('ingame');
    notInGame();
}

function changeToEasyBot() {
    activeGameMode = new EasyBot();
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    inNormalGame();
}

function changeToMediumBot() {
    activeGameMode = new MediumBot();
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    inNormalGame();
}

function changeToHardBot() {
    activeGameMode = new HardBot();
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    inNormalGame();
}


function changeToExperimentalLocalMultiplayer() {
    activeGameMode = new experimentalLocalMultiplayer();
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    inExperimentalGame();
}

function changeToExperimentalMultiplayer() {
    activeGameMode = new experimentalMultiplayer();
    show('multiplayer');
    document.getElementById('settingsBox').classList.add('ingame');
    inExperimentalGame();
    document.getElementById('help').style.display = 'none';
}

function changeToExperimentalArea() {
    show('experimental-area');
    document.getElementById('settingsBox').classList.add('ingame');
    notInGame();
}

function show(contain){
    document.getElementById('div0').style = 'display:none !important';
    document.getElementById('div1').style = 'display:none !important';
    document.getElementById('div2').style = 'display:none !important';
    document.getElementById('singleplayer').style = 'display:none !important';
    document.getElementById('multiplayer').style = 'display:none !important';
    document.getElementById('experimental-area').style = 'display:none !important';
    document.getElementById(contain).style = 'display:block !important';
}