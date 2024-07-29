/* global showAlert, sleep, io, animationSpeed, fadeout, host, closeModal, chat, fadeButton, modal */
/* exported LocalMultiplayer, ExperimentalLocalMultiplayer, HardBot, MediumBot, EasyBot, OnlineMultiplayer, ExperimentalOnlineMultiplayer */

const playerSymbols = {
    1: 'X',
    2: 'O'
};

class Player {
    constructor(){
        this.score = 0;
    }

    reset(){
        this.score = 0;
    }

    addPoint(){
        this.score++;
    }
}

/**
 * Represents a local multiplayer game of Tic-Tac-Toe.
 * Will be used as base for other game modes.
 */
class LocalMultiplayer {

    constructor() {
        this.board = new Array(9).fill(null);
        this.turn = playerSymbols[1];
        this.winner = null;
        this.moves = 0;
        this.player1 = new Player();
        this.player2 = new Player();

        this.isAnimating = false;

        this._reset_GUI();
        document.getElementById('score').innerHTML = 'X: ' + this.player1.score + ' vs. O: ' + this.player2.score;
    }

    getElement(index) {
        if (!this.isAnimating && 0 <= index && index < 9) {
            return document.getElementById('a' + index);
        }
        return {
            style: {},
            removeAttribute: () => {}
        };
    }

    makeMove(index) {
        if (this.board[index] || this.winner || this.isAnimating) {
            return false;
        }
        this._makeUncheckedMove(index);
        this._afterTurn();
        return true;
    }

    _makeUncheckedMove(index) {
        this.board[index] = this.turn;
        this.moves++;
        this.getElement(index).innerHTML = this.turn;

    }

    _afterTurn() {
        this._winningLogic();
        this._switchTurn();
    }

    _switchTurn() {
        this.turn = this.turn === playerSymbols[1] ? playerSymbols[2] : playerSymbols[1];
        document.getElementById('turn').innerHTML = this.turn;
    }

    _winningLogic() {
        this.winner = this._checkWinner();
        if (this.winner) {
            this._roundEnd();
        }
    }

    _checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        if (this.moves === 9) {
            return 'T';
        }
        return null;
    }

    _roundEnd() {
        if (this.winner === 'T') {
            showAlert('Unentschieden');
        } else{
            this._symbolToPlayer(this.winner).addPoint();
            showAlert('Gewinner: ' + this.winner);
            document.getElementById('score').innerHTML = 'X: ' + this.player1.score + ' vs. O: ' + this.player2.score;
        }
        document.getElementById('reset').style = 'visibility:visible';
    }

    rematch() {
        this.reset();
    }

    async help() {
        document.getElementById('help').classList.add('dontDisplay');
        showAlert('<b>Hilfe</b><br><br>Willst du ein Tutorial zu diesem Spielmodus?<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'tutorialJa()\'>Ja</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'closeModal()\'>Nein</button></div>', false);
    }

    tutorialJa() {
        showAlert('<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style=\'color:#50ff1e\'>X</span> und <span style=\'color:#50ff1e\'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diagonalen zu haben.<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'closeModal()\'>Ok</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'animation()\'>Animation</button></div>', false);
    }

    async animation() {
        this.animationInit();
        await this.animationSteps();
        this.animationEnd();
    }

    animationInit() {
        this.isAnimating = true;
        const allBackButtons = document.getElementsByClassName('back');

        document.getElementById('help').classList.add('dontDisplay');
        document.getElementById('infoscreen').classList.add('dontDisplay');

        for(const backBut of allBackButtons) {
            backBut.classList.add('dontDisplay');
        }
        for(let www = 0; www < 9; www++) {
            document.getElementById('a' + www).innerHTML = '';
        }
        // cloase modal
        modal.classList.add('dontDisplay');
    }

    animationEnd() {
        this.isAnimating = false;
        const allBackButtons = document.getElementsByClassName('back');

        document.getElementById('help').classList.remove('dontDisplay');
        document.getElementById('infoscreen').classList.remove('dontDisplay');

        // reinstating the board
        for(let i = 0; i < 9; i++) {
            document.getElementById('a' + i).innerHTML = this.board[i];
        }
        for(const backBut of allBackButtons) {
            backBut.removeAttribute('style');
        }
        this.tutorialJa();
    }

    async animationSteps(){
        await sleep(500);
        document.getElementById('a0').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a4').innerHTML = 'O';
        await sleep(1000);
        document.getElementById('a8').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a2').innerHTML = 'O';
        await sleep(1000);
        document.getElementById('a6').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a7').innerHTML = 'O';
        await sleep(1000);
        document.getElementById('a3').innerHTML = 'X';
        await sleep(500);
        document.getElementById('a0').innerHTML = '';
        document.getElementById('a3').innerHTML = '';
        document.getElementById('a6').innerHTML = '';
        await sleep(500);
        document.getElementById('a0').innerHTML = 'X';
        document.getElementById('a3').innerHTML = 'X';
        document.getElementById('a6').innerHTML = 'X';
        await sleep(500);
        document.getElementById('a0').innerHTML = '';
        document.getElementById('a3').innerHTML = '';
        document.getElementById('a6').innerHTML = '';
        await sleep(500);
        document.getElementById('a0').innerHTML = 'X';
        document.getElementById('a3').innerHTML = 'X';
        document.getElementById('a6').innerHTML = 'X';
        await sleep(500);
    }

    reset() {
        this.board = new Array(9).fill(null);
        this.winner = null;
        this.moves = 0;
        this._reset_GUI();
    }

    _reset_GUI() {
        for (let i = 0; i < 9; i++) {
            this.getElement(i).innerHTML = '';
        }
        document.getElementById('reset').style = 'visibility:hidden';
        document.getElementById('turn').innerHTML = this.turn;
    }

    _symbolToPlayer(symbol) {
        switch (symbol) {
            case 'X':
                return this.player1;
            case 'O':
                return this.player2;
        }
    }
}

