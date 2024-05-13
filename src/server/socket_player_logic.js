let playerSocketInQueueNormnal = undefined;
let playerSocketInQueueExperimental = undefined;

const playerStatus = {
    PLAYING: 1,
    QUEUE: 2,
    IDLE: 3
};

const modes = {
    undefined: 0,
    NORMAL: 1,
    EXPERIMENTAL: 2
};

const playerSymbole = {
    X: 'X',
    O: 'O',
    startSymbole: 'O'
};

const moveStatus = {
    select: 1,
    move: 2
};

function disconectPlayer(socket) {
    if(socket.status === playerStatus.PLAYING) {
        if (socket.otherPlayer) {
            socket.otherPlayer.mode = modes.IDLE;
            socket.otherPlayer.emit('resett');
            socket.otherPlayer.emit('turnreset');
            queue(socket.otherPlayer);
        }
        socket.otherPlayer = undefined;
        socket.emit('resett');
        socket.emit('turnreset');
        socket.mode = modes.IDLE;
    }
    else if(socket.status === playerStatus.QUEUE) {
        removePlayerFromQueue(socket);
        socket.mode = modes.IDLE;
    }
}

function removePlayerFromQueue(socket){
    switch(socket.mode){
        case modes.NORMAL:
            if (playerSocketInQueueNormnal === socket)
                playerSocketInQueueNormnal = undefined;
            else
                console.log('Cound not find player in queue');
            break;
        case modes.EXPERIMENTAL:
            if (playerSocketInQueueExperimental === socket)
                playerSocketInQueueExperimental = undefined;
            else
                console.log('Cound not find player in queue');
            break;
        default:
            console.log('Cound not find player in queue');
    }
}


function winner(socket){
    socket.point++;
    socket.emit('win', socket.playerSymbole, socket.point, socket.otherPlayer.point);
    socket.otherPlayer.emit('win', socket.playerSymbole, socket.point, socket.otherPlayer.point);

    resetPlayers(socket);
}

function resetPlayers(socket){
    resetPlayer(socket);
    if (socket.otherPlayer)
        resetPlayer(socket.otherPlayer);
}

function resetPlayer(socket){
    socket.emit('rese'); // show the player re reset screen
    socket.playingFieldLinearRepresentation = [3, 3, 3, 3, 3, 3, 3, 3, 3];
    socket.amountOfTurns = 0;
    socket.movingStatus = 1;
}

function initSocket(socket){
    socket.turn = playerSymbole.startSymbole;
    socket.point = 0;
    socket.amountOfTurns = 0;
    socket.amountOfTurns = 0;
    socket.movingStatus = 1;
    socket.positionToGetMoved = undefined;
    socket.playingFieldLinearRepresentation = [false, false, false, false, false, false, false, false, false];

    socket.status = playerStatus.PLAYING;
}


function queue(socket){
    if (socket.mode === modes.undefined || socket.status !== playerStatus.IDLE) {
        socket.emit('erro');
        return;
    };
    if(socket.mode === modes.NORMAL){
        //queue manager
        if(playerSocketInQueueNormnal === undefined) {
            playerSocketInQueueNormnal = socket;
            socket.emit('que', 1);
            socket.status = playerStatus.QUEUE;
        }
        else if(playerSocketInQueueNormnal !== socket) {
            socket.otherPlayer = playerSocketInQueueNormnal;
            playerSocketInQueueNormnal = undefined; // reset queue as fast as possible
            socket.otherPlayer.otherPlayer = socket;

            matchPlayers(socket);

            consolelog('Match betwen:' + socket.name + ' and ' + socket.otherPlayer.name + '; mode: normal');
        }
        else socket.emit('erro');
    }
    else if(socket.mode === 2){
        //queue manager
        if(playerSocketInQueueExperimental === undefined) {
            playerSocketInQueueExperimental = socket;
            socket.emit('que', 1);
            socket.status = playerStatus.QUEUE;
        }
        else if(playerSocketInQueueExperimental !== socket) {
            socket.otherPlayer = playerSocketInQueueExperimental;
            playerSocketInQueueExperimental = undefined; // reset queue as fast as possible
            socket.otherPlayer.otherPlayer = socket;

            matchPlayers(socket);

            consolelog('Match betwen:' + socket.name + ' and ' + socket.otherPlayer.name + '; mode: experimental');
        }
        else socket.emit('erro');
    }
};

function matchPlayers(socket){
    socket.playerSymbole = playerSymbole.X;
    socket.otherPlayer.playerSymbole = playerSymbole.O;

    socket.emit('que', 2, socket.playerSymbole, socket.otherPlayer.playerSymbole, socket.otherPlayer.name);
    socket.otherPlayer.emit('que', 2, socket.otherPlayer.playerSymbole, socket.playerSymbole, socket.name);

    initSocket(socket);
    initSocket(socket.otherPlayer);

    socket.emit('startChat');
    socket.otherPlayer.emit('startChat');
}

