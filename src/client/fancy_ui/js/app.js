/* global LocalMultiplayer, ExperimentalLocalMultiplayer, EasyBot, MediumBot, HardBot, OnlineMultiplayer, ExperimentalOnlineMultiplayer */

let modal;
let chat;
let patch;
const animationSpeed = 750;
let activeGameMode = null;
let host = window.TTT_SERVER_URL || `${window.location.protocol}//${window.location.hostname}:3000`;
let routeVersion = 0;
let modalIndicator = null;
let closeModalFunction = null;

const routeNames = {
    '': 'Übersicht',
    singleplayer: 'Einzelspieler',
    easyBot: 'Einfacher Bot',
    mediumBot: 'Mittlerer Bot',
    hardBot: 'Schwerer Bot',
    '1v1': 'Lokal zu zweit',
    multiplayer: 'Online spielen',
    'experimental-area': 'Versuchsmodus',
    'experimental-local-multiplayer': 'Versuchsmodus lokal',
    'experimental-multiplayer': 'Versuchsmodus online'
};

const socketClientUrl = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
let socketClientPromise;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fadeout(action) {
    return async function() {
        fadeButton(true);
        await sleep(animationSpeed);
        action();
        await sleep(100);
        fadeButton(false);
    };
}

function fadeButton(isFading) {
    document.body.classList.toggle('is-transitioning', isFading);
}

function showAlert(message, isClosable = true, modalName = null, closeAction = null, title = null) {
    const dialog = document.getElementById('myModal');
    const closeButton = document.getElementById('closeModal');
    const headingMatch = message.match(/^\s*<(?:b|strong)>(.*?)<\/(?:b|strong)>\s*(?:<br\s*\/?>)?/i);
    const plainMessage = message.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').toLocaleLowerCase('de');
    const inferredTitle = [
        [/unentschieden/, 'Unentschieden'],
        [/gewinner:|du hast gewonnen/, 'Runde gewonnen'],
        [/du hast verloren/, 'Runde verloren'],
        [/willst du (?:ein tutorial|eine anleitung)|erst(?:e|en) mal diesen modus/, 'Anleitung'],
        [/bitte gib einen namen ein/, 'Name fehlt'],
        [/verbindungsfehler|du bist offline|server.*nicht erreichbar|firewall/, 'Verbindungsproblem'],
        [/benachrichtigungsberechtigung|nachrichten, wenn ein gegner gefunden/, 'Benachrichtigungen'],
        [/gegner:/, 'Gegner gefunden'],
        [/server neustart/, 'Serverneustart'],
        [/bitte starte dein spiel neu|starte dein spiel neu/, 'Spiel neu starten'],
        [/chat wurde deaktiviert|verschlüsselung fehlgeschlagen/, 'Chat deaktiviert'],
        [/chat besitzt keinerlei wortfilter/, 'Hinweis zum Chat'],
        [/fehler bei der entschlüsselung|nachricht konnte nicht entschlüsselt werden/, 'Nachricht nicht lesbar'],
        [/^error:/, 'Spiel-Fehler']
    ].find(([pattern]) => pattern.test(plainMessage))?.[1];
    const modalTitle = title || headingMatch?.[1] || inferredTitle || 'Hinweis';
    document.getElementById('modal-heading').textContent = modalTitle;
    document.getElementById('mote').innerHTML = headingMatch && !title
        ? message.slice(headingMatch[0].length)
        : message;
    modalIndicator = modalName;
    closeModalFunction = closeAction;
    closeButton.classList.toggle('dontDisplay', !isClosable);
    dialog.classList.remove('dontDisplay');
    closeButton.focus();
}

async function closeModal(name = null, circumventCloseFunction = false) {
    if (name && modalIndicator !== name) return;
    document.getElementById('myModal').classList.add('dontDisplay');
    document.getElementById('help').classList.remove('dontDisplay');
    const closeAction = closeModalFunction;
    closeModalFunction = null;
    modalIndicator = null;
    if (closeAction && !circumventCloseFunction) await closeAction();
}

function closePosibleOpen(event) {
    if (event.target === modal) closeModal();
    if (event.target === chat) closeChat();
    if (event.target === patch) closePatch();
}

function los(index) {
    activeGameMode?.makeMove(index);
}

function rematch() {
    activeGameMode?.rematch();
}

function help() {
    activeGameMode?.help();
}

function tutorialJa() {
    activeGameMode?.tutorialJa();
}

function tutorialNein() {
    closeModal();
}

function animation() {
    activeGameMode?.animation();
}

function experimentalTutorialDisableHint() {
    if (activeGameMode instanceof ExperimentalOnlineMultiplayer) {
        activeGameMode.disableTutorialHint();
    } else if (activeGameMode instanceof ExperimentalLocalMultiplayer) {
        activeGameMode.disableTutorialHint();
    }
}

function neu() {
    if (!navigator.onLine) {
        showAlert('Du bist offline, bitte überprüfe deine Internetverbindung.');
        return;
    }
    activeGameMode?.neu();
}

function disconnect() {
    if (activeGameMode instanceof OnlineMultiplayer) {
        activeGameMode.disconnect();
    }
}