class ExperimentalLocalMultiplayer extends LocalMultiplayer {
    constructor() {
        super();
        this.selectedField = null;

        const hasPlayedBefore = localStorage.getItem('hasPlayedExperimental');
        if (!hasPlayedBefore) {
            this.nochNichtGespielt();
        } else {
            document.getElementById('help').classList.remove('dontDisplay');
        }
    }

    makeMove(index) {
        if (this.winner || this.isAnimating) {
            return;
        }
        if (this.moves < 6) {
            super.makeMove(index);
        } else {
            if (!this.selectedField && this.board[index] === this.turn) {
                // Player clicked empty field and has not selected a field before
                this.selectedField = index;
                this.getElement(index).style.color = 'red';
            } else if (this.selectedField === index) {
                // Player clicked the same field again
                this.selectedField = null;
                this.getElement(index).removeAttribute('style');
            } else if (this.selectedField && this.board[index] === this.turn) {
                // Player selected a field and clicked on their own symbol
                this.getElement(this.selectedField).removeAttribute('style');
                this.getElement(index).style.color = 'red';
                this.selectedField = index;
            } else if (this.selectedField && !this.board[index]) {
                // Player selected a field and clicked on an empty field
                this.board[index] = this.turn;
                this.board[this.selectedField] = null;
                this.getElement(this.selectedField).innerHTML = '';
                this.getElement(index).innerHTML = this.turn;
                this.getElement(this.selectedField).removeAttribute('style');
                this.selectedField = null;
                this._afterTurn();
            }
        }
    }

    reset() {
        super.reset();
        this.selectedField = null;
    }

    tutorialJa() {
        showAlert('<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style=\'color:#50ff1e\'>X</span> und <span style=\'color:#50ff1e\'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diagonalen zu haben.<br>Der Unterschied zum normalen Spiel besteht jedoch darin, dass jeder nur 3 Zeichen besitzt.<br>Wenn alle gesetzt worden sind, werden die Zeichen auf den Feldern solange versetzt, bis einer Gewonnen hat.<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'closeModal()\'>Ok</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'animation()\'>Animation</button></div>', false);
    }

    animationEnd() {
        super.animationEnd();
        // reinstate possible selected field
        if (this.selectedField !== null) {
            document.getElementById('a' + this.selectedField).style.color = 'red';
        }
    }

    async animationSteps() {
        await sleep(500);
        document.getElementById('a0').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a4').innerHTML = 'O';
        await sleep(1000);
        document.getElementById('a8').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a2').innerHTML = 'O';
        await sleep(1000);
        document.getElementById('a6').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a7').innerHTML = 'O';
        await sleep(1000);
        document.getElementById('a8').style.color = 'red';
        await sleep(1000);
        document.getElementById('a8').innerHTML = '';
        document.getElementById('a8').removeAttribute('style');
        document.getElementById('a5').innerHTML = 'X';
        await sleep(1000);
        document.getElementById('a2').style.color = 'red';
        await sleep(1000);
        document.getElementById('a2').innerHTML = '';
        document.getElementById('a2').removeAttribute('style');
        document.getElementById('a1').innerHTML = 'O';
        await sleep(500);
        document.getElementById('a1').innerHTML = '';
        document.getElementById('a4').innerHTML = '';
        document.getElementById('a7').innerHTML = '';
        await sleep(500);
        document.getElementById('a1').innerHTML = 'O';
        document.getElementById('a4').innerHTML = 'O';
        document.getElementById('a7').innerHTML = 'O';
        await sleep(500);
        document.getElementById('a1').innerHTML = '';
        document.getElementById('a4').innerHTML = '';
        document.getElementById('a7').innerHTML = '';
        await sleep(500);
        document.getElementById('a1').innerHTML = 'O';
        document.getElementById('a4').innerHTML = 'O';
        document.getElementById('a7').innerHTML = 'O';
        await sleep(500);
    }

