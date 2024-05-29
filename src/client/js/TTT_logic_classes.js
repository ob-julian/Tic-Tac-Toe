/* global showAlert, sleep, io, fadebutton, animationSpeed, fadeout, host, closeModal, chat */
/* exported LocalMultiplayer, ExperimentalLocalMultiplayer, HardBot, MediumBot, EasyBot, OnlineMultiplayer */

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

        this._reset_GUI();
        document.getElementById('score').innerHTML = 'X: ' + this.player1.score + ' vs. O: ' + this.player2.score;
    }

    makeMove(index) {
        if (this.board[index] || this.winner) {
            return false;
        }
        this._makeUncheckedMove(index);
        this._afterTurn();
        return true;
    }

    _makeUncheckedMove(index) {
        this.board[index] = this.turn;
        this.moves++;
        document.getElementById('a' + index).innerHTML = this.turn;
    }

    _afterTurn() {
        this._winningLogic();
        this._switchTurn();
    }

    _switchTurn() {
        this.turn = this.turn === playerSymbols[1] ? playerSymbols[2] : playerSymbols[1];
        document.getElementById('turn').innerHTML = 'Turn: ' + this.turn;
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
        document.getElementById('help').style.display = 'none';
        showAlert('<b>Hilfe</b><br><br>Willst du ein Tutorial zu diesem Spielmodus?<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'tutorialJa()\'>Ja</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'closeModal()\'>Nein</button></div>', false);
    }

    tutorialJa() {
        showAlert('<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style=\'color:#50ff1e\'>X</span> und <span style=\'color:#50ff1e\'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diargonalen zu haben.<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'closeModal()\'>Ok</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'anination()\'>Animation</button></div>', false);
    }

    async anination(){
        const bac = document.getElementsByClassName('back');
        for(let i = 0; i < 4; i++)
            bac[i].style.display = 'none';
            document.getElementById('help').style.display = 'none';
        for(let www = 0; www < 9; www++)
            document.getElementById('a' + www).innerHTML = '';
        closeModal();
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
        // reinstating the board
        for(let i = 0; i < 9; i++)
            document.getElementById('a' + i).innerHTML = '';
        document.getElementById('help').style.display = 'block';
        for(let i = 0; i < 4; i++)
            bac[i].removeAttribute('style');
        this.tutorialJa();
    }

    reset() {
        this.board = new Array(9).fill(null);
        this.winner = null;
        this.moves = 0;
        this._reset_GUI();
    }

    _reset_GUI() {
        for (let i = 0; i < 9; i++) {
            document.getElementById('a' + i).innerHTML = '';
        }
        document.getElementById('reset').style = 'visibility:hidden';
        document.getElementById('turn').innerHTML = 'Turn: ' + this.turn;
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
            document.getElementById('help').style.display = 'block';
        }
    }

    makeMove(index) {
        if (this.moves < 6) {
            super.makeMove(index);
        } else {
            if (!this.selectedField && this.board[index] === this.turn) {
                // Player clicked empty field and has not selected a field before
                this.selectedField = index;
                document.getElementById('a' + index).style.color = 'red';
            } else if (this.selectedField === index) {
                // Player clicked the same field again
                this.selectedField = null;
                document.getElementById('a' + index).removeAttribute('style');
            } else if (this.selectedField && this.board[index] === this.turn) {
                // Player selected a field and clicked on their own symbol
                document.getElementById('a' + this.selectedField).removeAttribute('style');
                document.getElementById('a' + index).style.color = 'red';
                this.selectedField = index;
            } else if (this.selectedField && !this.board[index]) {
                // Player selected a field and clicked on an empty field
                this.board[index] = this.turn;
                this.board[this.selectedField] = null;
                document.getElementById('a' + this.selectedField).innerHTML = '';
                document.getElementById('a' + index).innerHTML = this.turn;
                document.getElementById('a' + this.selectedField).removeAttribute('style');
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
        showAlert('<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style=\'color:#50ff1e\'>X</span> und <span style=\'color:#50ff1e\'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diargonalen zu haben.<br>Der Unterschied zum normalen Spiel besteht jedoch darin, dass jeder nur 3 Zeichen besitzt.<br>Wenn alle gesetzt worden sind, werden die Zeichen auf den Feldern solange versetzt, bis einer Gewonnen hat.<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'closeModal()\'>Ok</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'anination()\'>Animation</button></div>', false);
    }

    async anination() {
        const bac = document.getElementsByClassName('back');
        for(let i = 0; i < 4; i++)
            bac[i].style.display = 'none';
        document.getElementById('help').style.display = 'none';
        for(let www = 0; www < 9; www++)
            document.getElementById('a' + www).innerHTML = '';
        closeModal();
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
        // reinstating the board
        for(let i = 0; i < 9; i++)
            document.getElementById('a' + i).innerHTML = '';
        document.getElementById('help').style.display = 'block';
        for(let i = 0; i < 4; i++) bac[i].removeAttribute('style');
        this.tutorialJa();
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
        this.rematch = false;
        this.isOnline = false;
        this.inChatInput = false;
        this.publicKey = null;
        this.privateKey = null;
        this.serverId = null;
        this.inOpenChat = false;
        this.unreadMessages = 0;

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
        this.socket.emit('turn', index);
    }

    rematch() {
        if (this.rematch) {
            this.socket.emit('rematch');
            document.getElementById('reset').disabled = true;
        } else {
            this.socket.emit('rematchAccept');
        }
    }

    reset() {
        this.socket.emit('reset');
        this.rematch = false;
        super.reset();
    }

    async neu() {
        const name = document.getElementById('inpu').value;
        this.socket.emit('conn', name, 1);
        this.isOnline = true;
        localStorage.setItem('nameOnline', name);

        fadebutton(true);
        if (animationSpeed > 0) {
            await sleep(animationSpeed);
        }
    }

    initSocket() {
        // this.socket events
        this.socket.on('queueIn', async () => {
            if (('Notification' in window) && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
                Notification.requestPermission();
                showAlert('Hallo, wenn du dem Popup zur Benachrichtigungsberechtigung zustimmst, erhältst du nur Nachrichten, wenn ein Gegner gefunden wird, während du in der Warteschlange bist.<br>Bei Ablehnung wirst du nicht nochmals gefragt.');
            }
            document.getElementById('help').style.display = 'none';
            this.closeChat();
            document.getElementById('chat-content').innerHTML = '<center><b>Du solltest noch nicht hier sein!</b></center>';
            this.typing(false);
            fadeout(() => {
                document.getElementById('div0').style = 'display:none';
                document.getElementById('div1').style = 'display:none';
                document.getElementById('div2').style = 'display:block';
                document.getElementById('multiplayer').style = 'display:none';
                document.getElementById('pin').style.display = 'block';
            })();
        });

        this.socket.on('queueOut', async (playerSymbol, enemySymbol, enemyName) => {
            this.player1.symbol = playerSymbol;
            this.player2.symbol = enemySymbol;
            this.player2.name = enemyName;
            if (('Notification' in window) && Notification.permission === 'granted') {
                new Notification('Gegner ' + enemyName + ' will gegen dich spielen');
            }

            fadeout(() => {
                document.getElementById('youAre').innerHTML = 'You are ' + playerSymbol;
                document.getElementById('div0').style = 'display:none';
                document.getElementById('div1').style = 'display:block';
                document.getElementById('div2').style = 'display:none';
                document.getElementById('multiplayer').style = 'display:none';
                document.getElementById('help').style.display = 'block';
                document.getElementById('chat').style.display = 'block';
                document.getElementById('score').innerHTML = playerSymbol + ': 0 vs. ' + enemySymbol + ': 0';
            })();

            showAlert('Gegner: ' + enemyName);
            //encryption setup
            const keyPair = await this.generateKeyPair();
            try {
                this.privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
                const pk = await crypto.subtle.exportKey('spki', keyPair.publicKey);
                this.socket.emit('publicKey', pk);
            }
            catch (e){
                console.error(e);
            }
        });

        this.socket.on('turned', (turnPlayerSymbol, otherPlayerSymbol, index) => {
            document.getElementById('a' + index).innerHTML = turnPlayerSymbol;
            document.getElementById('turn').innerHTML = 'Turn: ' + otherPlayerSymbol;
            this.board[index] = turnPlayerSymbol;
        });

        this.socket.on('win', (winner, punkteSelf, punkteEnemy) => {
            if(winner === this.player1.symbol){
                document.getElementById('score').innerHTML = this.player1.symbol + ': ' + punkteSelf + ' vs. ' + this.player2.symbol + ': ' + punkteEnemy;
                showAlert('Du hast gewonnen');
                this.chatWrite('system', 'Du hast gewonnen');
            }
            else{
                document.getElementById('score').innerHTML = this.player1.symbol + ': ' + punkteEnemy + ' vs. ' + this.player2.symbol + ': ' + punkteSelf;
                showAlert('Du hast verloren');
                this.chatWrite('system', 'Du hast verloren');
            }
        });

        this.socket.on('showReset', () => {
            document.getElementById('reset').style = 'visibility:visible';
        });

        this.socket.on('rematchask', () => {
            document.getElementById('reset').innerHTML = 'Accept Rematch';
            this.rematch = true;
        });

        this.socket.on('reset', () => {
            document.getElementById('reset').innerHTML = 'Rematch';
            this.rematch = false;
            document.getElementById('reset').disabled = false;
            this.reset();
        });

        this.socket.on('turnreset', () => {
            document.getElementById('turn').innerHTML = 'Turn: O';
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

        this.socket.on('receiveMessage', async (gg) => {
            let msg;
            try {
                msg = await this.decrypt(gg, this.privateKey);
                this.chatWrite('other', msg);
            } catch {
                showAlert('Error while decrypting message. Disabling Chat.');
            }
        });

        this.socket.on('getKey', (key) => {
            this.publicKey = key;
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
        document.getElementById('pin').style.display = 'none';
        document.getElementById('help').style.display = 'none';
        document.getElementById('chat').style.display = 'none';
        clearInterval(this.intervall);

        // Reset this
        this.isOnline = false;
        this.publicKey = null;
        this.privateKey = null;
        this.inOpenChat = false;
        this.inChatInput = false;
        this.unreadMessages = 0;

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

    async chatting(){
        if(this.noFillter){
            chat.style.display = 'block';
            await sleep(100);
            document.getElementsByClassName('chat-window')[0].classList.add('movechat');
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
        showAlert('Der Chat besitzt keinerlei Worfilter!<br>Die Webseite hat nichts mit den Inhalten welche Übermittelt werden zu tun und  übernimmt keinerlei Haftung für jegliche von dritter Übermittelte Inhalte!<br><div  align=\'left\' style=\'float:left;\'><button onclick=\'chatOk();\'>Okay verstanden</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'closeModal()\'>Kein Interesse</button></div>', false);
    }

    async closeChat(){
        document.getElementsByClassName('chat-window')[0].classList.remove('movechat');
        chat.classList.remove('chatopa');
        this.inOpenChat = false;
        this.inChatInput = false;
        await sleep(animationSpeed);
        chat.style.display = 'none';
    }

    async sendChat() {
        let message = document.getElementById('chatinputbox').value;
        message = message.trim();
        if (message !== '') {
            message = this.htmlEscapeSpecialChars(message);
            if (this.publicKey === null || this.publicKey === '')
                showAlert('Encryption not set up properly. Chat disabled.');
            else
                try {
                    const msg = await this.encrypt(message, this.publicKey);
                    this.socket.emit('sendMessage', msg);
                    this.chatWrite('me', message);
                } catch {
                    showAlert('Encryption failed. Disabling Chat.');
                }
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
        return await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 1024, // can be 1024, 2048, or 4096
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    // Encrypt the message using the public key
    async encrypt(message, publicKey) {
        const array = new TextEncoder().encode(message);
        const cryptoKey = await crypto.subtle.importKey(
            'spki',
            publicKey,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            false,
            ['encrypt']
        );
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            cryptoKey,
            array
        );
        return new Uint8Array(ciphertext);
    }

    // Decrypt the ciphertext using the private key
    async decrypt(ciphertext, privateKey) {
        const array = new Uint8Array(ciphertext);
        const cryptoKey = await crypto.subtle.importKey(
            'pkcs8',
            privateKey,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            true,
            ['decrypt']
        );
        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP'
            },
            cryptoKey,
            array
        );
        return new TextDecoder().decode(decrypted);
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
        chat.style.display = 'block';
        await sleep(100);
        document.getElementsByClassName('chat-window')[0].classList.add('movechat');
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
        //<meta http-equiv="refresh" content="5; URL=http://meine zieladresse">
        const newmeta = document.createElement('meta');
        newmeta.httpEquiv = 'refresh';
        newmeta.content = '5; URL=https://oberhofer.ddns.net/ttt';
        document.getElementsByTagName('head').item(0).appendChild(newmeta);
    }

}