const io = require('socket.io');
const https = require('https');
const http = require('http');
const fs = require('fs');
const Crypto = require('crypto');
const socket_player_logic = require('./socket_player_logic');
const process = require('process');

// Local hosting for testing
let allowNoHttps = true;
let server, ioServer;

let serverAlreadyRunning = false;

function start() {
    if (serverAlreadyRunning) {
        console.error('Server already running');
        return;
    } else {
        serverAlreadyRunning = true;
        return startServer();
    }
}

function startServer() {
    // Server setup
    server = serverSetup();

    ioServer = io(server, {
        cors: {
            origin: '*',
        }
    });

    const serverId = Crypto.randomBytes(20).toString('hex');
    console.log('Server id: ' + serverId);

    socket_player_logic(ioServer, serverId);

    return new Promise((resolve) => {
        server.listen(3000, () => {
            console.log('Server listening on port 3000');
            resolve();
        });
    });
}

function serverSetup() {
    // Server setup
    let tmpServer;
    try{
        const httpsConfig = require('../config/https.json');
        const options = {
            key: fs.readFileSync(httpsConfig.key),
            cert: fs.readFileSync(httpsConfig.cert)
        };
        tmpServer = https.createServer(options);
    } catch {
        if (allowNoHttps) {
            console.warn('Could not find HTTPS certificates, using HTTP');
            console.warn('Careful: This is not secure!'),
            tmpServer = http.createServer();
        } else {
            console.error('No HTTPS certificates found, exiting');
            process.exit(1);
        }
    }
    return tmpServer;
}


// Testing stuff

function exitServer() {
    return new Promise((resolve) => {
        const promise = [];
        promise.push(ioServer.close());
        promise.push(server.close());
        Promise.all(promise).catch((err) => {
            console.error('Error while closing server: ' + err);
        }).finally(() => {
            resolve();
        });
    });
}

function beQuiet() {
    console.log = function() {};
}

function setToTesting() {
    allowNoHttps = true;
}

if (require.main === module) {
    start().then(() => {
        console.log('All systems up and running');
    });
}

module.exports = {
    exitServer: exitServer,
    beQuiet: beQuiet,
    setToTesting: setToTesting,
    start: start
};