    nochNichtGespielt(){
        //document.getElementById("experimentalTutorial").style.display="block";
        showAlert('Sieht so aus als würdest du das erste mal diesen Modus spielen. <br>Willst du ein Tutorial?<br><div  align=\'left\' style=\'float:left;\'><button onclick=\'tutorialJa(), experimentalTutorialDisableHint()\'>Ja</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'tutorialNein(), experimentalTutorialDisableHint()\'>Nein</button></div>', false);
    }

    disableTutorialHint(){
        localStorage.setItem('hasPlayedExperimental', true);
    }
}

const _botDifficulties = {
    'easy': 0.5,
    'medium': 0.75
};

class HardBot extends LocalMultiplayer {
    constructor() {
        super();
        this.lastMoveMemory = undefined;
        this.hasMiddle = false;
    }

    makeMove(index) {
    // player always goes first
        if (this.turn === playerSymbols[1]) {
            const madeMove = super.makeMove(index);
            if (madeMove && !this.winner) {
                // bot goes second
                this._botMove(index);
                return true;
            }
            return madeMove;
        }
    }

    _botMove(playerMove) {
        const index = this._getBotMove(playerMove);
        if (this.board[index]) {
            console.error('Bot tried to make a move on an occupied field');
        } else {
            this._makeUncheckedMove(index);
            this._afterTurn();
        }
    }

