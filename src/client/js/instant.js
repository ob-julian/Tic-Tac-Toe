function fadeout(action) {
    return async function() {
        fadebutton(true);
        await sleep(animationspeed);
        action();
        await sleep(100);
        fadebutton(false);
    };
}

function getAction() {
    const hash = String(window.location.hash);
    const actionLockup = hash.trim().replace('#', '');
    const actions = {
        '': back,
        '1v1': localMultiplayer,
        'singleplayer': singleplayerArea,
        'easyBot': easyBot,
        'mediumBot': mediumBot,
        'hardBot': hardBot,
        'multiplayer': onlineMultiplayer,
        'experimental-area': experimentalArea,
        'experimental-local-multiplayer': experimentalLocalMultiplayer,
        'experimental-multiplayer': experimentalMultiplayer
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

let modal, chat, nofillter, patch;

window.addEventListener('DOMContentLoaded', function() {
    modal = document.getElementById('myModal');
    chat = document.getElementById('chatmodal');
    patch = document.getElementById('patch');

    experimentalTutorial = localStorage.getItem('experimentalTutorial');

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

    try{nofillter = localStorage.getItem('nofillter');}catch(ef){localStorage.setItem('nofillter', false);nofillter = false;};
    if(nofillter === null){localStorage.setItem('nofillter', false);nofillter = false;};

    const newversion = document.getElementById('version').innerHTML;
    let patchversion;

    try{patchversion = localStorage.getItem('patchversion');}catch(ef){localStorage.setItem('patchversion', '0.0.0');patchversion = '0.0.0';};
    if(patchversion === null){localStorage.setItem('patchversion', '0.0.0');patchversion = '0.0.0';};
    if(patchversion < newversion){
        const yourscripttag = document.getElementById('patchh');
        yourscripttag.remove();
        const newscript = document.createElement('style');
        newscript.type = 'text/css';
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

    animationspeed = localStorage.getItem('animationspeed');
    if(animationspeed === null){localStorage.setItem('animationspeed', 750);animationspeed = 750;}
    changeanimationspeed(animationspeed * 2);
    document.getElementsByClassName('slide')[0].value = animationspeed * 2;

});