consolelog("starting up","green");
"use strict";
const express = require("express");
const app = express();
const serv = require("https");
const fs = require("fs");
const path = require('path');
const RewriteMiddleware = require('express-htaccess-middleware');
const secure = require('express-force-https');

const RewriteOptions = {
    file: path.resolve(__dirname, '.htaccess'),
    verbose: (process.env.ENV_NODE == 'development'),
    watch: (process.env.ENV_NODE == 'development')
};

const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/karlsgymnasium.ddns.net/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/karlsgymnasium.ddns.net/fullchain.pem")
};
consolelog("Keys Initialised", "green");

app.get("/",function(req, res) {
    res.sendFile(__dirname+"/client/index.html");
})
app.use("/client",express.static(__dirname + "/client"));

app.use(RewriteMiddleware(RewriteOptions));

app.use(secure);

const server = serv.createServer(options, app)
server.listen(2001);
consolelog("start from TTT succsesful","green");



const app1 = express();
const serv1 = require("http").Server(app1);
app1.get("/",function(req, res) {
    res.sendFile(__dirname+"/client1/index.html");
})
app1.use("/client1",express.static(__dirname + "/client1"));

serv1.listen(2000);
consolelog("start from subserver succsesful","green");


const app2 = express();
const serv2 = require("http").Server(app2);
const auth = require('./auth');

app2.use(auth);

app2.get("/",function(req, res) {
    res.sendFile(__dirname+"/log/log.log");
})
app2.use("/log",express.static(__dirname + "/log"));

//serv2.listen(2002);
//consolelog("Start from log Servre succsesful");


var socket_list={};
var playerInQ = {};
var playerIn = 0
var playerInQ2 = {};
var playerIn2 = 0

var serverId=Math.random();

consolelog("variablen inizialisiert","green");