    _getBotMove(playerMove) {
        const matrixBoard = boardToMatrix(this.board);

        // hard coded first move
        if(this.moves === 1) {
            switch (playerMove){
                case 1: this.lastMoveMemory = 6; return 7;
                case 3: this.lastMoveMemory = 8; return 5;
                case 4: this.lastMoveMemory = true; return 6;
                case 5: this.lastMoveMemory = 0; return 3;
                case 7: this.lastMoveMemory = 2; return 1;
                case 0:
                case 2:
                case 6:
                case 8: this.hasMiddle = true; return 4;
            }
        }

        if(this.moves >= 3){
            //testing bot win opertunity
            const posWin = checkWinConsteleation(2);
            if (posWin !== false) {
                return posWin;
            }

            //checking win opertunity for player
            const posBlock = checkWinConsteleation(1);
            if (posBlock !== false) {
                return posBlock;
            }
        }

        // actual not rudimentary bot code

        //  ???
        //  ?X?
        //  0??
        if((this.lastMoveMemory === true) && (playerMove === 2) && (this.move === 3)){
            return 0;
        }

        //?0?
        //?0?
        //oX?
        if((playerMove === 4) && (this.move === 3)){
            return this.lastMoveMemory;
        }

        //  0X0
        //  ??X
        //  ??0
        if(test3(matrixBoard[0][1], matrixBoard[1][0], matrixBoard[0][0], matrixBoard[0][2], matrixBoard[2][0])){
            return 0;
        }
        if(test3(matrixBoard[0][1], matrixBoard[1][2], matrixBoard[0][2], matrixBoard[0][0], matrixBoard[2][2])){
            return 2;
        }
        if(test3(matrixBoard[2][1], matrixBoard[1][0], matrixBoard[2][0], matrixBoard[0][0], matrixBoard[2][2])){
            return 6;
        }
        if(test3(matrixBoard[2][1], matrixBoard[1][2], matrixBoard[2][2], matrixBoard[0][2], matrixBoard[2][0])){
            return 8;
        }

        //  X00
        //  ??0
        //  ??X
        if(test3(matrixBoard[2][0], matrixBoard[0][2], matrixBoard[1][0], matrixBoard[0][0], matrixBoard[0][1])){
            return 1;
        }
        if(test3(matrixBoard[2][0], matrixBoard[0][2], matrixBoard[2][1], matrixBoard[2][2], matrixBoard[1][2])){
            return 3;
        }
        if(test3(matrixBoard[0][0], matrixBoard[2][2], matrixBoard[0][1], matrixBoard[0][2], matrixBoard[1][2])){
            return 5;
        }
        if(test3(matrixBoard[0][0], matrixBoard[2][2], matrixBoard[1][0], matrixBoard[2][0], matrixBoard[2][1])){
            return 7;
        }

        //  X00
        //  ??X
        //  ??0
        if(test3(matrixBoard[0][0], matrixBoard[2][1], matrixBoard[2][0], matrixBoard[2][2], matrixBoard[1][0])){
            if(this.hasMiddle) return 3;
            else return 8;
        }
        if(test3(matrixBoard[0][2], matrixBoard[2][1], matrixBoard[2][0], matrixBoard[2][2], matrixBoard[1][2])){
            if(this.hasMiddle) return 5;
            else return 6;
        }
        if(test3(matrixBoard[0][2], matrixBoard[1][0], matrixBoard[0][0], matrixBoard[2][0], matrixBoard[0][1])){
            if(this.hasMiddle) return 1;
            else return 6;
        }
        if(test3(matrixBoard[2][2], matrixBoard[1][0], matrixBoard[0][0], matrixBoard[2][0], matrixBoard[2][1])){
            if(this.hasMiddle) return 7;
            else return 0;
        }
        if(test3(matrixBoard[2][0], matrixBoard[0][1], matrixBoard[0][0], matrixBoard[0][2], matrixBoard[1][0])){
            if(this.hasMiddle) return 3;
            else return 2;
        }
        if(test3(matrixBoard[2][2], matrixBoard[0][1], matrixBoard[0][0], matrixBoard[0][2], matrixBoard[1][2])){
            if(this.hasMiddle) return 5;
            else return 0;
        }
        if(test3(matrixBoard[0][0], matrixBoard[1][2], matrixBoard[0][2], matrixBoard[2][2], matrixBoard[0][1])){
            if(this.hasMiddle) return 1;
            else return 8;
        }
        if(test3(matrixBoard[2][0], matrixBoard[1][2], matrixBoard[0][2], matrixBoard[2][2], matrixBoard[2][1])){
            if(this.hasMiddle) return 7;
            else return 2;
        }

        //X?X
        //?00
        //??0
        if (test3(matrixBoard[0][0], matrixBoard[0][2], matrixBoard[1][1], matrixBoard[1][2], matrixBoard[2][2])) {
            return 8;
        }
        if (test3(matrixBoard[1][2], matrixBoard[0][0], matrixBoard[1][1], matrixBoard[0][1], matrixBoard[0][2])) {
            return 2;
        }
        if (test3(matrixBoard[2][0], matrixBoard[2][2], matrixBoard[1][1], matrixBoard[1][0], matrixBoard[0][0])) {
            return 0;
        }
        if (test3(matrixBoard[0][2], matrixBoard[2][2], matrixBoard[1][1], matrixBoard[2][1], matrixBoard[2][0])) {
            return 6;
        }
        if (test3(matrixBoard[0][0], matrixBoard[0][2], matrixBoard[1][1], matrixBoard[1][0], matrixBoard[2][0])) {
            return 6;
        }
        if (test3(matrixBoard[1][2], matrixBoard[0][0], matrixBoard[1][1], matrixBoard[2][1], matrixBoard[2][2])) {
            return 8;
        }
        if (test3(matrixBoard[2][0], matrixBoard[2][2], matrixBoard[1][1], matrixBoard[1][2], matrixBoard[0][2])) {
            return 2;
        }
        if (test3(matrixBoard[0][2], matrixBoard[2][2], matrixBoard[1][1], matrixBoard[0][1], matrixBoard[0][0])) {
            return 0;
        }

        // if no move was made, make a random move
        return this._getRandomMove();

        // helper functions

        function checkWinConsteleation(value) {
            //horizontal
            for(const i in matrixBoard) {
                if(test1(matrixBoard[i][0], matrixBoard[i][1], matrixBoard[i][2])){
                    const tes = test2(value, matrixBoard[i][0], matrixBoard[i][1], matrixBoard[i][2]);
                    if(tes !== false){ // comparison needed to avoid 0 = false
                        return 3 * i + tes * 1;
                    }
                }
            }
            //vertical
            for(const i in matrixBoard) {
                if(test1(matrixBoard[0][i], matrixBoard[1][i], matrixBoard[2][i])){
                    const tes = test2(value, matrixBoard[0][i], matrixBoard[1][i], matrixBoard[2][i]);
                    if(tes !== false){ // comparison needed to avoid 0 = false
                        return 3 * tes + i * 1;
                    }
                }
            }
            //diagonal \
            if(test1(matrixBoard[0][0], matrixBoard[1][1], matrixBoard[2][2])){
                const tes = test2(value, matrixBoard[0][0], matrixBoard[1][1], matrixBoard[2][2]);
                if(tes !== false){ // comparison needed to avoid 0 = false
                    return 4 * tes;
                }
            }
            //diagonal /
            if(test1(matrixBoard[0][2], matrixBoard[1][1], matrixBoard[2][0])){
                const tes = test2(value, matrixBoard[0][2], matrixBoard[1][1], matrixBoard[2][0]);
                if(tes !== false){ // comparison needed to avoid 0 = false
                    return 2 * tes + 2;
                }
            }

            return false;
        }


        /**
        * This function checks if in a row or column or diagonal there are two same symbols and one empty field.
        */
        function test1(a, b, c) {
            const amountOfUndefined = [a, b, c].filter((el) => el === undefined).length;
            if (amountOfUndefined === 1) {
                return a === b || a === c || b === c;
            }
            return false;
        }

        function test2(value, a, b, c) {
            const amountOfUndefined = [a, b, c].filter((el) => el === undefined).length;
            const amountOfValue = [a, b, c].filter((el) => el === value).length;
            if (amountOfUndefined === 1 && amountOfValue === 2) {
                return [a, b, c].findIndex((el) => el === undefined);
            }
            return false;
        }

        function test3(a, b, c, d, e){
            return ((a === 1) && (b === 1) && (c === undefined) && (d === undefined) && (e === undefined));
        }

        function boardToMatrix(board) {
            const map = board.map((el) => {
                switch (el) {
                    case 'X': return 1;
                    case 'O': return 2;
                    default: return undefined;
                }
            });
            return [[
                map[0], map[1], map[2]
            ], [
                map[3], map[4], map[5]
            ], [
                map[6], map[7], map[8]
            ]];
        }
    }

