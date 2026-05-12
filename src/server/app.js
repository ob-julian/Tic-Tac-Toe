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
const httpsConfig = getHttpsConfig();

function getHttpsConfig() {
    try {
        return require('../config/https.json');
    } catch {
        console.error('Could not find HTTPS configuration, trying to use environment variables');
        return {}; // To prevent errors if both are missing
    }
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
    const processedOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : null;
    console.log(`CORS_ORIGIN is set to: ${processedOrigin}`);
    ioServer = io(server, {
        cors: {
            // Allow all origins in development
            // Else use config or Docker environment variable
            origin: isProduction ? processedOrigin || corsConfig.origin : '*',
        }
    });

    const serverId = Crypto.randomBytes(20).toString('hex');
    console.log('Server id: ' + serverId);

    socket_player_logic(ioServer, serverId);

    let port = process.env.PORT || 3000;

    return new Promise((resolve, reject) => {
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use`);
                reject(new Error(`Port ${port} is already in use`));
            } else {
                reject(err);
            }
        });

        server.listen(port, () => {
            console.log('Server listening on port ' + port);
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

        // Without this, the server would be unable to respond after 3 Months, because of outdated certs, ask me how I know :D
        fs.watchFile(keyLocation, () => {
            console.log('SSL key changed, trying to refresh');
            refreshCertificates();
        });

        fs.watchFile(certLocation, () => {
            console.log('SSL cert changed, trying to refresh');
            refreshCertificates();
        });
    } catch (err) {
        // ENOENT: No such file or directory
        if (err.code === 'ENOENT') {
            console.warn('Could not find HTTPS certificates, ENONENT error');
            console.error(err);
        }
        if (allowNoHttps && !isProduction) {
            console.warn('As this is not production, allowing to start without HTTPS');
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