var io = require("socket.io")(server,{});
io.sockets.on("connection",function(socket){
    socket.id = Math.random();
    consolelog("socket connection from id:" + socket.id);
    socket_list[socket.id] = socket;
    socket.otherPlayer;
    socket.online = false;
    socket.queu = false;
    socket.turn="O";
    socket.point="0";
    socket.playss=0;
    socket.jkl=0;
    socket.durch=1;
    socket.type;
    socket.tem;
    socket.aa=[false,false,false,false,false,false,false,false,false];
    socket.mode;
    var fuck=false;

    socket.on("disconnect",function(){disc();delete socket_list[socket.id];});

    socket.on("dis",function(){disc();});

    function disc() {
        if(fuck==false){
            consolelog("socket disconnection from id:" + socket.id);
            if(socket.online===true){
                socket.otherPlayer.online=false;
                socket.otherPlayer.queu=false;
                socket.online=false;
                socket.queu=false;
                socket.otherPlayer.emit("resett");
                socket.otherPlayer.emit("turnreset")
                socket.emit("resett");
                socket.emit("turnreset");
                socket.otherPlayer.queueM();
                consolelog("online");
            }
            else if(socket.queu===true){
                socket.online=false;
                socket.queu=false;
                playerInQ = {};
                playerIn = 0;
                consolelog("queue");
            }
            else consolelog("Login");
        }
    }

    socket.on("conn",function(valu,mode){
        socket.name = valu;
        socket.mode = mode;
        consolelog(socket.id+" has canged the name to "+socket.name+" (Mode: "+mode+")");
        socket.queueM();
    });

    socket.on("turn",function(hh){
        if(socket.turn==socket.type){
            if(socket.mode == 1){
                if(socket.aa[hh]===false)
                {
                    socket.emit("turned",socket.type,socket.otherPlayer.type,hh);
                    socket.otherPlayer.emit("turned",socket.type,socket.otherPlayer.type,hh);
                    socket.aa[hh]="1";
                    socket.otherPlayer.aa[hh]="2";
                    socket.turn=socket.otherPlayer.type;
                    socket.otherPlayer.turn=socket.otherPlayer.type;
                }
            }
            else if(socket.mode == 2){
                if((socket.aa[hh]===false)&&(socket.jkl<6)){
                    socket.emit("turned",socket.type,socket.otherPlayer.type,hh,"","move");
                    socket.otherPlayer.emit("turned",socket.type,socket.otherPlayer.type,hh,"","move");
                    socket.aa[hh]="1";
                    socket.otherPlayer.aa[hh]="2";
                    socket.jkl++;
                    socket.otherPlayer.jkl++;
                    socket.turn=socket.otherPlayer.type;
                    socket.otherPlayer.turn=socket.otherPlayer.type;
                }
                else if(socket.jkl>=6){
                    if((socket.durch=="1")&&(socket.aa[hh]=="1")){
                        socket.emit("turned","","",hh,"","red");
                        socket.otherPlayer.emit("turned","","",hh,"","red");
                        socket.tem=hh;
                        socket.durch="2";
                    }
                    else if((socket.durch=="2")&&(hh==socket.tem)){
                        socket.emit("turned","","","",socket.tem,"rem");
                        socket.otherPlayer.emit("turned","","","",socket.tem,"rem");
                        socket.durch="1";
                    }
                    else if((socket.durch=="2")&&((socket.aa[hh]=="1"))){
                        socket.emit("turned","","",hh,socket.tem,"chan");
                        socket.otherPlayer.emit("turned","","",hh,socket.tem,"chan");
                        socket.tem=hh;
                    }
                    else if((socket.durch=="2")&&(socket.aa[hh]===false)){
                        socket.emit("turned",socket.type,socket.otherPlayer.type,hh,socket.tem,"fin");
                        socket.otherPlayer.emit("turned",socket.type,socket.otherPlayer.type,hh,socket.tem,"fin");
                        socket.aa[hh]="1";
                        socket.otherPlayer.aa[hh]="2";
                        socket.aa[socket.tem]=false;
                        socket.otherPlayer.aa[socket.tem]=false;
                        socket.turn=socket.otherPlayer.type;
                        socket.otherPlayer.turn=socket.otherPlayer.type;
                        socket.durch="1";
                        socket.tem = undefined;
                    }
                }
            }

            //Gewinn prüfung
            var awe="1";
            for(var fo=0;fo<9;fo=fo+3)
            {
                if((socket.aa[fo]==socket.aa[fo+1])&&(socket.aa[fo+1]==socket.aa[fo+2])&&(socket.aa[fo+2]==awe))
                {
                    winner();
                    return;
                }
            }
            for(var fa=0;fa<=3;fa++)
            {
                if((socket.aa[fa]==socket.aa[fa+3])&&(socket.aa[fa+3]==socket.aa[fa+6])&&(socket.aa[fa+6]==awe))
                {
                    winner();
                    return;
                }
            }

            if((socket.aa[0]==socket.aa[4])&&(socket.aa[4]==socket.aa[8])&&(socket.aa[8]==awe))
            {
                winner();
                return;
            }
            if((socket.aa[2]==socket.aa[4])&&(socket.aa[4]==socket.aa[6])&&(socket.aa[6]==awe))
            {
                winner();
                return;
            }

            if(socket.mode==1){
                socket.playss++;
                socket.otherPlayer.playss++;
                if(socket.playss==9)
                {
                    rese();
                }
            }
        }
    });

    socket.on("resee",function(){
        socket.aa=[false,false,false,false,false,false,false,false,false];
        socket.otherPlayer.aa=[false,false,false,false,false,false,false,false,false];
    });

    socket.on("rematch",function(){
        socket.otherPlayer.emit("rematchask");
    })

    socket.on("rematchakkept",function(){
        socket.emit("resett");
        socket.otherPlayer.emit("resett");
    })

    socket.on("ping1",function(){
        socket.emit("ping2");
    })

    function winner(){
        socket.point++;
        socket.emit("win",socket.type,socket.point,socket.otherPlayer.point);
        socket.otherPlayer.emit("win",socket.type,socket.point,socket.otherPlayer.point);

        rese();
    }
    function rese(){
        socket.emit("rese");
        socket.otherPlayer.emit("rese");
        socket.aa=[3,3,3,3,3,3,3,3,3];
        socket.otherPlayer.aa=[3,3,3,3,3,3,3,3,3];
        socket.playss=0;
        socket.otherPlayer.playss=0;
        socket.jkl=0;
        socket.otherPlayer.jkl=0;
        socket.durch=1;
        socket.otherPlayer.durch=1;
    }
    socket.queueM = function(){
        if(socket.mode == 1){
            playerInQ[playerIn]=socket.id;
            playerIn++;
            //queue manager
            if((playerIn<2)&&(socket.online==false)&&(socket.queu==false)) {
                socket.emit("que",1);
                socket.online=false;
                socket.queu=true;
            }
            else if((playerIn==2)&&(socket.online==false)&&(socket.queu==false)) {
                socket.otherPlayer=socket_list[playerInQ[0]];
                socket.type="X";
                socket.otherPlayer.type="O";
                socket.otherPlayer.otherPlayer=socket_list[playerInQ[1]];//or = socket but im fancy =)
                socket.emit("que",2,socket.type,socket.otherPlayer.type,socket.otherPlayer.name);
                socket.otherPlayer.emit("que",2,socket.otherPlayer.type,socket.type,socket.name);
                socket.online=true;
                socket.otherPlayer.online=true;
                socket.queu=false;
                socket.otherPlayer.queu=false;
                socket.playss=0;
                socket.otherPlayer.playss=0;
                socket.jkl=0;
                socket.otherPlayer.jkl=0;
                socket.durch=1;
                socket.otherPlayer.durch=1;
                socket.turn="O";
                socket.otherPlayer.turn="O";
                socket.otherPlayer.point="0";
                socket.aa=[false,false,false,false,false,false,false,false,false];
                socket.otherPlayer.aa=[false,false,false,false,false,false,false,false,false];
                socket.point="0";
                consolelog("Match betwen:"+socket_list[playerInQ[0]].name+" and "+socket_list[playerInQ[1]].name);
                playerInQ = {};
                playerIn = 0;
                socket.emit("startChat");
                socket.otherPlayer.emit("startChat");
            }
            else socket.emit("erro");
        }
        else if(socket.mode == 2){
            playerInQ2[playerIn2]=socket.id;
            playerIn2++;
            //queue manager
            if((playerIn2<2)&&(socket.online==false)&&(socket.queu==false)) {
                socket.emit("que",1);
                socket.online=false;
                socket.queu=true;
            }
            else if((playerIn2==2)&&(socket.online==false)&&(socket.queu==false)) {
                socket.otherPlayer=socket_list[playerInQ2[0]];
                socket.otherPlayer.otherPlayer=socket_list[playerInQ2[1]];//or = socket but im fancy =)
                socket.type="X";
                socket.otherPlayer.type="O";
                socket.emit("que",2,socket.type,socket.otherPlayer.type,socket.otherPlayer.name);
                socket.otherPlayer.emit("que",2,socket.otherPlayer.type,socket.type,socket.name);
                socket.online=true;
                socket.otherPlayer.online=true;
                socket.queu=false;
                socket.otherPlayer.queu=false;
                socket.playss=0;
                socket.otherPlayer.playss=0;
                socket.jkl=0;
                socket.otherPlayer.jkl=0;
                socket.durch=1;
                socket.otherPlayer.durch=1;
                socket.turn="O";
                socket.otherPlayer.turn="O";
                socket.otherPlayer.point="0";
                socket.aa=[false,false,false,false,false,false,false,false,false];
                socket.otherPlayer.aa=[false,false,false,false,false,false,false,false,false];
                socket.point="0";
                consolelog("Match betwen:"+socket_list[playerInQ2[0]].name+" and "+socket_list[playerInQ2[1]].name);
                playerInQ2 = {};
                playerIn2 = 0;
                socket.emit("startChat");
                socket.otherPlayer.emit("startChat");
            }
            else socket.emit("erro");
        }
    }

    socket.on("sendMessage",function(ff){
        socket.emit("receiveMessage","me",ff);
        socket.otherPlayer.emit("receiveMessage","other",ff);
        console.log(socket.name + " schreibt an " + socket.otherPlayer.name + ": " + ff);
    });

    socket.on("foc1",function(){
        socket.otherPlayer.emit("foc2");
    });

    socket.on("blu1",function(){
        socket.otherPlayer.emit("blu2");
    });




    socket.on("man",function(){for(var i in socket_list)consolelog("llll");});

    socket.emit("serverRestart",serverId);
});

consolelog("sockel initialiesiert");

function consolelog(gg){
    let aa=new Date;
    console.log("["+aa.getDate()+"."+(aa.getMonth()+1)+"-"+aa.getHours()+":"+aa.getMinutes()+"] "+gg);
}

consolelog("Start finished");