    _getRandomMove() {
        let move;
        do {
            move = Math.floor(Math.random() * 9);
        } while (this.board[move]);
        return move;
    }

    reset() {
        this.turn = playerSymbols[1];
        this.lastMoveMemory = undefined;
        this.hasMiddle = false;
        super.reset();
    }

}

class MediumBot extends HardBot {
    constructor() {
        super();
    }

    _getBotMove(playerMove) {
        if (Math.random() < _botDifficulties['medium']) {
            return super._getBotMove(playerMove);
        } else {
            return super._getRandomMove();
        }
    }
}

class EasyBot extends HardBot {
    constructor() {
        super();
    }

    _getBotMove() {
        if (Math.random() < _botDifficulties['easy']) {
            return super._getBotMove();
        } else {
            return super._getRandomMove();
        }
    }
}

class OnlineMultiplayer extends LocalMultiplayer {
    constructor() {
        super();
        this.socket = io(host);
        this.rematchAsked = false;
        this.isOnline = false;
        this.inChatInput = false;
        this.keyPair = null;
        this.otherPersonsKey = null;
        this.aesKey = null;
        this.serverId = null;
        this.inOpenChat = false;
        this.unreadMessages = 0;
        this.isInQueue = false;
        this.chatEnabled = true;

        this.noFillter = localStorage.getItem('nofillter');
        if (this.noFillter === null) {
            this.noFillter = false;
            localStorage.setItem('nofillter', false);
        }

        this.initSocketBound = this.initSocket.bind(this);
        this.initSocketBound();
        this.initEvents();
    }

    makeMove(index) {
        if (!this.isAnimating) {
            this.socket.emit('turn', index);
        }
    }

    rematch() {
        if (!this.rematchAsked) {
            this.socket.emit('rematch');
            document.getElementById('reset').classList.add('disabled');
        } else {
            this.socket.emit('rematchAccept');
        }
    }

    reset() {
        document.getElementById('reset').style = 'visibility:hidden';
        this.socket.emit('reset');
        this.rematchAsked = false;
        super.reset();
    }

    async neu() {
        const name = document.getElementById('inpu').value.trim();
        if (!name) {
            showAlert('Bitte gib einen Namen ein');
            return;
        }
        this.emitQueueEvent(name);
        this.isOnline = true;
        localStorage.setItem('nameOnline', name);

        fadeButton(true);
        if (animationSpeed > 0) {
            await sleep(animationSpeed);
        }
    }

    emitQueueEvent(name) {
        this.socket.emit('conn', name, 1);
    }