function sanitizeString(str) {
    // Code from https://github.com/validatorjs/validator.js/blob/master/src/lib/escape.js
    return (str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;'));
}


function socket_player_logic(io, serverId) {
    io.on('connection', (socket) => {
        socket.name = undefined;
        socket.otherPlayer = undefined;
        socket.status = playerStatus.IDLE;
        socket.turn = undefined; // saves who is on turn
        socket.point = 0;
        socket.amountOfTurns = 0; // saves the amount of turns
        socket.playerSymbole; // O or X
        socket.playingFieldLinearRepresentation = [false, false, false, false, false, false, false, false, false];
        socket.mode = modes.undefined;

        // experimental variables
        socket.movingStatus = 1; // represents the current state of the moving logic
        socket.positionToGetMoved = undefined; // represents the position that should be moved

        socket.on('disconnect', () => disconectPlayer(socket));

        socket.on('dis', () => disconectPlayer(socket));

        socket.on('conn', function(valu, mode){
            if (socket.status !== playerStatus.IDLE) {
                consolelog('Player ' + valu + ' tried to connect while already connected');
                return;
            }
            if (mode !== modes.undefined && Object.values(modes).includes(parseInt(mode))) {
                socket.mode = parseInt(mode);
            } else {
                socket.emit('erro');
                return;
            }
            socket.name = sanitizeString(valu);
            consolelog('Player ' + socket.name + ' connected for mode ' + mode);
            queue(socket);
        });

        socket.on('turn', function(linearTurnPosition){
            if (socket.status !== playerStatus.PLAYING || socket.mode === modes.undefined) {
                socket.emit('erro');
                return;
            }
            if (socket.turn !== socket.playerSymbole )
                return;

            if(socket.mode === modes.NORMAL){
                if(socket.playingFieldLinearRepresentation[linearTurnPosition] === false) {
                    socket.playingFieldLinearRepresentation[linearTurnPosition] = 1;
                    socket.otherPlayer.playingFieldLinearRepresentation[linearTurnPosition] = 2;
                    socket.turn = socket.otherPlayer.playerSymbole;
                    socket.otherPlayer.turn = socket.otherPlayer.playerSymbole;

                    socket.emit('turned', socket.playerSymbole, socket.otherPlayer.playerSymbole, linearTurnPosition);
                    socket.otherPlayer.emit('turned', socket.playerSymbole, socket.otherPlayer.playerSymbole, linearTurnPosition);
                } else {
                    return;
                }
            } else if(socket.mode === modes.EXPERIMENTAL){
                if((socket.playingFieldLinearRepresentation[linearTurnPosition] === false) && (socket.amountOfTurns < 6)){
                    socket.playingFieldLinearRepresentation[linearTurnPosition] = 1;
                    socket.otherPlayer.playingFieldLinearRepresentation[linearTurnPosition] = 2;
                    socket.turn = socket.otherPlayer.playerSymbole;
                    socket.otherPlayer.turn = socket.otherPlayer.playerSymbole;

                    socket.emit('turned', socket.playerSymbole, socket.otherPlayer.playerSymbole, linearTurnPosition, '', 'move');
                    socket.otherPlayer.emit('turned', socket.playerSymbole, socket.otherPlayer.playerSymbole, linearTurnPosition, '', 'move');
                }
                else if(socket.amountOfTurns >= 6){
                    // logic for moving around the field
                    if(socket.movingStatus === moveStatus.select && socket.playingFieldLinearRepresentation[linearTurnPosition] === 1){
                        // select the position to move
                        socket.positionToGetMoved = linearTurnPosition;
                        socket.movingStatus = moveStatus.move;

                        socket.emit('turned', '', '', linearTurnPosition, '', 'red');
                        socket.otherPlayer.emit('turned', '', '', linearTurnPosition, '', 'red');
                    } else if((socket.movingStatus === moveStatus.move) && (linearTurnPosition === socket.positionToGetMoved)){
                        // remove the selection
                        socket.emit('turned', '', '', '', socket.positionToGetMoved, 'rem');
                        socket.otherPlayer.emit('turned', '', '', '', socket.positionToGetMoved, 'rem');
                        socket.movingStatus = moveStatus.select;
                        socket.positionToGetMoved = undefined;
                    }
                    else if((socket.movingStatus ===  moveStatus.move) && ((socket.playingFieldLinearRepresentation[linearTurnPosition] === 1))){
                        // select the position to move
                        socket.emit('turned', '', '', linearTurnPosition, socket.positionToGetMoved, 'chan');
                        socket.otherPlayer.emit('turned', '', '', linearTurnPosition, socket.positionToGetMoved, 'chan');
                        socket.positionToGetMoved = linearTurnPosition;
                    }
                    else if((socket.movingStatus ===  moveStatus.move) && (socket.playingFieldLinearRepresentation[linearTurnPosition] === false)){
                        // move the selected position
                        socket.playingFieldLinearRepresentation[linearTurnPosition] = 1;
                        socket.otherPlayer.playingFieldLinearRepresentation[linearTurnPosition] = 2;
                        socket.playingFieldLinearRepresentation[socket.positionToGetMoved] = false;
                        socket.otherPlayer.playingFieldLinearRepresentation[socket.positionToGetMoved] = false;

                        socket.turn = socket.otherPlayer.playerSymbole;
                        socket.otherPlayer.turn = socket.otherPlayer.playerSymbole;
                        socket.movingStatus = moveStatus.select;
                        socket.positionToGetMoved = undefined;

                        socket.emit('turned', socket.playerSymbole, socket.otherPlayer.playerSymbole, linearTurnPosition, socket.positionToGetMoved, 'fin');
                        socket.otherPlayer.emit('turned', socket.playerSymbole, socket.otherPlayer.playerSymbole, linearTurnPosition, socket.positionToGetMoved, 'fin');
                    }
                }
            }

            //winning logic
            const playerNumber = 1;
            for(let row = 0;row < 9;row = row + 3)
            {
                const cell1 = socket.playingFieldLinearRepresentation[row];
                const cell2 = socket.playingFieldLinearRepresentation[row + 1];
                const cell3 = socket.playingFieldLinearRepresentation[row + 2];
                if((cell1 === cell2) && (cell2 === cell3) && (cell3 === playerNumber)) {
                    winner(socket);
                    return;
                }
            }
            for(let coll = 0;coll <= 3;coll++)
            {
                const cell1 = socket.playingFieldLinearRepresentation[coll];
                const cell2 = socket.playingFieldLinearRepresentation[coll + 3];
                const cell3 = socket.playingFieldLinearRepresentation[coll + 6];
                if((cell1 === cell2) && (cell2 === cell3) && (cell3 === playerNumber)) {
                    winner(socket);
                    return;
                }
            }
            //diagonal
            let cell1 = socket.playingFieldLinearRepresentation[0];
            let cell2 = socket.playingFieldLinearRepresentation[4];
            let cell3 = socket.playingFieldLinearRepresentation[8];
            if((cell1 === cell2) && (cell2 === cell3) && (cell3 === playerNumber)) {
                winner(socket);
                return;
            }
            cell1 = socket.playingFieldLinearRepresentation[2];
            cell2 = socket.playingFieldLinearRepresentation[4];
            cell3 = socket.playingFieldLinearRepresentation[6];
            if((cell1 === cell2) && (cell2 === cell3) && (cell3 === playerNumber)) {
                winner(socket);
                return;
            }

            //draw logic
            const newAmountOfTurns = Math.min(socket.amountOfTurns + 1, 9);
            socket.amountOfTurns = newAmountOfTurns;
            socket.otherPlayer.amountOfTurns = newAmountOfTurns;
            if(socket.mode === modes.NORMAL && socket.amountOfTurns === 9) {
                resetPlayers(socket);
            }
        });

        socket.on('resee', function(){
            socket.playingFieldLinearRepresentation = [false, false, false, false, false, false, false, false, false];
            socket.otherPlayer.playingFieldLinearRepresentation = [false, false, false, false, false, false, false, false, false];
        });

        socket.on('rematch', function(){
            socket.otherPlayer.emit('rematchask');
        });

        socket.on('rematchakkept', function(){
            socket.emit('resett');
            socket.otherPlayer.emit('resett');
        });

        socket.on('ping1', function(){
            socket.emit('ping2');
        });

        socket.on('sendMessage', function(ff){
            socket.otherPlayer.emit('receiveMessage', ff);
        });

        socket.on('publicKey', function(key){
            socket.otherPlayer.emit('getKey', key);
        });

        socket.on('foc1', function(){
            socket.otherPlayer.emit('foc2');
        });

        socket.on('blu1', function(){
            socket.otherPlayer.emit('blu2');
        });

        socket.emit('serverRestart', serverId);
    });
}

function consolelog(data){
    const date = new Date;
    console.log('[' + date.getDate() + '.' + (date.getMonth() + 1) + '-' + date.getHours() + ':' + date.getMinutes() + '] ' + data);
}

module.exports = socket_player_logic;