function openChat() {
    if (activeGameMode instanceof OnlineMultiplayer) activeGameMode.openChat();
}

function closeChat() {
    if (activeGameMode instanceof OnlineMultiplayer) activeGameMode.closeChat();
    else chat.classList.add('dontDisplay');
}

function onBlur() {
    if (activeGameMode instanceof OnlineMultiplayer) activeGameMode.blurChatInput();
}

function onFocus() {
    if (activeGameMode instanceof OnlineMultiplayer) activeGameMode.focusChatInput();
}

function sendMsg() {
    if (activeGameMode instanceof OnlineMultiplayer) activeGameMode.sendChat();
}

function chatOk() {
    closeModal();
    if (activeGameMode instanceof OnlineMultiplayer) activeGameMode.chatOk();
}

function changeTheme(mode, persist = true) {
    const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = ['auto', 'light', 'dark'].includes(mode) ? mode : 'auto';
    const effectiveTheme = theme === 'auto' ? (themePreference.matches ? 'dark' : 'light') : theme;
    document.body.classList.toggle('dark', effectiveTheme === 'dark');
    document.body.classList.toggle('light', effectiveTheme === 'light');
    document.body.style.colorScheme = effectiveTheme;
    document.getElementById('theme-value').textContent = { auto: 'Auto', light: 'Hell', dark: 'Dunkel' }[theme];
    document.querySelectorAll('.theme-option').forEach(option => {
        const isSelected = option.dataset.theme === theme;
        option.setAttribute('aria-selected', String(isSelected));
        option.classList.toggle('is-selected', isSelected);
    });
    if (persist) localStorage.setItem('theme', theme);
}

function toggleThemeMenu(open = null) {
    const trigger = document.getElementById('theme-trigger');
    const menu = document.getElementById('theme-menu');
    const shouldOpen = open === null ? trigger.getAttribute('aria-expanded') !== 'true' : open;
    trigger.setAttribute('aria-expanded', String(shouldOpen));
    menu.classList.toggle('dontDisplay', !shouldOpen);
    if (shouldOpen) {
        menu.querySelector('[aria-selected="true"]')?.focus();
    }
}

function selectTheme(theme) {
    changeTheme(theme);
    toggleThemeMenu(false);
    document.getElementById('theme-trigger').focus();
}

function openPatchNotes() {
    patch.classList.remove('dontDisplay');
}

function closePatch() {
    patch.classList.add('dontDisplay');
}

function backButton() {
    window.location.hash = '';
}

function loadSocketClient() {
    if (window.io) return Promise.resolve();
    if (socketClientPromise) return socketClientPromise;

    socketClientPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = socketClientUrl;
        script.async = true;
        script.onload = () => {
            if (window.io) resolve();
            else reject(new Error('Socket.IO wurde geladen, aber der Client ist nicht verfügbar.'));
        };
        script.onerror = () => reject(new Error('Socket.IO konnte nicht geladen werden. Bitte prüfe deine Internetverbindung.'));
        document.head.append(script);
    }).catch(error => {
        socketClientPromise = null;
        throw error;
    });

    return socketClientPromise;
}