    initSocket() {
        // this.socket events
        this.socket.on('queueIn', async () => {
            this.isInQueue = true;
            // Event when player is in queue
            if (('Notification' in window) && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
                Notification.requestPermission().then(() => {
                    closeModal();
                });
                showAlert('Hallo, wenn du dem Popup zur Benachrichtigungsberechtigung zustimmst, erhältst du nur Nachrichten, wenn ein Gegner gefunden wird, während du in der Warteschlange bist.<br>Bei Ablehnung wirst du nicht nochmals gefragt.');
            }
            document.getElementById('help').classList.add('dontDisplay');
            this.closeChat();
            document.getElementById('chat-content').innerHTML = '<center><b>Du solltest noch nicht hier sein!</b></center>';
            this.typing(false);
            fadeout(() => {
                document.getElementById('gameMenuContainer').classList.add('dontDisplay');
                document.getElementById('gameBoardContainer').classList.add('dontDisplay');
                document.getElementById('queueAnimationContainer').classList.remove('dontDisplay');
                document.getElementById('multiplayer').classList.add('dontDisplay');
                document.getElementById('pin').classList.remove('dontDisplay');
            })();
        });

        this.socket.on('queueOut', async (playerSymbol, enemySymbol, enemyName) => {
            // Event when player finds an enemy
            this.player1.symbol = playerSymbol;
            this.player2.symbol = enemySymbol;
            this.player2.name = enemyName;
            // Do not show notification if the player finds an enemy instantly
            if (('Notification' in window) && Notification.permission === 'granted' && this.isInQueue) {
                new Notification('Gegner ' + enemyName + ' will gegen dich spielen');
            }
            this.isInQueue = false;

            fadeout(() => {
                document.getElementById('youAre').innerHTML = 'You are ' + playerSymbol;
                document.getElementById('gameMenuContainer').classList.add('dontDisplay');
                document.getElementById('gameBoardContainer').classList.remove('dontDisplay');
                document.getElementById('queueAnimationContainer').classList.add('dontDisplay');
                document.getElementById('multiplayer').classList.add('dontDisplay');
                document.getElementById('help').classList.remove('dontDisplay');
                document.getElementById('chat').classList.remove('dontDisplay');
                document.getElementById('score').innerHTML = playerSymbol + ': 0 vs. ' + enemySymbol + ': 0';
                document.getElementById('pin').classList.remove('dontDisplay');
            })();

            showAlert('Gegner: ' + enemyName);
            
            try {
                //clear old keys
                this.keyPair = null;
                this.otherPersonsKey = null;
                this.aesKey = null;

                //encryption setup
                const keyPair = await this.generateKeyPair();
                this.keyPair = keyPair;
                const pk = await this.exportPublicKey(keyPair);
                this.socket.emit('publicKey', pk);
                // check if the other player has already sent his key
                if (this.otherPersonsKey) {
                    this.tryToGenerateAESKey();
                }
            }
            catch (e){
                console.error(e);
                this.disableChat();
            }
        });

        this.socket.on('turned', (...args) => {
            this.performTurn(...args);
        });

        this.socket.on('win', (winner, punkteSelf, punkteEnemy) => {
            if(winner === this.player1.symbol){
                document.getElementById('score').innerHTML = this.player1.symbol + ': ' + punkteSelf + ' vs. ' + this.player2.symbol + ': ' + punkteEnemy;
                showAlert('Du hast gewonnen');
                this.chatWrite('system', 'Du hast gewonnen');
                this.turn = this.player2.symbol;
            }
            else{
                document.getElementById('score').innerHTML = this.player1.symbol + ': ' + punkteEnemy + ' vs. ' + this.player2.symbol + ': ' + punkteSelf;
                showAlert('Du hast verloren');
                this.chatWrite('system', 'Du hast verloren');
                this.turn = this.player1.symbol;
            }
        });

        this.socket.on('showReset', () => {
            document.getElementById('reset').style = 'visibility:visible';
        });

        this.socket.on('rematchask', () => {
            document.getElementById('reset').innerHTML = 'Rematch Akzeptieren';
            document.getElementById('reset').classList.remove('disabled');
            this.rematchAsked = true;
        });

        this.socket.on('reset', () => {
            this.reset();
            document.getElementById('reset').innerHTML = 'Rematch';
            document.getElementById('reset').classList.remove('disabled');
        });

        this.socket.on('turnreset', () => {
            document.getElementById('turn').innerHTML = this.player1.symbol;
        });

        this.socket.on('erro', () => {
            showAlert('Error:<br>Bitte starte dein Spiel neu', false);
            this.err();
        });

        this.socket.on('pong', () => {
            this.showPing(Date.now() - this.pingStart);
        });

        this.socket.on('serverRestart', async (server) => {
            if((this.serverId !== server) && (this.serverId !== null)){
                showAlert('Bitte starte dein Spiel neu.<br>Es gab einen Server Neustart', false);
                this.err();
            }
            else{
                this.serverId = server;
            }
        });

        this.socket.on('blu2', () => {
            this.typing(false);
        });

        this.socket.on('startChat', () => {
            document.getElementById('chat-content').innerHTML = '';
            this.chatWrite('system', 'Dies ist der Anfang deines Chats mit ' + this.player2.name);
        });

        this.socket.on('receiveMessage', async (data) => {
            let msg;
            msg = await this.decryptMessage(data);
            this.chatWrite('other', msg);

        });

        this.socket.on('getKey', (key) => {
            this.otherPersonsKey = key;
            this.tryToGenerateAESKey();
        });

        this.socket.on('foc2', () => {
            this.typing(true);
        });
    }

    initEvents() {
        document.onkeydown = (event) => {
            if(event.key === 'Enter'){
                if(!this.isOnline){
                    this.neu();
                }
                else if(this.inChatInput){
                    this.sendChat();
                }
            }
        };
        this.intervall = setInterval(this.ping.bind(this), 1000);
    }

    disconnect(){
        this.socket.emit('dis');
        clearInterval(this.intervall);

        // Reset this
        this.isOnline = false;
        this.keyPair = null;
        this.otherPersonsKey = null;
        this.aesKey = null;
        this.inOpenChat = false;
        this.inChatInput = false;
        this.unreadMessages = 0;
        this.isInQueue = false;
    }

    ping(){
        this.pingStart = Date.now();
        this.socket.emit('ping');
    }

    showPing(ping){
        const oldPing = parseInt(document.getElementById('ping').innerHTML);
        // To smooth out the ping, the new ping is averaged with the old ping
        document.getElementById('ping').innerHTML = Math.ceil((oldPing + ping) / 2);
    }

