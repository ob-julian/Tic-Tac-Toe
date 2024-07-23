const io = require('socket.io');
const https = require('https');
const http = require('http');
const fs = require('fs');
const Crypto = require('crypto');
const socket_player_logic = require('./socket_player_logic');
const process = require('process');

const isProduction = process.env.NODE_ENV === 'production';

// Local hosting for testing
let allowNoHttps = true;

try {
    const httpsConfig = require('../config/https.json');
} catch {
    console.error('Could not find HTTPS configuration, trying to use environment variables');
}
const keyLocation = process.env.SSL_KEY_PATH || httpsConfig.key;
const certLocation = process.env.SSL_CERT_PATH || httpsConfig.cert;
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
    try { 
        const corsConfig = require('../config/cors.json');
    } catch {
        console.error('Could not find CORS configuration, trying to use environment variables');
    }
    // Don't allow empty CORS origin in production
    if (isProduction && (!process.env.CORS_ORIGIN && !corsConfig.origin)) {
        console.error('No CORS origin specified in production, exiting');
        process.exit(1);
    }
    ioServer = io(server, {
        cors: {
            // Allow all origins in development
            // Else us config or Docker environment variable
            origin: isProduction ? process.env.CORS_ORIGIN || corsConfig.origin : '*',
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
        const options = {
            key: fs.readFileSync(keyLocation),
            cert: fs.readFileSync(certLocation)
        };
        tmpServer = https.createServer(options);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(err);
        }
        if (allowNoHttps && !isProduction) {
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

// Refresh certificates for HTTPS
function refreshCertificates() {
    try {
        const options = {
            key: fs.readFileSync(keyLocation),
            cert: fs.readFileSync(certLocation)
        };
        server.setSecureContext(options);
        console.log('Certificates refreshed');
    } catch {
        console.error('Could not refresh certificates');
    }
}

fs.watchFile(keyLocation, () => {
    console.log('SSL key changed, trying to refresh');
    refreshCertificates();
});

fs.watchFile(certLocation, () => {
    console.log('SSL cert changed, trying to refresh');
    refreshCertificates();
});


// Proper shutdown for Docker container and testing
function exitServer() {
    return new Promise((resolve) => {
        fs.unwatchFile(keyLocation);
        fs.unwatchFile(certLocation);
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

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down');
    exitServer().then(() => {
        console.log('Server shut down');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down');
    exitServer().then(() => {
        console.log('Server shut down');
        process.exit(0);
    });
});


// Testing functions

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