var socket = io();
var youAreP,enemyAre;
var remake = false;
var onlinem = false;
var n,o=0;
var aa=[false,false,false,false,false,false,false,false,false];
var opponent;
var publicKey;
var privateKey;

function los(hh){
    socket.emit("turn",hh);
}

function rematch(){
    if(remake===false) {
        socket.emit("rematch");
        document.getElementById("reset").disabled = true;
    }

    else if(remake===true) socket.emit("rematchakkept");
}

function reset(){
    socket.emit("resee");
    for(var www = 0;www<9;www++){
        document.getElementById("a"+www).innerHTML="";
    }
    document.getElementById("reset").style="visibility:hidden";
    aa=[false,false,false,false,false,false,false,false,false];
};


async function neu(){
    fadebutton(true);
    await sleep(animationspeed);
    onlinem=true;
    b = document.getElementById("inpu").value;
    socket.emit("conn",b,2);
    localStorage.setItem("nameonline", b);
};

socket.on("que",async function(data,player,enem,name){
    if(data==1){
        if (!("Notification" in window)){}
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission){});
        }
        document.getElementById("help").style.display="none";
        closechat();
        document.getElementById("chat-content").innerHTML="<center><b>Du solltest noch nicht hier sein!</b></center>";
        typing(false);
        fadebutton(true);
        await sleep(animationspeed);
        document.getElementById("div0").style="display:none";
        document.getElementById("div1").style="display:none";
        document.getElementById("div2").style="display:block";
        document.getElementById("multiplayer").style="display:none";
        await sleep(100);
        fadebutton(false);
    }
    else if(data==2){
        youAreP = player
        opponent = name;
        enemyAre = enem;
        fadebutton(true);
        document.getElementById("youAre").innerHTML = "You are "+player;
        await sleep(animationspeed);
        document.getElementById("div0").style="display:none";
        document.getElementById("div1").style="display:block";
        document.getElementById("div2").style="display:none";
        document.getElementById("multiplayer").style="display:none";
        try{
            if (!("Notification" in window)){}
            else if(Notification.permission === "granted") {
                var notification = new Notification("Gegner "+name+" will gegen dich spielen");
            }
        }
        catch(err){}
        document.getElementById("score").innerHTML = youAreP+": 0 vs. "+enemyAre+": 0";
        aler("Gegner: "+name);
        document.getElementById("help").style.display="block";
        document.getElementById("chat").style.display="block";
        //encryption setup
        const keyPair = await generateKeyPair();
        try {
            privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
            var pk = await crypto.subtle.exportKey("spki", keyPair.publicKey);
            socket.emit("publicKey", pk);
        }
        catch (e){}
        await sleep(100);
        fadebutton(false);
    }
});

socket.on("turned",function(player,enemy,pos,tem,fin){
    if(fin == "move"){
        document.getElementById("a"+pos).innerHTML=player;
        document.getElementById("turn").innerHTML="Turn: "+enemy;
        if(player=="X") aa[pos]="1";
        else if(player=="O") aa[pos]="2";
    }
    else if(fin == "red"){
        document.getElementById("a"+pos).style.color="red";
    }
    else if(fin == "rem"){
        document.getElementById("a"+tem).removeAttribute("style");
    }
    else if(fin == "chan"){
        document.getElementById("a"+pos).style.color="red";
        document.getElementById("a"+tem).removeAttribute("style");
    }
    else if(fin == "fin"){
        document.getElementById("a"+pos).innerHTML=player;
        document.getElementById("a"+tem).innerHTML=" ";
        document.getElementById("a"+tem).removeAttribute("style");
        document.getElementById("turn").innerHTML="Turn: "+enemy;
        if(player=="X") aa[pos]="1";
        else if(player=="O") aa[pos]="2";
        aa[tem]=false;
    }
});

socket.on("win",function(winer,punkteSelf,punkteEnemy,winner){
    if(winer==youAreP){
        document.getElementById("score").innerHTML = youAreP+": "+punkteSelf+" vs. "+enemyAre+": "+punkteEnemy;
        aler("Du hast gewonnen");
        chatwrite("system","Du hast gewonnen");
    }
    else{
        document.getElementById("score").innerHTML = youAreP+": "+punkteEnemy+" vs. "+enemyAre+": "+punkteSelf;
        aler("Du hast verloren");
        chatwrite("system","Du hast verloren");
    }
});

socket.on("rese",function(){
    document.getElementById("reset").style="visibility:visible";
});

socket.on("rematchask",function(){
    document.getElementById("reset").innerHTML="Accept Rematch";
    remake=true;
});

