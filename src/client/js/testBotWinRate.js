/* eslint-disable no-undef */
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
    }

    _afterTurn() {
        this._winningLogic();
        this._switchTurn();
    }

    _switchTurn() {
        this.turn = this.turn === playerSymbols[1] ? playerSymbols[2] : playerSymbols[1];
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
        }
    }

    rematch() {
        this.reset();
    }

    reset() {
        this.board = new Array(9).fill(null);
        this.winner = null;
        this.moves = 0;
        this._reset_GUI();
    }

    _reset_GUI() {
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
        console.error('Bot could not find a move');
        let move;
        do {
            move = Math.floor(Math.random() * 9);
        } while (this.board[move]);
        return move;

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

    reset() {
        this.turn = playerSymbols[1];
        this.lastMoveMemory = undefined;
        this.hasMiddle = false;
        super.reset();
    }

}

module.exports = HardBot;

const simulateesGame = 10;

const bot = new HardBot();

let playerWin = 0;
let botWin = 0;
for (let game = 0; game < simulateesGame; game++) {

    for (let i = 0; i <= 999999; i++) {
        const moves = i.toString().padStart(9, '0').split('').map(Number);
        while (!bot.winner) {
            let move = moves.shift();
            if (move === undefined) {
                console.log('Run out of moves');
                break;
            }
            let mov;
            do {
                mov = bot.makeMove(move);
                move = move + 1 % 9;
            } while (!mov);
        }
        if (bot.winner === 1) {
            playerWin++;
        } else {
            botWin++;
        }
        bot.reset();
    }
    console.log('Simulated all possible games once');
}
console.log('Player wins:', playerWin);
console.log('Bot wins:', botWin);