    performTurn(turnPlayerSymbol, otherPlayerSymbol, index) {
        this.getElement(index).innerHTML = turnPlayerSymbol;
        document.getElementById('turn').innerHTML = otherPlayerSymbol;
        this.board[index] = turnPlayerSymbol;
    }

    disableChat(){
        this.chatEnabled = false;
        document.getElementById('chat').classList.add('dontDisplay');
        showAlert('Der Chat wurde deaktiviert, da die Verschlüsselung fehlgeschlagen ist.');
    }

    typing(isTyping){
        if(isTyping){
            document.getElementById('cha').classList.remove('fa-comment');
            document.getElementById('cha').classList.add('fa-comment-dots');
        }
        else{
            document.getElementById('cha').classList.remove('fa-comment-dots');
            document.getElementById('cha').classList.add('fa-comment');
        }
        this.typingIn(isTyping);
    }

    async openChat(){
        if (!this.aesKey) {
            // fail safe code in case the 2 socket messages missed each other
            await this.tryToGenerateAESKey();
        }
        if (!this.chatEnabled || !this.aesKey) {
            return
        }
        if(this.noFillter){
            chat.classList.remove('dontDisplay');
            await sleep(100);
            document.getElementById('chat-window').classList.add('movechat');
            chat.classList.add('chatopa');
            this.unread(0);
            this.unreadMessages = 0;
            this.inOpenChat = true;
        }
        else{
            this.chatWarning();
        }
    }

    async chatWarning(){
        showAlert('Der Chat besitzt keinerlei Wortfilter!<br>Die Webseite hat nichts mit den Inhalten welche Übermittelt werden zu tun und  übernimmt keinerlei Haftung für jegliche von dritter Übermittelte Inhalte!<br><div  align=\'left\' style=\'float:left;\'><button onclick=\'chatOk();\'>Okay verstanden</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'closeModal()\'>Kein Interesse</button></div>', false);
    }

    async closeChat(){
        document.getElementById('chat-window').classList.remove('movechat');
        chat.classList.remove('chatopa');
        this.inOpenChat = false;
        this.inChatInput = false;
        await sleep(animationSpeed);
        chat.classList.add('dontDisplay');
    }

    async sendChat() {
        let message = document.getElementById('chatinputbox').value;
        message = message.trim();
        if (message !== '') {
            message = this.htmlEscapeSpecialChars(message);

            const msg = await this.encryptMessage(message);
            this.socket.emit('sendMessage', msg);
            this.chatWrite('me', message);

        }
        document.getElementById('chatinputbox').value = '';
    }

    nachrichtPlus(amount){
        if(!this.inOpenChat){
            this.unreadMessages += amount;
            this.unread(this.unreadMessages);
        }
    }

    focusChatInput(){
        this.socket.emit('foc1');
        this.inChatInput = true;
    }

    blurChatInput(){
        this.socket.emit('blu1');
        this.inChatInput = false;
    }

    async generateKeyPair() {
        return crypto.subtle.generateKey(
            {
            name: "ECDH",
            namedCurve: "P-256", // Can also use "P-384" or "P-521"
            },
            true, // Key is extractable
            ["deriveKey"]
        );
    }
        
    async exportPublicKey(keyPair) {
        return crypto.subtle.exportKey("raw", keyPair.publicKey);
        }
        
    async importPublicKey(rawKey) {
        return crypto.subtle.importKey(
            "raw",
            rawKey,
            {
            name: "ECDH",
            namedCurve: "P-256",
            },
            true,
            []
        );
    }
        
    async deriveSharedSecret(privateKey, publicKey) {
        return crypto.subtle.deriveKey(
            {
            name: "ECDH",
            public: publicKey,
            },
            privateKey,
            { name: "AES-GCM", length: 256 }, // Derived key type
            true,
            ["encrypt", "decrypt"]
        );
    }

    tryToGenerateAESKey() {
        if (this.otherPersonsKey !== null && this.keyPair !== null && this.aesKey === null) {
            return this.importPublicKey(this.otherPersonsKey).then((publicKey) => {
                this.deriveSharedSecret(this.keyPair.privateKey, publicKey).then((aesKey) => {
                    this.aesKey = aesKey;
                }).catch((error) => {
                    console.error("Error deriving shared secret:", error);
                });
            }).catch((error) => {
                console.error("Error importing public key:", error);
            }).finally(() => {
                // cleanup
                this.keyPair = null;
                this.otherPersonsKey = null;
            });
        }
    }
    
