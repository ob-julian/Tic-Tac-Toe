```
 _____ _        _____            _____            
|_   _(_)      |_   _|          |_   _|           
  | |  _  ___    | | __ _  ___    | | ___   ___   
  | | | |/ __|   | |/ _` |/ __|   | |/ _ \ / _ \  
  | | | | (__    | | (_| | (__    | | (_) |  __/  
  |_| |_|\___|   |_|\__,_|\___|   |_|\___/ \___|  
                                             
```
#
All resources for my Multiplayer and Singleplayer website based around the game Tic Tac Toe.


## Install Server

### On Machine
1. Clone the repository.
2. Install [Node.js](https://nodejs.org/en/).
3. Install [npm](https://www.npmjs.com/).
4. Navigate to the [src](src) directory.
5. Run `npm install` to install the dependencies.
6. Run `node .` to start the server.

#### Beginner Tips:
* To stop the server, press `Ctrl + C`.
* To start the server in the background, use `node . &`.
* To check if the server is running, use `ps aux | grep node`.
* To view the server logs, use `tail -f logs/server.log`.
* Another option is to use `screen` or `tmux` to run the server in the background.
* For `tmux`:
    * Start a new session with `tmux new -s tic-tac-toe`.
    * Run the server with `node .`.
    * Detach from the session with `Ctrl + B` and then `D`.
    * To reattach to the session, use `tmux attach -t tic-tac-toe`.

### With Docker
1. Clone the repository
2. Install [Docker](https://www.docker.com/)
3. Navigate to the [src](src) directory
4. Run `docker build -f server/Dockerfile -t tic-tac-toe_server .` to build the Docker image
5. To run the Docker container, run `docker run` with the appropriate flags:
    * There are a few required flags you can add to the `docker run` command:
        * `-e CORS_ORIGIN=<https://yourdomain.com>` to allow requests only from your domain
        * `-e SSL_KEY_PATH=</path/to/ssl/key.pem>` to specify the path to the SSL key
        * `-e SSL_CERT_PATH=</path/to/ssl/cert.pem>` to specify the path to the SSL certificate

        Most commonly, the SSL key and certificate are stored outside of the Docker container, so you would mount them as volumes. To do this:
        * Add the `-v </path/to/cert/folder>:/usr/src/ssl` flag
        * Change the `-e SSL_KEY_PATH` to `-e SSL_KEY_PATH=/usr/src/ssl/key.pem`
        * Change the `-e SSL_CERT_PATH` to `-e SSL_CERT_PATH=/usr/src/ssl/cert.pem`

        > Please note that Let's Encrypt uses symlinks for the actual certificate and key files. In this case, you would have to mount the folder containing the symlinks and the actual files.

    Optional flags:
    * To set the exposed port, add the `-p 3000:<port>` flag
    * If you want to name the Docker container, add the `--name <name>` flag
    * If you want the Docker container to run in the background, add the `-d` flag
    * If you want the Docker container to restart on failure and on boot, add the `--restart always` flag

> Only change the `<...>` parts of the command, unless you know what you are doing

In total, the command would look like this:
```bash
docker run -d \
-p 3000:<port> \
--restart always \
--name <name> \
-e CORS_ORIGIN=<https://yourdomain.com> \
-e SSL_KEY_PATH=/usr/src/ssl/key.pem \
-e SSL_CERT_PATH=/usr/src/ssl/cert.pem \
-v </path/to/cert/folder>:/usr/src/ssl \
tic-tac-toe_server
```
> Beginners Hint: The `\` at the end of the line is used to continue the command on the next line in the terminal.
> Furthermore, if you want to allow requests from multiple domains, you can set the `CORS_ORIGIN` environment variable to a comma-separated list of domains, e.g. `-e CORS_ORIGIN=<https://domain1.com>,<https://domain2.com>`.


A concrete example for my setup, a standard Ubuntu server with Apache2 and Let's Encrypt certificates, would look like this:

```bash
docker run -d \
-p 3000:3000 \
--restart always \
--name tic-tac-toe_server \
-e CORS_ORIGIN=https://oberflow.dev,https://oberhofer.ddns.net  \
-e SSL_KEY_PATH=/usr/src/ssl/live/oberhofer.ddns.net /privkey.pem \
-e SSL_CERT_PATH=/usr/src/ssl/live/oberhofer.ddns.net/fullchain.pem \
-v /etc/letsencrypt/:/usr/src/ssl/ \
tic-tac-toe_server
```

Or as a one-liner:
```bash
docker run -d -p 3000:3000 --restart always --name tic-tac-toe_server -e CORS_ORIGIN=https://oberflow.dev,https://oberhofer.ddns.net -e SSL_KEY_PATH=/usr/src/ssl/live/oberhofer.ddns.net/privkey.pem -e SSL_CERT_PATH=/usr/src/ssl/live/oberhofer.ddns.net/fullchain.pem -v /etc/letsencrypt/:/usr/src/ssl/ tic-tac-toe_server
```

#### Further beginner tips:
* To see if the Docker container is running, you can use `docker ps`
* To see the logs of the Docker container, you can use `docker logs tic-tac-toe_server`
* For follow-up Docker starts, you can use `docker start tic-tac-toe_server`
* To stop the Docker container, run `docker stop tic-tac-toe_server`