socket.on("resett",function(){
    document.getElementById("reset").innerHTML="Rematch";
    remake=false;
    document.getElementById("reset").disabled = false;
    reset();
});

socket.on("turnreset",function(){
    document.getElementById("turn").innerHTML="Turn: O";
});


document.onkeydown = function(event){
    if(event.keyCode===13){
        if(onlinem==false){
            neu();
        }
        else if(inchat){
            sen();
        }
    }
};

function dis(){
    socket.emit("dis");
    document.getElementById("pin").style.display="none";
    document.getElementById("help").style.display="none";
    document.getElementById("chat").style.display="none";
    clearInterval(intervall);
}

socket.on("erro",function(){aler("Error:<br>Bitte starte dein Spiel neu","hid");err()});

function ping1(){
    var d = new Date();
    n = d.getTime();
    socket.emit("ping1");
}

socket.on("ping2",function(){
    var d = new Date();
    m = d.getTime();

    var p=((m-n)-o)/10;
    for(var i=0;i<10;i++){
        setTimeout(function(){lo(p)},i*99);
    }

});

intervall = setInterval(ping1,1000);

function lo(a){
    document.getElementById("ping").innerHTML = Math.round(o+a);
    o += a;
}

document.getElementById("pin").style.display="block";

var serverId;

socket.on("serverRestart",async function(server){
    if((serverId!=server)&&(serverId!=undefined)){
        aler("Bitte starte dein Spiel neu.<br>Es gab einen Server Neustart","hid");err();

    }
else{serverId=server}
});



function typing(ff){
    if(ff){
        document.getElementById("cha").classList.remove("fa-comment");
        document.getElementById("cha").classList.add("fa-comment-dots");
    }
    else{
        document.getElementById("cha").classList.remove("fa-comment-dots");
        document.getElementById("cha").classList.add("fa-comment");
    }
    typingin(ff);
}

var inchat = false, inopenchat = false,unrea = 0;

async function chating(){
    if(nofillter){
        chat.style.display = "block";
        await sleep(100);
        document.getElementsByClassName("chat-window")[0].classList.add("movechat");
        document.getElementById("chatmodal").classList.add("chatopa");
        unread(0);
        unrea = 0;
        inopenchat = true;
    }
    else{
        chatwarning();
    }
}

async function closechat(){
    document.getElementsByClassName("chat-window")[0].classList.remove("movechat");
    document.getElementById("chatmodal").classList.remove("chatopa");
    inchat = false;
    inopenchat = false;
    await sleep(animationspeed);
    chat.style.display = "none";
}

async function sen() {
    let message = document.getElementById("chatinputbox").value;
    message = message.trim();
    if (message !== "") {
        message = htmlSpecialChars(message);
        if (publicKey == null || publicKey === "")
            aler("Encryption not set up properly. Chat disabled.");
        else
            try {
                let msg = await encrypt(message, publicKey);
                socket.emit("sendMessage", msg);
                chatwrite("me", message);
            } catch (err) {
                aler("Encryption failed. Disabling Chat.");
            }
    }
    document.getElementById("chatinputbox").value = "";
}

function nachrichtplus(ff){
    if(!inopenchat){
        unrea += ff;
        unread(unrea);
    }
}

function foc(){
    socket.emit("foc1");
    inchat = true;
}
socket.on("foc2",function(){
    typing(true);
});

function blu(){
    socket.emit("blu1");
    inchat = false;
}
socket.on("blu2",function(){
    typing(false);
});

socket.on("startChat",function(){
    document.getElementById("chat-content").innerHTML = "";
    chatwrite("system","Dies ist der Anfang deines Chats mit " + opponent);
});

socket.on("receiveMessage",async function (gg) {
    let msg
    try {
        msg = await decrypt(gg, privateKey);
        chatwrite("other", msg);
    } catch (e) {
    }
});

//RSA stuff

// Generate an RSA key pair
async function generateKeyPair() {
    return await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 1024, // can be 1024, 2048, or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt the message using the public key
async function encrypt(message, publicKey) {
    const array = new TextEncoder().encode(message);
    const cryptoKey = await crypto.subtle.importKey(
        "spki",
        publicKey,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        ["encrypt"]
    );
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        cryptoKey,
        array
    );
    return new Uint8Array(ciphertext);
}

// Decrypt the ciphertext using the private key
async function decrypt(ciphertext, privateKey) {
    const array = new Uint8Array(ciphertext);
    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        privateKey,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        cryptoKey,
        array
    );
    return new TextDecoder().decode(decrypted);
}

socket.on("getKey", function(key){
    publicKey = key;
});