    // Encrypt the message using the public key
    async  encryptMessage(data) {
        if (this.aesKey === null) {
            // code in case the 2 socket messages missed each other
            await this.tryToGenerateAESKey();
        }
        if (this.aesKey === null) {
            this.disableChat();
            return;
        }

        const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            this.aesKey,
            new TextEncoder().encode(data)
        );
        console.log('decrypted', this.decryptMessage({ iv, encrypted }));
        return { iv, encrypted };
    }
      

    // Decrypt the ciphertext using the private key
    async decryptMessage(data) {
        if (this.aesKey === null) {
            // code in case the 2 socket messages missed each other
            await this.tryToGenerateAESKey();
        } else if (this.aesKey === null) {
            this.disableChat();
            return;
        }
        const { iv, encrypted } = data;
        try {
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                    tagLength: 128,
                },
                this.aesKey,
                encrypted
            );
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            // Handle decryption errors
            if (error.name === "OperationError") {
                // This error can indicate a problem with the decryption operation,
                // such as a wrong tag or tampered ciphertext
                showAlert('Fehler bei der Entschlüsselung. Möglicherweise wurde die Nachricht manipuliert!');
            } else {
                // Other errors
                console.error("Error decrypting message:", error);
                return '<i>Nachricht konnte nicht entschlüsselt werden</i>';
            }
        }
        return "";
    }
      

    updateStyle(content) {
        const yourscripttag = document.getElementById('chatt');
        if (yourscripttag) {
            yourscripttag.remove();
        }
        const newscript = document.createElement('style');
        newscript.id = 'chatt';
        newscript.appendChild(document.createTextNode(content));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }

    unread(amount) {
        if (amount === 0) {
            this.updateStyle('#cha::after{display:none;content:\'0\'}');
        } else if (amount > 9) {
            this.updateStyle('#cha::after{display:block;content:\'9+\'}');
        } else if (amount > 0) {
            this.updateStyle('#cha::after{display:block;content:\'' + amount + '\'}');
        }
    }

    async chatOk () {
        this.noFillter = true;
        localStorage.setItem('nofillter', true);
        chat.classList.remove('dontDisplay');
        await sleep(100);
        document.getElementById('chat-window').classList.add('movechat');
        chat.classList.add('chatopa');
        this.unread(0);
        this.unreadMessages = 0;
        this.inOpenChat = true;
    }

    typingIn(isTyping){
        const yourscripttag = document.getElementById('typingg');
        yourscripttag.remove();
        const newscript = document.createElement('style');
        newscript.id = 'typingg';
        if(isTyping){
            newscript.appendChild(document.createTextNode('#chat-content:after{display:block}'));
        }
        else{
            newscript.appendChild(document.createTextNode('#chat-content:after{display:none}'));
        }
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }

    chatWrite(wer, was){
        let text;
        was = this.htmlEscapeSpecialChars(was);
        if(wer === 'system'){
            text = '<center><p style=\'font-style: italic;\'>' + was + '</p></center>';
        }
        else if(wer === 'me'){
            text = '<p style=\'text-align: end;\'>' + was + '</p>';
        }
        else if(wer === 'other'){
            text = '<p>' + was + '</p>';
            this.nachrichtPlus(1);
        }
        document.getElementById('chat-content').innerHTML = document.getElementById('chat-content').innerHTML + text;
    }

    htmlEscapeSpecialChars(text) {
        const specialChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&apos;'};
        return text.replace(/[&<>"#]/g, find => specialChars[find]);
    }

    err() {
        const newmeta = document.createElement('meta');
        newmeta.httpEquiv = 'refresh';
        newmeta.content = '5; URL=https://oberhofer.ddns.net/ttt';
        document.getElementsByTagName('head').item(0).appendChild(newmeta);
    }

}

class ExperimentalOnlineMultiplayer extends OnlineMultiplayer {

    constructor() {
        super();
        this.experimental = undefined;
    }

    initSocket() {
        super.initSocket();
        this.socket.on('queueOut', async () => {
            if (this.experimental === undefined) {
                this.experimental = new ExperimentalLocalMultiplayer();
            }
        });
    }

    // some more stuff for external rechability
    disableTutorialHint() {
        this.experimental.disableTutorialHint();
    }
    tutorialJa() {
        this.experimental.tutorialJa();
    }
    animation() {
        this.experimental.animation();
    }

    emitQueueEvent(name) {
        this.socket.emit('conn', name, 2);
    }

    performTurn(turnPlayerSymbol, otherPlayerSymbol, index, oldPosition, moveKind) {
        switch (moveKind) {
            case 'move':
                super.performTurn(turnPlayerSymbol, otherPlayerSymbol, index);
                break;
            case 'red':
                this.getElement(index).style.color = 'red';
                break;
            case 'remove':
                this.getElement(oldPosition).removeAttribute('style');
                break;
            case 'changeSelect':
                this.getElement(oldPosition).removeAttribute('style');
                this.getElement(index).style.color = 'red';
                break;
            case 'reposition':
                this.getElement(oldPosition).innerHTML = '';
                this.getElement(oldPosition).removeAttribute('style');
                super.performTurn(turnPlayerSymbol, otherPlayerSymbol, index);
                break;
        }
    }
}