function normalizeRoute(hash) {
    const route = String(hash).replace(/^#/, '').trim();
    return Object.hasOwn(routeNames, route) ? route : '';
}

function setCurrentSection(route) {
    document.getElementById('current-section').textContent = routeNames[route] || routeNames[''];
    document.querySelectorAll('.nav-link').forEach(link => {
        const isCurrent = link.dataset.route === route ||
            (route === 'easyBot' || route === 'mediumBot' || route === 'hardBot') && link.dataset.route === 'singleplayer' ||
            route === 'experimental-local-multiplayer' && link.dataset.route === 'experimental-area' ||
            route === 'experimental-multiplayer' && link.dataset.route === 'experimental-area';
        if (isCurrent) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function updateMultiplayerLinks() {
    const isOnline = navigator.onLine;
    document.querySelectorAll('a[href="#multiplayer"], a[href="#experimental-multiplayer"]').forEach(link => {
        link.classList.toggle('is-offline', !isOnline);
        link.setAttribute('aria-disabled', String(!isOnline));
    });
}

function updateCellAppearance(cell) {
    const mark = cell.textContent.trim();
    cell.classList.toggle('cell-x', mark === 'X');
    cell.classList.toggle('cell-o', mark === 'O');
    cell.classList.toggle('is-selected', cell.style.color !== '');
}

function updateTurnAppearance(turn) {
    turn.classList.toggle('turn-o', turn.textContent.trim() === 'O');
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('dontDisplay'));
    document.getElementById(id).classList.remove('dontDisplay');
}

function updateClassicUiLink() {
    document.getElementById('classic-ui-link').href = `../index.html${window.location.hash}`;
}

function resetBoardControls(title, mode) {
    document.getElementById('game-title').textContent = title;
    document.getElementById('game-mode-label').textContent = mode;
    document.getElementById('youAre').textContent = '';
    document.getElementById('pin').classList.add('dontDisplay');
    document.getElementById('help').classList.remove('dontDisplay');
    document.getElementById('chat').classList.add('dontDisplay');
    document.getElementById('reset').textContent = 'Neue Runde';
    document.getElementById('reset').classList.remove('disabled');
    document.getElementById('reset').style.visibility = 'hidden';
}

async function routeTo(route) {
    const currentRouteVersion = ++routeVersion;
    updateClassicUiLink();
    const onlineRoute = route === 'multiplayer' || route === 'experimental-multiplayer';
    const newOnlineMode = onlineRoute
        ? route === 'multiplayer' ? OnlineMultiplayer : ExperimentalOnlineMultiplayer
        : null;

    if (activeGameMode instanceof OnlineMultiplayer &&
        (!newOnlineMode || activeGameMode.constructor !== newOnlineMode)) {
        activeGameMode.disconnect();
        activeGameMode = null;
    }

    setCurrentSection(route);

    if (route === '') {
        activeGameMode = null;
        showScreen('gameMenuContainer');
        return;
    }
    if (route === 'singleplayer' || route === 'experimental-area') {
        activeGameMode = null;
        showScreen(route);
        return;
    }
    if (route === 'multiplayer' || route === 'experimental-multiplayer') {
        if (activeGameMode?.constructor === newOnlineMode) {
            showScreen('multiplayer');
            return;
        }
        showScreen('multiplayer');
        document.getElementById('help').classList.add('dontDisplay');
        try {
            await loadSocketClient();
            if (currentRouteVersion !== routeVersion) return;
            activeGameMode = new newOnlineMode();
        } catch (error) {
            if (currentRouteVersion === routeVersion) showAlert(error.message);
        }
        return;
    }

    const modes = {
        '1v1': [LocalMultiplayer, 'Lokal zu zweit', 'LOKALES SPIEL'],
        easyBot: [EasyBot, 'Einfacher Bot', 'ALLEIN · ENTSPANNT'],
        mediumBot: [MediumBot, 'Mittlerer Bot', 'ALLEIN · AUSGEWOGEN'],
        hardBot: [HardBot, 'Schwerer Bot', 'ALLEIN · HERAUSFORDERND'],
        'experimental-local-multiplayer': [ExperimentalLocalMultiplayer, 'Versuchsmodus', 'VERSUCHSMODUS']
    };
    const gameMode = modes[route];
    if (gameMode) {
        activeGameMode = new gameMode[0]();
        resetBoardControls(gameMode[1], gameMode[2]);
        showScreen('gameBoardContainer');
    }
}

window.addEventListener('hashchange', () => {
    routeTo(normalizeRoute(window.location.hash));
});

window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
        closeChat();
        closePatch();
        toggleThemeMenu(false);
    }
});

window.addEventListener('click', event => {
    closePosibleOpen(event);
    if (event.target instanceof Node && !document.getElementById('theme-picker').contains(event.target)) {
        toggleThemeMenu(false);
    }
});
document.getElementById('theme-menu').addEventListener('keydown', event => {
    const options = Array.from(event.currentTarget.querySelectorAll('.theme-option'));
    const currentIndex = options.indexOf(document.activeElement);
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length;
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = options.length - 1;
    else return;
    event.preventDefault();
    options[nextIndex].focus();
});
document.addEventListener('click', event => {
    const link = event.target instanceof Element
        ? event.target.closest('a[href="#multiplayer"], a[href="#experimental-multiplayer"]')
        : null;
    if (link && !navigator.onLine) {
        event.preventDefault();
        showAlert('Du bist offline, bitte überprüfe deine Internetverbindung.');
    }
});
window.addEventListener('online', updateMultiplayerLinks);
window.addEventListener('offline', updateMultiplayerLinks);

window.addEventListener('DOMContentLoaded', () => {
    modal = document.getElementById('myModal');
    chat = document.getElementById('chatModal');
    patch = document.getElementById('patch');

    const savedTheme = localStorage.getItem('theme') || 'auto';
    changeTheme(savedTheme, false);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.addEventListener?.('change', () => {
        if ((localStorage.getItem('theme') || 'auto') === 'auto') changeTheme('auto', false);
    });

    const savedName = localStorage.getItem('nameOnline');
    if (savedName) document.getElementById('inpu').value = savedName;

    const board = document.querySelector('.board');
    const cellObserver = new MutationObserver(records => {
        records.forEach(record => {
            const cell = record.target instanceof Element
                ? record.target.closest('.cell')
                : record.target.parentElement?.closest('.cell');
            if (cell) updateCellAppearance(cell);
        });
    });
    board.querySelectorAll('.cell').forEach(cell => {
        updateCellAppearance(cell);
        cellObserver.observe(cell, { attributes: true, attributeFilter: ['style'], childList: true, characterData: true, subtree: true });
    });
    const turn = document.getElementById('turn');
    updateTurnAppearance(turn);
    new MutationObserver(() => updateTurnAppearance(turn)).observe(turn, {
        childList: true,
        characterData: true,
        subtree: true
    });

    updateMultiplayerLinks();
    routeTo(normalizeRoute(window.location.hash));
});
