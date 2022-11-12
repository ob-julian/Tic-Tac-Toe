var animationspeed,intervall;
document.cookie="SameSite=Strict";
var online = 'var youAreP,enemyAre,n,opponent,serverId,socket=io(),remake=!1,onlinem=!1,o=0,aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];function los(e){socket.emit("turn",e)}function rematch(){0==remake?(socket.emit("rematch"),document.getElementById("reset").disabled=!0):1==remake&&socket.emit("rematchakkept")}function reset(){socket.emit("resee");for(var e=0;e<9;e++)document.getElementById("a"+e).innerHTML="";document.getElementById("reset").style="visibility:hidden",aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1]}async function neu(){fadebutton(!0),await sleep(animationspeed),onlinem=!0,b=document.getElementById("inpu").value,socket.emit("conn",b,1),localStorage.setItem("nameonline",b)}function dis(){socket.emit("dis"),document.getElementById("pin").style.display="none",document.getElementById("help").style.display="none",document.getElementById("chat").style.display="none",clearInterval(intervall)}function ping1(){var e=new Date;n=e.getTime(),socket.emit("ping1")}function lo(e){document.getElementById("ping").innerHTML=Math.round(o+e),o+=e}function typing(e){e?(document.getElementById("cha").classList.remove("fa-comment"),document.getElementById("cha").classList.add("fa-comment-dots")):(document.getElementById("cha").classList.remove("fa-comment-dots"),document.getElementById("cha").classList.add("fa-comment")),typingin(e)}socket.on("que",async function(e,t,n,o){if(1==e)fadebutton(!0),await sleep(animationspeed),document.getElementById("div0").style="display:none",document.getElementById("div1").style="display:none",document.getElementById("div2").style="display:block",document.getElementById("multiplayer").style="display:none","Notification"in window&&"denied"!==Notification.permission&&Notification.requestPermission(function(e){}),document.getElementById("help").style.display="none",closechat(),document.getElementById("chat-content").innerHTML="<center><b>Du solltest noch nicht hier sein!</b></center>",typing(!1),await sleep(100),fadebutton(!1);else if(2==e){fadebutton(!0),await sleep(animationspeed),document.getElementById("div0").style="display:none",document.getElementById("div1").style="display:block",document.getElementById("div2").style="display:none",document.getElementById("multiplayer").style="display:none",document.getElementById("youAre").innerHTML="You are "+t,youAreP=t,opponent=o,enemyAre=n;try{if("Notification"in window){if("granted"===Notification.permission)new Notification("Gegner "+o+" will gegen dich spielen")}else;}catch(e){}document.getElementById("score").innerHTML=youAreP+": 0 vs. "+enemyAre+": 0",aler("Gegner: "+o),document.getElementById("help").style.display="block",document.getElementById("chat").style.display="block",await sleep(100),fadebutton(!1)}}),socket.on("turned",function(e,t,n){document.getElementById("a"+n).innerHTML=e,document.getElementById("turn").innerHTML="Turn: "+t,"X"==e&&(aa[n]="1"),"O"==e&&(aa[n]="2")}),socket.on("win",function(e,t,n,o){e==youAreP?(document.getElementById("score").innerHTML=youAreP+": "+t+" vs. "+enemyAre+": "+n,aler("Du hast gewonnen"),chatwrite("system","Du hast gewonnen")):(document.getElementById("score").innerHTML=youAreP+": "+n+" vs. "+enemyAre+": "+t,aler("Du hast verloren"),chatwrite("system","Du hast verloren"))}),socket.on("rese",function(){document.getElementById("reset").style="visibility:visible"}),socket.on("rematchask",function(){document.getElementById("reset").innerHTML="Accept Rematch",remake=!0}),socket.on("resett",function(){document.getElementById("reset").innerHTML="Rematch",remake=!1,document.getElementById("reset").disabled=!1,reset()}),socket.on("turnreset",function(){document.getElementById("turn").innerHTML="Turn: O"}),document.onkeydown=function(e){13===e.keyCode&&(0==onlinem?neu():inchat&&sen())},socket.on("erro",function(){aler("Error:<br>Bitte starte dein Spiel neu","hid"),err()}),socket.on("ping2",function(){var e=new Date;m=e.getTime();for(var t=(m-n-o)/10,i=0;i<10;i++)setTimeout(function(){lo(t)},99*i)}),intervall=setInterval(ping1,1e3),document.getElementById("pin").style.display="block",socket.on("serverRestart",async function(e){serverId!=e&&null!=serverId?(aler("Bitte starte dein Spiel neu.<br>Es gab einen Server Neustart","hid"),err()):serverId=e});var inchat=!1,inopenchat=!1,unrea=0;async function chating(){nofillter?(chat.style.display="block",await sleep(100),document.getElementsByClassName("chat-window")[0].classList.add("movechat"),document.getElementById("chatmodal").classList.add("chatopa"),unread(0),unrea=0,inopenchat=!0):chatwarning()}async function closechat(){document.getElementsByClassName("chat-window")[0].classList.remove("movechat"),document.getElementById("chatmodal").classList.remove("chatopa"),inchat=!1,inopenchat=!1,await sleep(animationspeed),chat.style.display="none"}function sen(){let e=document.getElementById("chatinputbox").value;""!=(e=e.trim())&&(e=htmlSpecialChars(e),socket.emit("sendMessage",e)),document.getElementById("chatinputbox").value=""}function nachrichtplus(e){inopenchat||(unrea+=e,unread(unrea))}function foc(){socket.emit("foc1"),inchat=!0}function blu(){socket.emit("blu1"),inchat=!1}socket.on("foc2",function(){typing(!0)}),socket.on("blu2",function(){typing(!1)}),socket.on("startChat",function(){document.getElementById("chat-content").innerHTML="",chatwrite("system","Dies ist der Anfang deines Chats mit "+opponent)}),socket.on("receiveMessage",function(e,t){chatwrite(e,t)});';

/*  var socket = io();
    var youAreP,enemyAre;
    var remake = false;
    var onlinem = false;
    var n,o=0;
    var aa=[false,false,false,false,false,false,false,false,false];
    var opponent;

    function los(hh){
        socket.emit("turn",hh);
    };

    function rematch(){
        if(remake==false) {
            socket.emit("rematch");
            document.getElementById("reset").disabled = true;
        }

        else if(remake==true) socket.emit("rematchakkept");
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
        socket.emit("conn",b,1);
        localStorage.setItem("nameonline", b);
    };

    socket.on("que",async function(data,player,enem,name){
        if(data==1){
            fadebutton(true);
            await sleep(animationspeed);
            document.getElementById("div0").style="display:none";
            document.getElementById("div1").style="display:none";
            document.getElementById("div2").style="display:block";
            document.getElementById("multiplayer").style="display:none";
                 if (!("Notification" in window)){}
                 else if (Notification.permission !== "denied") {
                     Notification.requestPermission(function (permission){});
                 }
            document.getElementById("help").style.display="none";
            closechat();
            document.getElementById("chat-content").innerHTML="<center><b>Du solltest noch nicht hier sein!</b></center>";
            typing(false);
            await sleep(100);
            fadebutton(false);
        }
        else if(data==2){
            fadebutton(true);
            await sleep(animationspeed);
            document.getElementById("div0").style="display:none";
            document.getElementById("div1").style="display:block";
            document.getElementById("div2").style="display:none";
            document.getElementById("multiplayer").style="display:none";
            document.getElementById("youAre").innerHTML = "You are "+player;
            youAreP = player
            opponent = name;
            enemyAre = enem;
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
            await sleep(100);
            fadebutton(false);
        }
    });

    socket.on("turned",function(player,enemy,pos){
        document.getElementById("a"+pos).innerHTML=player;
        document.getElementById("turn").innerHTML="Turn: "+enemy;
        if(player=="X") aa[pos]="1";
        if(player=="O") aa[pos]="2";
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

    function sen(){
        let message = document.getElementById("chatinputbox").value;
        message = message.trim();
        if(message!=""){
            message = htmlSpecialChars(message);
            socket.emit("sendMessage",message);
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

    socket.on("receiveMessage",function(ff,gg){
        chatwrite(ff,gg);
    });*/

var experimentmp = 'var youAreP,enemyAre,n,opponent,serverId,socket=io(),remake=!1,onlinem=!1,o=0,aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];function los(e){socket.emit("turn",e)}function rematch(){0==remake?(socket.emit("rematch"),document.getElementById("reset").disabled=!0):1==remake&&socket.emit("rematchakkept")}function reset(){socket.emit("resee");for(var e=0;e<9;e++)document.getElementById("a"+e).innerHTML="";document.getElementById("reset").style="visibility:hidden",aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1]}async function neu(){fadebutton(!0),await sleep(animationspeed),onlinem=!0,b=document.getElementById("inpu").value,socket.emit("conn",b,2),localStorage.setItem("nameonline",b)}function dis(){socket.emit("dis"),document.getElementById("pin").style.display="none",document.getElementById("help").style.display="none",document.getElementById("chat").style.display="none",clearInterval(intervall)}function ping1(){var e=new Date;n=e.getTime(),socket.emit("ping1")}function lo(e){document.getElementById("ping").innerHTML=Math.round(o+e),o+=e}function typing(e){e?(document.getElementById("cha").classList.remove("fa-comment"),document.getElementById("cha").classList.add("fa-comment-dots")):(document.getElementById("cha").classList.remove("fa-comment-dots"),document.getElementById("cha").classList.add("fa-comment")),typingin(e)}socket.on("que",async function(e,t,n,o){if(1==e)fadebutton(!0),await sleep(animationspeed),document.getElementById("div0").style="display:none",document.getElementById("div1").style="display:none",document.getElementById("div2").style="display:block",document.getElementById("multiplayer").style="display:none","Notification"in window&&"denied"!==Notification.permission&&Notification.requestPermission(function(e){}),document.getElementById("help").style.display="none",closechat(),document.getElementById("chat-content").innerHTML="<center><b>Du solltest noch nicht hier sein!</b></center>",typing(!1),await sleep(100),fadebutton(!1);else if(2==e){fadebutton(!0),await sleep(animationspeed),document.getElementById("div0").style="display:none",document.getElementById("div1").style="display:block",document.getElementById("div2").style="display:none",document.getElementById("multiplayer").style="display:none",document.getElementById("youAre").innerHTML="You are "+t,youAreP=t,opponent=o,enemyAre=n;try{if("granted"===Notification.permission)new Notification("Gegner "+o+" will gegen dich spielen")}catch(e){}document.getElementById("score").innerHTML=youAreP+": 0 vs. "+enemyAre+": 0",aler("Gegner: "+o),"false"!=tut1?nochnichtgespielt():document.getElementById("help").style.display="block",document.getElementById("chat").style.display="block",await sleep(100),fadebutton(!1)}}),socket.on("turned",function(e,t,n,o,i){"move"==i?(document.getElementById("a"+n).innerHTML=e,document.getElementById("turn").innerHTML="Turn: "+t,"X"==e?aa[n]="1":"O"==e&&(aa[n]="2")):"red"==i?document.getElementById("a"+n).style.color="red":"rem"==i?document.getElementById("a"+o).removeAttribute("style"):"chan"==i?(document.getElementById("a"+n).style.color="red",document.getElementById("a"+o).removeAttribute("style")):"fin"==i&&(document.getElementById("a"+n).innerHTML=e,document.getElementById("a"+o).innerHTML=" ",document.getElementById("a"+o).removeAttribute("style"),document.getElementById("turn").innerHTML="Turn: "+t,"X"==e?aa[n]="1":"O"==e&&(aa[n]="2"),aa[o]=!1)}),socket.on("win",function(e,t,n,o){e==youAreP?(document.getElementById("score").innerHTML=youAreP+": "+t+" vs. "+enemyAre+": "+n,aler("Du hast gewonnen"),chatwrite("system","Du hast gewonnen")):(document.getElementById("score").innerHTML=youAreP+": "+n+" vs. "+enemyAre+": "+t,aler("Du hast verloren"),chatwrite("system","Du hast verloren"))}),socket.on("rese",function(){document.getElementById("reset").style="visibility:visible"}),socket.on("rematchask",function(){document.getElementById("reset").innerHTML="Accept Rematch",remake=!0}),socket.on("resett",function(){document.getElementById("reset").innerHTML="Rematch",remake=!1,document.getElementById("reset").disabled=!1,reset()}),socket.on("turnreset",function(){document.getElementById("turn").innerHTML="Turn: O"}),document.onkeydown=function(e){13===e.keyCode&&(0==onlinem?neu():inchat&&sen())},socket.on("erro",function(){aler("Error:<br>Bitte starte dein Spiel neu","hid"),err()}),socket.on("ping2",function(){var e=new Date;m=e.getTime();for(var t=(m-n-o)/10,i=0;i<10;i++)setTimeout(function(){lo(t)},99*i)}),intervall=setInterval(ping1,1e3),document.getElementById("pin").style.display="block",socket.on("serverRestart",async function(e){serverId!=e&&null!=serverId?(aler("Bitte starte dein Spiel neu.<br>Es gab einen Server Neustart","hid"),err()):serverId=e});var inchat=!1,inopenchat=!1,unrea=0;async function chating(){nofillter?(chat.style.display="block",await sleep(100),document.getElementsByClassName("chat-window")[0].classList.add("movechat"),document.getElementById("chatmodal").classList.add("chatopa"),unread(0),unrea=0,inopenchat=!0):chatwarning()}async function closechat(){document.getElementsByClassName("chat-window")[0].classList.remove("movechat"),document.getElementById("chatmodal").classList.remove("chatopa"),inchat=!1,inopenchat=!1,await sleep(animationspeed),chat.style.display="none"}function sen(){let e=document.getElementById("chatinputbox").value;""!=(e=e.trim())&&(e=htmlSpecialChars(e),socket.emit("sendMessage",e)),document.getElementById("chatinputbox").value=""}function nachrichtplus(e){inopenchat||(unrea+=e,unread(unrea))}function foc(){socket.emit("foc1"),inchat=!0}function blu(){socket.emit("blu1"),inchat=!1}socket.on("foc2",function(){typing(!0)}),socket.on("blu2",function(){typing(!1)}),socket.on("startChat",function(){document.getElementById("chat-content").innerHTML="",chatwrite("system","Dies ist der Anfang deines Chats mit "+opponent)}),socket.on("receiveMessage",function(e,t){chatwrite(e,t)});';

/*var socket = io();
    var youAreP,enemyAre;
    var remake = false;
    var onlinem = false;
    var n,o=0;
    var aa=[false,false,false,false,false,false,false,false,false];
    var opponent;

    function los(hh){
        socket.emit("turn",hh);
    };

    function rematch(){
        if(remake==false) {
            socket.emit("rematch");
            document.getElementById("reset").disabled = true;
        }

        else if(remake==true) socket.emit("rematchakkept");
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
            fadebutton(true);
            await sleep(animationspeed);
            document.getElementById("div0").style="display:none";
            document.getElementById("div1").style="display:none";
            document.getElementById("div2").style="display:block";
            document.getElementById("multiplayer").style="display:none";
                 if (!("Notification" in window)){}
                 else if (Notification.permission !== "denied") {
                     Notification.requestPermission(function (permission){});
                 }
            document.getElementById("help").style.display="none";
            closechat();
            document.getElementById("chat-content").innerHTML="<center><b>Du solltest noch nicht hier sein!</b></center>";
            typing(false);
            await sleep(100);
            fadebutton(false);
        }
        else if(data==2){
            fadebutton(true);
            await sleep(animationspeed);
            document.getElementById("div0").style="display:none";
            document.getElementById("div1").style="display:block";
            document.getElementById("div2").style="display:none";
            document.getElementById("multiplayer").style="display:none";
            document.getElementById("youAre").innerHTML = "You are "+player;
            youAreP = player
            opponent = name;
            enemyAre = enem;
                try{
                    if(Notification.permission === "granted") {
                        var notification = new Notification("Gegner "+name+" will gegen dich spielen");
                    }
                }
                catch(erro){}
            document.getElementById("score").innerHTML = youAreP+": 0 vs. "+enemyAre+": 0";
            aler("Gegner: "+name);
            if(tut1 != "false") {
                nochnichtgespielt();
            } else {
                document.getElementById("help").style.display = "block";
            }
            document.getElementById("chat").style.display="block";
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

    function sen(){
        let message = document.getElementById("chatinputbox").value;
        message = message.trim();
        if(message!=""){
            message = htmlSpecialChars(message);
            socket.emit("sendMessage",message);
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

    socket.on("receiveMessage",function(ff,gg){
        chatwrite(ff,gg);
    });*/

var offline = 'var hh,awe,jj=!0,jkl=0,p1=0,p2=0;function los(e){if(!1===aa[e]){jj?(document.getElementById("a"+e).innerHTML="O",document.getElementById("turn").innerHTML="Turn: X",aa[e]="2"):(document.getElementById("a"+e).innerHTML="X",document.getElementById("turn").innerHTML="Turn: O",aa[e]="1"),jj=!jj;for(var a=1;a<=2;a++){1==a&&(awe="1"),2==a&&(awe="2");for(var n=0;n<9;n+=3)if(aa[n]==aa[n+1]&&aa[n+1]==aa[n+2]&&aa[n+2]==awe)return void winner(awe);for(var r=0;r<=3;r++)if(aa[r]==aa[r+3]&&aa[r+3]==aa[r+6]&&aa[r+6]==awe)return void winner(awe);if(aa[0]==aa[4]&&aa[4]==aa[8]&&aa[8]==awe)return void winner(awe);if(aa[2]==aa[4]&&aa[4]==aa[6]&&aa[6]==awe)return void winner(awe)}9==++jkl&&rese()}}function rese(){document.getElementById("reset").style="visibility:visible",jkl=0,aa=[3,3,3,3,3,3,3,3,3]}function rematch(){aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];for(var e=0;e<9;e++)document.getElementById("a"+e).innerHTML="";document.getElementById("reset").style="visibility:hidden"}function winner(e){1==e?(p1++,aler("Gewinner: X")):2==e&&(p2++,aler("Gewinner: O")),rese(),document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2}aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];'
/*var  hh,jj=true;
         var awe,jkl=0;
         var p1=0,p2=0; aa=[false,false,false,false,false,false,false,false,false];
         function los(hh){
             if((jj)&&(aa[hh]===false)){zug(hh);
             if(win===false){bot();}}
         }

         function zug(hh)
         {
             if(aa[hh]===false)
             {
                 if(!jj)
                 {
                     document.getElementById("a"+hh).innerHTML="X";
                     document.getElementById("turn").innerHTML="Turn: O";
                     aa[hh]="1";

                 }
                 else
                 {
                      document.getElementById("a"+hh).innerHTML="O";
                      document.getElementById("turn").innerHTML="Turn: X";
                      aa[hh]="2";
                 }
                 jj=!jj;

                 for(var hhh=1;hhh<=2;hhh++)
                 {
                     if(hhh==1)
                     {
                         awe="1";
                     }
                     if(hhh==2)
                     {
                         awe="2";
                     }

                     for(var fo=0;fo<9;fo=fo+3)
                     {
                         if((aa[fo]==aa[fo+1])&&(aa[fo+1]==aa[fo+2])&&(aa[fo+2]==awe))
                         {
                             winner(awe);
                             return;
                         }
                     }
                     for(var fa=0;fa<=3;fa++)
                     {
                         if((aa[fa]==aa[fa+3])&&(aa[fa+3]==aa[fa+6])&&(aa[fa+6]==awe))
                         {
                             winner(awe);
                             return;
                         }
                     }

              if((aa[0]==aa[4])&&(aa[4]==aa[8])&&(aa[8]==awe))
                     {
                          winner(awe);
                          return;
                     }
                     if((aa[2]==aa[4])&&(aa[4]==aa[6])&&(aa[6]==awe))
                     {
                          winner(awe);
                          return;
                     }
                 }
                 jkl++;
                 if(jkl==9)
                 {
                      rese();
                  }
             }
         }

         function rese(){
               document.getElementById("reset").style="visibility:visible";
             jkl=0;
             aa=[3,3,3,3,3,3,3,3,3];
             }


         function rematch(){
                     aa=[false,false,false,false,false,false,false,false,false];
             for(var www = 0;www<9;www++){
             document.getElementById("a"+www).innerHTML="";}
             document.getElementById("reset").style="visibility:hidden";
         }

         function winner(ji){
             if(ji==1){
                 p1++;
                 aler("Winner: X");
             }
             else if(ji==2){
                 p2++;
                 aler("Winner: O");
             }
             rese();
             document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2;
         }*/
var easy = 'var hh,awe,jj=!0,win=!1,jkl=0,p1=0,p2=0;function los(a){jj&&!1===aa[a]&&(zug(a),!1===win&&bot())}function zug(a){if(!1===aa[a]){jj?(document.getElementById("a"+a).innerHTML="O",document.getElementById("turn").innerHTML="Turn: X",aa[a]="2"):(document.getElementById("a"+a).innerHTML="X",document.getElementById("turn").innerHTML="Turn: O",aa[a]="1"),jj=!jj;for(var e=1;e<=2;e++){1==e&&(awe="1"),2==e&&(awe="2");for(var n=0;n<9;n+=3)if(aa[n]==aa[n+1]&&aa[n+1]==aa[n+2]&&aa[n+2]==awe)return void winner(awe);for(var t=0;t<=3;t++)if(aa[t]==aa[t+3]&&aa[t+3]==aa[t+6]&&aa[t+6]==awe)return void winner(awe);if(aa[0]==aa[4]&&aa[4]==aa[8]&&aa[8]==awe)return void winner(awe);if(aa[2]==aa[4]&&aa[4]==aa[6]&&aa[6]==awe)return void winner(awe)}9==++jkl&&rese()}}function rese(){win=!0,document.getElementById("reset").style="visibility:visible",jkl=0,aa=[3,3,3,3,3,3,3,3,3]}function rematch(){win=!1,jj=!0,aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];for(var a=0;a<9;a++)document.getElementById("a"+a).innerHTML="";document.getElementById("reset").style="visibility:hidden"}function winner(a){1==a?(p1++,aler("Winner: X")):2==a&&(p2++,aler("Winner: O")),rese(),document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2}function bot(){var a;do{a=Math.floor(9*Math.random())}while(!1!==aa[a]);zug(a)}aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];'
/*var  hh,jj=true,win=false;
             var awe,jkl=0;
             var p1=0,p2=0; aa=[false,false,false,false,false,false,false,false,false];
             function los(hh){
                 if((jj)&&(aa[hh]===false)){zug(hh);
                 if(win===false){bot();}}
             }

             function zug(hh)
             {
                 if(aa[hh]===false)
                 {
                     if(!jj)
                     {
                         document.getElementById("a"+hh).innerHTML="X";
                         document.getElementById("turn").innerHTML="Turn: O";
                         aa[hh]="1";

                     }
                     else
                     {
                          document.getElementById("a"+hh).innerHTML="O";
                          document.getElementById("turn").innerHTML="Turn: X";
                          aa[hh]="2";
                     }
                     jj=!jj;

                     for(var hhh=1;hhh<=2;hhh++)
                     {
                         if(hhh==1)
                         {
                             awe="1";
                         }
                         if(hhh==2)
                         {
                             awe="2";
                         }

                         for(var fo=0;fo<9;fo=fo+3)
                         {
                             if((aa[fo]==aa[fo+1])&&(aa[fo+1]==aa[fo+2])&&(aa[fo+2]==awe))
                             {
                                 winner(awe);
                                 return;
                             }
                         }
                         for(var fa=0;fa<=3;fa++)
                         {
                             if((aa[fa]==aa[fa+3])&&(aa[fa+3]==aa[fa+6])&&(aa[fa+6]==awe))
                             {
                                 winner(awe);
                                 return;
                             }
                         }

                  if((aa[0]==aa[4])&&(aa[4]==aa[8])&&(aa[8]==awe))
                         {
                              winner(awe);
                              return;
                         }
                         if((aa[2]==aa[4])&&(aa[4]==aa[6])&&(aa[6]==awe))
                         {
                              winner(awe);
                              return;
                         }
                     }
                     jkl++;
                     if(jkl==9)
                     {
                          rese();
                      }
                 }
             }

             function rese(){
                   document.getElementById("reset").style="visibility:visible";
                 jkl=0;
                 aa=[3,3,3,3,3,3,3,3,3];
                 win=true;
                 }


             function rematch(){
                 win=false;
                 jj=true;
                         aa=[false,false,false,false,false,false,false,false,false];
                 for(var www = 0;www<9;www++){
                 document.getElementById("a"+www).innerHTML="";}
                 document.getElementById("reset").style="visibility:hidden";
             }

             function winner(ji){
                 if(ji==1){
                     p1++;
                     aler("Winner: X");
                 }
                 else if(ji==2){
                     p2++;
                     aler("Winner: O");
                 }
                 rese();
                 document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2;
             }

             function bot(){
                 var ran;
                 do{ran = Math.floor(Math.random() * (9));}
                 while(aa[ran]!==false);
                 zug(ran);
             }
             */
var mittel = 'var hh,awe,jj=!0,win=!1,jkl=0,p1=0,p2=0;aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];var bb=[[void 0,void 0,void 0],[void 0,void 0,void 0],[void 0,void 0,void 0]];function los(b){jj&&!1===aa[b]&&(zug(b),!1===win&&bot(b))}function zug(b){if(!1===aa[b]){jj?(document.getElementById("a"+b).innerHTML="O",document.getElementById("turn").innerHTML="Turn: X",aa[b]="2"):(document.getElementById("a"+b).innerHTML="X",document.getElementById("turn").innerHTML="Turn: O",aa[b]="1"),jj=!jj;for(var a=1;a<=2;a++){1==a&&(awe="1"),2==a&&(awe="2");for(var e=0;e<9;e+=3)if(aa[e]==aa[e+1]&&aa[e+1]==aa[e+2]&&aa[e+2]==awe)return void winner(awe);for(var t=0;t<=3;t++)if(aa[t]==aa[t+3]&&aa[t+3]==aa[t+6]&&aa[t+6]==awe)return void winner(awe);if(aa[0]==aa[4]&&aa[4]==aa[8]&&aa[8]==awe)return void winner(awe);if(aa[2]==aa[4]&&aa[4]==aa[6]&&aa[6]==awe)return void winner(awe)}9==++jkl&&rese()}}function rese(){win=!0,document.getElementById("reset").style="visibility:visible",jkl=0,aa=[3,3,3,3,3,3,3,3,3]}function rematch(){aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];for(var b=0;b<9;b++)document.getElementById("a"+b).innerHTML="";document.getElementById("reset").style="visibility:hidden",win=!(jj=!0),bb=[[void 0,void 0,void 0],[void 0,void 0,void 0],[void 0,void 0,void 0]]}function winner(b){1==b?(p1++,aler("Winner: X")):2==b&&(p2++,aler("Winner: O")),rese(),document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2}function bot(b){var a,e,t;if(mov=!1,write(b,1),!1===mov)for(e in bb)!0===test(bb[e][0],bb[e][1],bb[e][2])&&!1!==(t=test3(bb[e][0],bb[e][1],bb[e][2]))&&(mov=!0,a=3*e+ +t);if(!1===mov)for(e in bb)!0===test(bb[0][e],bb[1][e],bb[2][e])&&!1!==(t=test3(bb[0][e],bb[1][e],bb[2][e]))&&(mov=!0,a=3*t+ +e);if(!1===mov&&!0===test(bb[0][0],bb[1][1],bb[2][2])&&!1!==(t=test3(bb[0][0],bb[1][1],bb[2][2]))&&(mov=!0,a=4*t),!1===mov&&!0===test(bb[0][2],bb[1][1],bb[2][0])&&!1!==(t=test3(bb[0][2],bb[1][1],bb[2][0]))&&(mov=!0,a=2*t+2),0==mov)for(e in bb)!0===test(bb[e][0],bb[e][1],bb[e][2])&&!1!==(t=test2(bb[e][0],bb[e][1],bb[e][2]))&&(mov=!0,a=3*e+t);if(!1===mov)for(e in bb)!0===test(bb[0][e],bb[1][e],bb[2][e])&&!1!==(t=test2(bb[0][e],bb[1][e],bb[2][e]))&&(mov=!0,a=3*t+ +e);if(!1===mov&&!0===test(bb[0][0],bb[1][1],bb[2][2])&&!1!==(t=test2(bb[0][0],bb[1][1],bb[2][2]))&&(mov=!0,a=4*t),!1===mov&&!0===test(bb[0][2],bb[1][1],bb[2][0])&&!1!==(t=test2(bb[0][2],bb[1][1],bb[2][0]))&&(mov=!0,a=2*t+2),!1===mov){for(;a=Math.floor(9*Math.random()),!1!==aa[a];);mov=!0}!0===mov&&(zug(a),write(a,2))}function write(b,a){switch(b){case 0:bb[0][0]=a;break;case 1:bb[0][1]=a;break;case 2:bb[0][2]=a;break;case 3:bb[1][0]=a;break;case 4:bb[1][1]=a;break;case 5:bb[1][2]=a;break;case 6:bb[2][0]=a;break;case 7:bb[2][1]=a;break;case 8:bb[2][2]=a}}function test(b,a,e){return(void 0===b||void 0===a||void 0===e)&&((b!=a||b!=e)&&(b==a||b==e||a==e))}function test2(b,a,e){return b=Math.abs(Math.round(b)),a=Math.abs(Math.round(a)),e=Math.abs(Math.round(e)),(1==b||1==a||1==e)&&(1==b&&1==a&&isNaN(e)?2:1==b&&1==e&&isNaN(a)?1:!(1!=e||1!=a||!isNaN(b))&&0)}function test3(b,a,e){return b=Math.abs(Math.round(b)),a=Math.abs(Math.round(a)),e=Math.abs(Math.round(e)),(2==b||2==a||2==e)&&(2==b&&2==a&&isNaN(e)?2:2==b&&2==e&&isNaN(a)?1:!(2!=e||2!=a||!isNaN(b))&&0)}'
/*var  hh,jj=true,win=false;
    var awe,jkl=0;
    var p1=0,p2=0; aa=[false,false,false,false,false,false,false,false,false];
    var bb=[[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]];

    function los(hh){
        if((jj)&&(aa[hh]===false)){zug(hh);
        if(win===false){bot(hh);}}
    }

    function zug(hh)

    {
        if(aa[hh]===false)
        {
            if(!jj)
            {
                document.getElementById("a"+hh).innerHTML="X";
                document.getElementById("turn").innerHTML="Turn: O";
                aa[hh]="1";

            }
            else
            {
                 document.getElementById("a"+hh).innerHTML="O";
                 document.getElementById("turn").innerHTML="Turn: X";
                 aa[hh]="2";
            }
            jj=!jj;

            for(var hhh=1;hhh<=2;hhh++)
            {
                if(hhh==1)
                {
                    awe="1";
                }
                if(hhh==2)
                {
                    awe="2";
                }

                for(var fo=0;fo<9;fo=fo+3)
                {
                    if((aa[fo]==aa[fo+1])&&(aa[fo+1]==aa[fo+2])&&(aa[fo+2]==awe))
                    {
                        winner(awe);
                        return;
                    }
                }
                for(var fa=0;fa<=3;fa++)
                {
                    if((aa[fa]==aa[fa+3])&&(aa[fa+3]==aa[fa+6])&&(aa[fa+6]==awe))
                    {
                        winner(awe);
                        return;
                    }
                }

            if((aa[0]==aa[4])&&(aa[4]==aa[8])&&(aa[8]==awe))
                {
                     winner(awe);
                     return;
                }
                if((aa[2]==aa[4])&&(aa[4]==aa[6])&&(aa[6]==awe))
                {
                     winner(awe);
                     return;
                }
            }
            jkl++;
            if(jkl==9)
            {
                 rese();
            }
        }
    }

    function rese(){
        win=true;
          document.getElementById("reset").style="visibility:visible";
        jkl=0;
        aa=[3,3,3,3,3,3,3,3,3];
        }


    function rematch(){
        aa=[false,false,false,false,false,false,false,false,false];
        for(var www = 0;www<9;www++){
        document.getElementById("a"+www).innerHTML="";}
        document.getElementById("reset").style="visibility:hidden";
        jj=true;
        win=false;
        bb=[[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]];
    }

    function winner(ji){
        if(ji==1){
            p1++;
            aler("Winner: X");
        }
        else if(ji==2){

            p2++;
            aler("Winner: O");
        }
        rese();
        document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2;
    }


    function bot(hh){
        var ran,i,tes;
        mov=false;
        write(hh,1);//1=other Player 2=bot
        //testing own winning opertunity
        if(mov===false){
            for(i in bb) {//horizontal
                if(test(bb[i][0],bb[i][1],bb[i][2])===true){
                    tes = test3(bb[i][0],bb[i][1],bb[i][2]);
                    //alert(i+" + "+tes);
                    if(tes!==false){
                        mov=true;
                        ran = 3*i+tes*1;
                    }
                }
            }
        }
        if(mov===false){//vertical
            for(i in bb) {
                if(test(bb[0][i],bb[1][i],bb[2][i])===true){
                    tes = test3(bb[0][i],bb[1][i],bb[2][i]);
                    if(tes!==false){
                        mov=true;
                        ran = 3*tes+i*1;
                    }
                }
            }
        }
        if(mov===false){//diagonal \
            if(test(bb[0][0],bb[1][1],bb[2][2])===true){
                tes = test3(bb[0][0],bb[1][1],bb[2][2]);
                if(tes!==false){
                    mov=true;
                    ran = 4*tes;
                }
            }
        }
        if(mov===false){//diagonal /
            if(test(bb[0][2],bb[1][1],bb[2][0])===true){
                tes = test3(bb[0][2],bb[1][1],bb[2][0]);
                if(tes!==false){
                    mov=true;
                    ran = 2*tes+2;
                }
            }
        }
        //checking win opertynity othre player
        if(mov==false){
            for(i in bb) {//horizontal
                if(test(bb[i][0],bb[i][1],bb[i][2])===true){
                    tes = test2(bb[i][0],bb[i][1],bb[i][2]);
                    if(tes!==false){
                        mov=true;
                        ran = 3*i+tes;
                    }
                }
            }
        }
        if(mov===false){//vertical
            for(i in bb) {
                if(test(bb[0][i],bb[1][i],bb[2][i])===true){
                    tes = test2(bb[0][i],bb[1][i],bb[2][i]);
                    if(tes!==false){
                        mov=true;
                        ran = 3*tes+i*1;
                    }
                }
            }
        }
        if(mov===false){//diagonal \
            if(test(bb[0][0],bb[1][1],bb[2][2])===true){
                tes = test2(bb[0][0],bb[1][1],bb[2][2]);
                if(tes!==false){
                    mov=true;
                    ran = 4*tes;
                }
            }
        }
        if(mov===false){//diagonal /
            if(test(bb[0][2],bb[1][1],bb[2][0])===true){
                tes = test2(bb[0][2],bb[1][1],bb[2][0]);
                if(tes!==false){
                    mov=true;
                    ran = 2*tes+2;
                }
            }
        }
        if(mov===false){
            do{ran = Math.floor(Math.random() * (9));}
            while(aa[ran]!==false);
            //do{ran =  Math.abs(Math.round(prompt()))-1;}
            //while(aa[ran]!==false);

            mov=true;
        }
        if(mov===true){
            zug(ran);
            write(ran,2);
            //alert(bb);
        }


    }


    function write(hh,inp){
        switch (hh){
            case 0:bb[0][0]=inp;break;
            case 1:bb[0][1]=inp;break;
            case 2:bb[0][2]=inp;break;
            case 3:bb[1][0]=inp;break;
            case 4:bb[1][1]=inp;break;
            case 5:bb[1][2]=inp;break;
            case 6:bb[2][0]=inp;break;
            case 7:bb[2][1]=inp;break;
            case 8:bb[2][2]=inp;break;
            default:break;
        }
    }



    function test(a,b,c){
        if((a===undefined)||(b===undefined)||(c===undefined)){
            if((a==b)&&(a==c)){
                return false;
            }
            else if((a==b)||(a==c)||(b==c)){
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function test2(a,b,c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a==1)||(b==1)||(c==1)){
            if((a==1)&&(b==1)&&(isNaN(c)))return 2;
            else if((a==1)&&(c==1)&&(isNaN(b)))return 1;
            else if((c==1)&&(b==1)&&(isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    function test3(a,b,c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a==2)||(b==2)||(c==2)){
            if((a==2)&&(b==2)&&(isNaN(c)))return 2;
            else if((a==2)&&(c==2)&&(isNaN(b)))return 1;
            else if((c==2)&&(b==2)&&(isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    //aler(isNaN(Math.abs(Math.round(2))));*/
var schwer = 'var awe,jj=!0,win=!1,jkl=0,p1=0,p2=0;aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];var moo,mii,bb=[[void 0,void 0,void 0],[void 0,void 0,void 0],[void 0,void 0,void 0]];function los(b){jj&&!1===aa[b]&&(zug(b),!1===win&&bot(b))}function zug(b){if(!1===aa[b]){jj?(document.getElementById("a"+b).innerHTML="O",document.getElementById("turn").innerHTML="Turn: X",aa[b]="2"):(document.getElementById("a"+b).innerHTML="X",document.getElementById("turn").innerHTML="Turn: O",aa[b]="1"),jj=!jj;for(var o=1;o<=2;o++){1==o&&(awe="1"),2==o&&(awe="2");for(var e=0;e<9;e+=3)if(aa[e]==aa[e+1]&&aa[e+1]==aa[e+2]&&aa[e+2]==awe)return void winner(awe);for(var t=0;t<=3;t++)if(aa[t]==aa[t+3]&&aa[t+3]==aa[t+6]&&aa[t+6]==awe)return void winner(awe);if(aa[0]==aa[4]&&aa[4]==aa[8]&&aa[8]==awe)return void winner(awe);if(aa[2]==aa[4]&&aa[4]==aa[6]&&aa[6]==awe)return void winner(awe)}9==++jkl&&rese()}}function rese(){win=!0,aa=[3,3,3,3,3,3,3,3,3],document.getElementById("reset").style="visibility:visible"}function rematch(){aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];for(var b=0;b<9;b++)document.getElementById("a"+b).innerHTML="";jj=!0,win=!1,bb=[[void 0,void 0,void 0],[void 0,void 0,void 0],[void 0,void 0,void 0]],jkl=0,awe=void 0,moo=void 0,mii=void 0,document.getElementById("reset").style="visibility:hidden"}function winner(b){1==b?(p1++,aler("Winner: X")):2==b&&(p2++,aler("Winner: O")),rese(),document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2}function bot(b){var o,e,t;if(mov=!1,write(b,1),jkl>=3){if(!1===mov)for(e in bb)!0===test(bb[e][0],bb[e][1],bb[e][2])&&!1!==(t=test3(bb[e][0],bb[e][1],bb[e][2]))&&(mov=!0,o=3*e+1*t);if(!1===mov)for(e in bb)!0===test(bb[0][e],bb[1][e],bb[2][e])&&!1!==(t=test3(bb[0][e],bb[1][e],bb[2][e]))&&(mov=!0,o=3*t+1*e);if(!1===mov&&!0===test(bb[0][0],bb[1][1],bb[2][2])&&!1!==(t=test3(bb[0][0],bb[1][1],bb[2][2]))&&(mov=!0,o=4*t),!1===mov&&!0===test(bb[0][2],bb[1][1],bb[2][0])&&!1!==(t=test3(bb[0][2],bb[1][1],bb[2][0]))&&(mov=!0,o=2*t+2),0==mov)for(e in bb)!0===test(bb[e][0],bb[e][1],bb[e][2])&&!1!==(t=test2(bb[e][0],bb[e][1],bb[e][2]))&&(mov=!0,o=3*e+t);if(!1===mov)for(e in bb)!0===test(bb[0][e],bb[1][e],bb[2][e])&&!1!==(t=test2(bb[0][e],bb[1][e],bb[2][e]))&&(mov=!0,o=3*t+1*e);!1===mov&&!0===test(bb[0][0],bb[1][1],bb[2][2])&&!1!==(t=test2(bb[0][0],bb[1][1],bb[2][2]))&&(mov=!0,o=4*t),!1===mov&&!0===test(bb[0][2],bb[1][1],bb[2][0])&&!1!==(t=test2(bb[0][2],bb[1][1],bb[2][0]))&&(mov=!0,o=2*t+2)}if(!1===mov){if(1==jkl){switch(b){case 0:o=4;break;case 1:o=7,mii=6;break;case 2:o=4;break;case 3:o=5,mii=8;break;case 4:o=6,mii=!0;break;case 5:o=3,mii=0;break;case 6:o=4;break;case 7:o=1,mii=2;break;case 8:o=4}4==o&&(moo=!0),mov=!0}else 0==mov&&!0===mii&&2==b&&3==jkl&&(o=0,mov=!0),0==mov&&4==b&&3==jkl&&(mov=!0,o=Math.abs(Math.round(mii))),0==mov&&!0===test4(bb[0][1],bb[1][0],bb[0][0],bb[0][2],bb[2][0])&&(mov=!0,o=0),0==mov&&!0===test4(bb[0][1],bb[1][2],bb[0][2],bb[0][0],bb[2][2])&&(mov=!0,o=2),0==mov&&!0===test4(bb[2][1],bb[1][0],bb[2][0],bb[0][0],bb[2][2])&&(mov=!0,o=6),0==mov&&!0===test4(bb[2][1],bb[1][2],bb[2][2],bb[0][2],bb[2][0])&&(mov=!0,o=8),0==mov&&!0===test4(bb[2][0],bb[0][2],bb[1][0],bb[0][0],bb[0][1])&&(mov=!0,o=1),0==mov&&!0===test4(bb[2][0],bb[0][2],bb[2][1],bb[2][2],bb[1][2])&&(mov=!0,o=3),0==mov&&!0===test4(bb[0][0],bb[2][2],bb[0][1],bb[0][2],bb[1][2])&&(mov=!0,o=5),0==mov&&!0===test4(bb[0][0],bb[2][2],bb[1][0],bb[2][0],bb[2][1])&&(mov=!0,o=7),0==mov&&!0===test4(bb[0][0],bb[2][1],bb[2][0],bb[2][2],bb[1][0])&&(mov=!0,o=!0===moo?3:8),0==mov&&!0===test4(bb[0][2],bb[2][1],bb[2][0],bb[2][2],bb[1][2])&&(mov=!0,o=!0===moo?5:6),0==mov&&!0===test4(bb[0][2],bb[1][0],bb[0][0],bb[2][0],bb[0][1])&&(mov=!0,o=!0===moo?1:6),0==mov&&!0===test4(bb[2][2],bb[1][0],bb[0][0],bb[2][0],bb[2][1])&&(mov=!0,o=!0===moo?7:0),0==mov&&!0===test4(bb[2][0],bb[0][1],bb[0][0],bb[0][2],bb[1][0])&&(mov=!0,o=!0===moo?3:2),0==mov&&!0===test4(bb[2][2],bb[0][1],bb[0][0],bb[0][2],bb[1][2])&&(mov=!0,o=!0===moo?5:0),0==mov&&!0===test4(bb[0][0],bb[1][2],bb[0][2],bb[2][2],bb[0][1])&&(mov=!0,o=!0===moo?1:8),0==mov&&!0===test4(bb[2][0],bb[1][2],bb[0][2],bb[2][2],bb[2][1])&&(mov=!0,o=!0===moo?7:2),0==mov&&!0===test4(bb[0][0],bb[0][2],bb[1][1],bb[1][2],bb[2][2])&&(mov=!0,o=8),0==mov&&!0===test4(bb[1][2],bb[0][0],bb[1][1],bb[0][1],bb[0][2])&&(mov=!0,o=2),0==mov&&!0===test4(bb[2][0],bb[2][2],bb[1][1],bb[1][0],bb[0][0])&&(mov=!0,o=0),0==mov&&!0===test4(bb[0][2],bb[2][2],bb[1][1],bb[2][1],bb[2][0])&&(mov=!0,o=6),0==mov&&!0===test4(bb[0][0],bb[0][2],bb[1][1],bb[1][0],bb[2][0])&&(mov=!0,o=6),0==mov&&!0===test4(bb[1][2],bb[0][0],bb[1][1],bb[2][1],bb[2][2])&&(mov=!0,o=8),0==mov&&!0===test4(bb[2][0],bb[2][2],bb[1][1],bb[1][2],bb[0][2])&&(mov=!0,o=2),0==mov&&!0===test4(bb[0][2],bb[2][2],bb[1][1],bb[0][1],bb[0][0])&&(mov=!0,o=0);if(!1===mov){do{o=Math.floor(9*Math.random())}while(!1!==aa[o]);mov=!0}}!0===mov&&(zug(o),write(o,2))}function write(b,o){switch(b){case 0:bb[0][0]=o;break;case 1:bb[0][1]=o;break;case 2:bb[0][2]=o;break;case 3:bb[1][0]=o;break;case 4:bb[1][1]=o;break;case 5:bb[1][2]=o;break;case 6:bb[2][0]=o;break;case 7:bb[2][1]=o;break;case 8:bb[2][2]=o}}function test(b,o,e){return(void 0===b||void 0===o||void 0===e)&&((b!=o||b!=e)&&(b==o||b==e||o==e))}function test2(b,o,e){return b=Math.abs(Math.round(b)),o=Math.abs(Math.round(o)),e=Math.abs(Math.round(e)),(1==b||1==o||1==e)&&(1==b&&1==o&&isNaN(e)?2:1==b&&1==e&&isNaN(o)?1:!(1!=e||1!=o||!isNaN(b))&&0)}function test3(b,o,e){return b=Math.abs(Math.round(b)),o=Math.abs(Math.round(o)),e=Math.abs(Math.round(e)),(2==b||2==o||2==e)&&(2==b&&2==o&&isNaN(e)?2:2==b&&2==e&&isNaN(o)?1:!(2!=e||2!=o||!isNaN(b))&&0)}function test4(b,o,e,t,a){return 1==b&&1==o&&void 0===e&&void 0===t&&void 0===a}';
/*  var jj=true,win=false;
    var awe,jkl=0;
    var p1=0,p2=0; aa=[false,false,false,false,false,false,false,false,false];
    var bb=[[undefined,undefined,undefined],
            [undefined,undefined,undefined],
            [undefined,undefined,undefined]
        ];
    var moo, mii;

    function los(hh){
        if((jj)&&(aa[hh]===false)){
            zug(hh);
            if(win===false){
                bot(hh);
            }
        }
    }

    function zug(hh) {
        if(aa[hh]===false)
        {
            if(!jj)
            {
                document.getElementById("a"+hh).innerHTML="X";
                document.getElementById("turn").innerHTML="Turn: O";
                aa[hh]="1";

            }
            else
            {
                 document.getElementById("a"+hh).innerHTML="O";
                 document.getElementById("turn").innerHTML="Turn: X";
                 aa[hh]="2";
            }
            jj=!jj;

            for(var hhh=1;hhh<=2;hhh++)
            {
                if(hhh==1)
                {
                    awe="1";
                }
                if(hhh==2)
                {
                    awe="2";
                }

                for(var fo=0;fo<9;fo=fo+3)
                {
                    if((aa[fo]==aa[fo+1])&&(aa[fo+1]==aa[fo+2])&&(aa[fo+2]==awe))
                    {
                        winner(awe);
                        return;
                    }
                }
                for(var fa=0;fa<=3;fa++)
                {
                    if((aa[fa]==aa[fa+3])&&(aa[fa+3]==aa[fa+6])&&(aa[fa+6]==awe))
                    {
                        winner(awe);
                        return;
                    }
                }

            if((aa[0]==aa[4])&&(aa[4]==aa[8])&&(aa[8]==awe))
                {
                     winner(awe);
                     return;
                }
                if((aa[2]==aa[4])&&(aa[4]==aa[6])&&(aa[6]==awe))
                {
                     winner(awe);
                     return;
                }
            }
            jkl++;
            if(jkl==9)
            {
                 rese();
            }
        }
    }

    function rese(){
        win=true;
        aa=[3,3,3,3,3,3,3,3,3];
        document.getElementById("reset").style="visibility:visible";
        }


        function rematch(){
        aa=[false,false,false,false,false,false,false,false,false];
        for(var www = 0;www<9;www++){
        document.getElementById("a"+www).innerHTML="";}
        jj=true;
        win=false;
        bb=[[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]];
        jkl = 0;
        awe = undefined;
        moo = undefined;
        mii = undefined;
        document.getElementById("reset").style="visibility:hidden";
    }

    function winner(ji){
        if(ji==1){
            p1++;
            aler("Winner: X");
        }
        else if(ji==2){

            p2++;
            aler("Winner: O");
        }
        rese();
        document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2;
    }


    function bot(hh){
        var ran,i,tes;
        mov=false;
        write(hh,1);//1=other Player 2=bot
        //testing own winning opertunity
        if(jkl>=3){
            if(mov===false){
                for(i in bb) {//horizontal
                    if(test(bb[i][0],bb[i][1],bb[i][2])===true){
                        tes = test3(bb[i][0],bb[i][1],bb[i][2]);
                        //alert(i+" + "+tes);
                        if(tes!==false){
                            mov=true;
                            ran = 3*i+tes*1;
                        }
                    }
                }
            }
            if(mov===false){//vertical
                for(i in bb) {
                    if(test(bb[0][i],bb[1][i],bb[2][i])===true){
                        tes = test3(bb[0][i],bb[1][i],bb[2][i]);
                        if(tes!==false){
                            mov=true;
                            ran = 3*tes+i*1;
                        }
                    }
                }
            }
            if(mov===false){//diagonal \
                if(test(bb[0][0],bb[1][1],bb[2][2])===true){
                    tes = test3(bb[0][0],bb[1][1],bb[2][2]);
                    if(tes!==false){
                        mov=true;
                        ran = 4*tes;
                    }
                }
            }
            if(mov===false){//diagonal /
                if(test(bb[0][2],bb[1][1],bb[2][0])===true){
                    tes = test3(bb[0][2],bb[1][1],bb[2][0]);
                    if(tes!==false){
                        mov=true;
                        ran = 2*tes+2;
                    }
                }
            }
            //checking win opertynity other player
            if(mov==false){
                for(i in bb) {//horizontal
                    if(test(bb[i][0],bb[i][1],bb[i][2])===true){
                        tes = test2(bb[i][0],bb[i][1],bb[i][2]);
                        if(tes!==false){
                            mov=true;
                            ran = 3*i+tes;
                        }
                    }
                }
            }
            if(mov===false){//vertical
                for(i in bb) {
                    if(test(bb[0][i],bb[1][i],bb[2][i])===true){
                        tes = test2(bb[0][i],bb[1][i],bb[2][i]);
                        if(tes!==false){
                            mov=true;
                            ran = 3*tes+i*1;
                        }
                    }
                }
            }
            if(mov===false){//diagonal \
                if(test(bb[0][0],bb[1][1],bb[2][2])===true){
                    tes = test2(bb[0][0],bb[1][1],bb[2][2]);
                    if(tes!==false){
                        mov=true;
                        ran = 4*tes;
                    }
                }
            }
            if(mov===false){//diagonal /
                if(test(bb[0][2],bb[1][1],bb[2][0])===true){
                    tes = test2(bb[0][2],bb[1][1],bb[2][0]);
                    if(tes!==false){
                        mov=true;
                        ran = 2*tes+2;
                    }
                }
            }
        }

        if(mov===false){//kjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkj
            if(jkl==1){
                switch (hh){
                    case 0: ran=4;break;
                    case 1: ran=7;mii=6;break;
                    case 2: ran=4;break;
                    case 3: ran=5;mii=8;break;
                    case 4: ran=6;mii=true;break;
                    case 5: ran=3;mii=0;break;
                    case 6: ran=4;break;
                    case 7: ran=1;mii=2;break;
                    case 8: ran=4;break;
                }
                if(ran==4)moo=true;
                mov=true;
            }
            else{
                //  ???
                //  ?X?
                //  0??
                if((mov==false)&&(mii===true)&&(hh==2)&&(jkl==3)){
                    ran = 0;
                    mov=true;
                }

                //?0?
                //?0?
                //oX?
                if((mov==false)&&(hh==4)&&(jkl==3)){
                    mov=true;
                    ran = Math.abs(Math.round(mii));
                }

                //  0X0
                //  ??X
                //  ??0
                if(mov==false){
                    if(test4(bb[0][1],bb[1][0],bb[0][0],bb[0][2],bb[2][0])===true){
                        mov=true;
                        ran = 0;
                    }
                }
                if(mov==false){
                    if(test4(bb[0][1],bb[1][2],bb[0][2],bb[0][0],bb[2][2])===true){
                        mov=true;
                        ran = 2;
                    }
                }
                if(mov==false){
                    if(test4(bb[2][1],bb[1][0],bb[2][0],bb[0][0],bb[2][2])===true){
                        mov=true;
                        ran = 6;
                    }
                }
                if(mov==false){
                    if(test4(bb[2][1],bb[1][2],bb[2][2],bb[0][2],bb[2][0])===true){
                        mov=true;
                        ran = 8;
                    }
                }
                //  X00
                //  ??0
                //  ??X
                if(mov==false){
                    if(test4(bb[2][0],bb[0][2],bb[1][0],bb[0][0],bb[0][1])===true){
                        mov=true;
                        ran = 1;
                    }
                }
                if(mov==false){
                    if(test4(bb[2][0],bb[0][2],bb[2][1],bb[2][2],bb[1][2])===true){
                        mov=true;
                        ran = 3;
                    }
                }
                if(mov==false){
                    if(test4(bb[0][0],bb[2][2],bb[0][1],bb[0][2],bb[1][2])===true){
                        mov=true;
                        ran =5;
                    }
                }
                if(mov==false){
                    if(test4(bb[0][0],bb[2][2],bb[1][0],bb[2][0],bb[2][1])===true){
                        mov=true;
                        ran = 7;
                    }
                }
                //  X00
                //  ??X
                //  ??0
                if(mov==false){
                    if(test4(bb[0][0],bb[2][1],bb[2][0],bb[2][2],bb[1][0])===true){
                        mov=true;
                        if(moo===true) ran=3;
                        else ran=8;
                    }
                }
                if(mov==false){
                    if(test4(bb[0][2],bb[2][1],bb[2][0],bb[2][2],bb[1][2])===true){
                        mov=true;
                        if(moo===true) ran=5;
                        else ran=6;
                    }
                }

                if(mov==false){
                    if(test4(bb[0][2],bb[1][0],bb[0][0],bb[2][0],bb[0][1])===true){
                        mov=true;
                        if(moo===true) ran=1;
                        else ran=6;
                    }
                }
                if(mov==false){
                    if(test4(bb[2][2],bb[1][0],bb[0][0],bb[2][0],bb[2][1])===true){
                        mov=true;
                        if(moo===true) ran=7;
                        else ran=0;
                    }
                }

                if(mov==false){
                    if(test4(bb[2][0],bb[0][1],bb[0][0],bb[0][2],bb[1][0])===true){
                        mov=true;
                        if(moo===true) ran=3;
                        else ran=2;
                    }
                }if(mov==false){
                    if(test4(bb[2][2],bb[0][1],bb[0][0],bb[0][2],bb[1][2])===true){
                        mov=true;
                        if(moo===true) ran=5;
                        else ran=0;
                    }
                }

                if(mov==false){
                    if(test4(bb[0][0],bb[1][2],bb[0][2],bb[2][2],bb[0][1])===true){
                        mov=true;
                        if(moo===true) ran=1;
                        else ran=8;
                    }
                }if(mov==false){
                    if(test4(bb[2][0],bb[1][2],bb[0][2],bb[2][2],bb[2][1])===true){
                        mov=true;
                        if(moo===true) ran=7;
                        else ran=2;
                    }
                }
                //X?X
                //?00
                //??0
                if(mov == false) {
                   if (test4(bb[0][0], bb[0][2], bb[1][1], bb[1][2], bb[2][2]) === true) {
                        mov = true;
                        ran = 8;
                    }
                }
                if(mov == false) {
                   if (test4(bb[1][2], bb[0][0], bb[1][1], bb[0][1], bb[0][2]) === true) {
                        mov = true;
                        ran = 2;
                    }
                }
                if(mov == false) {
                   if (test4(bb[2][0], bb[2][2], bb[1][1], bb[1][0], bb[0][0]) === true) {
                        mov = true;
                        ran = 0;
                    }
                }
                if(mov == false) {
                   if (test4(bb[0][2], bb[2][2], bb[1][1], bb[2][1], bb[2][0]) === true) {
                        mov = true;
                        ran = 6;
                    }
                }

                if(mov == false) {
                   if (test4(bb[0][0], bb[0][2], bb[1][1], bb[1][0], bb[2][0]) === true) {
                        mov = true;
                        ran = 6;
                    }
                }
                if(mov == false) {
                   if (test4(bb[1][2], bb[0][0], bb[1][1], bb[2][1], bb[2][2]) === true) {
                        mov = true;
                        ran = 8;
                    }
                }
                if(mov == false) {
                   if (test4(bb[2][0], bb[2][2], bb[1][1], bb[1][2], bb[0][2]) === true) {
                        mov = true;
                        ran = 2;
                    }
                }
                if(mov == false) {
                   if (test4(bb[0][2], bb[2][2], bb[1][1], bb[0][1], bb[0][0]) === true) {
                        mov = true;
                        ran = 0;
                    }
                }
            }


            if(mov===false) {
                do{ran = Math.floor(Math.random() * (9));}
                while(aa[ran]!==false);
                //do{ran =  Math.abs(Math.round(prompt()))-1;}
                //while(aa[ran]!==false);
                mov=true;
            }

        }
        if(mov===true){
            zug(ran);
            write(ran,2);
            //alert(bb);
        }


    }


    function write(hh,inp){
        switch (hh){
            case 0:bb[0][0]=inp;break;
            case 1:bb[0][1]=inp;break;
            case 2:bb[0][2]=inp;break;
            case 3:bb[1][0]=inp;break;
            case 4:bb[1][1]=inp;break;
            case 5:bb[1][2]=inp;break;
            case 6:bb[2][0]=inp;break;
            case 7:bb[2][1]=inp;break;
            case 8:bb[2][2]=inp;break;
            default:break;
        }
    }



    function test(a,b,c){
        if((a===undefined)||(b===undefined)||(c===undefined)){
            if((a==b)&&(a==c)){
                return false;
            }
            else if((a==b)||(a==c)||(b==c)){
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function test2(a,b,c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a==1)||(b==1)||(c==1)){
            if((a==1)&&(b==1)&&(isNaN(c)))return 2;
            else if((a==1)&&(c==1)&&(isNaN(b)))return 1;
            else if((c==1)&&(b==1)&&(isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    function test3(a,b,c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a==2)||(b==2)||(c==2)){
            if((a==2)&&(b==2)&&(isNaN(c)))return 2;
            else if((a==2)&&(c==2)&&(isNaN(b)))return 1;
            else if((c==2)&&(b==2)&&(isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    function test4(a,b,c,d,e){
        if((a==1)&&(b==1)&&(c===undefined)&&(d===undefined)&&(e===undefined)) return true;
        else return false;


    }*/
var experimentloc = 'var awe,jj=!0,jkl=0,p1=0,p2=0;aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];var tem,durch="1";function los(e){!1===aa[e]&&jkl<6?(jj?(document.getElementById("a"+e).innerHTML="O",document.getElementById("turn").innerHTML="Turn: X",aa[e]="2"):(document.getElementById("a"+e).innerHTML="X",document.getElementById("turn").innerHTML="Turn: O",aa[e]="1"),jj=!jj,win(),jkl++):jkl>=6&&("1"==durch&&!1!==aa[e]?jj||"1"!=aa[e]?jj&&"2"==aa[e]&&(document.getElementById("a"+e).style.color="red",tem=e,durch="2"):(document.getElementById("a"+e).style.color="red",tem=e,durch="2"):"2"==durch&&e==tem?(document.getElementById("a"+tem).removeAttribute("style"),durch="1"):"2"==durch&&!1===aa[e]?(jj?(document.getElementById("a"+e).innerHTML="O",document.getElementById("a"+tem).innerHTML=" ",document.getElementById("turn").innerHTML="Turn: X",document.getElementById("a"+tem).removeAttribute("style"),aa[e]="2",aa[tem]=!1):(document.getElementById("a"+e).innerHTML="X",document.getElementById("a"+tem).innerHTML=" ",document.getElementById("turn").innerHTML="Turn: O",document.getElementById("a"+tem).removeAttribute("style"),aa[e]="1",aa[tem]=!1),jj=!jj,win(),durch="1"):"2"==durch&&!1!==aa[e]&&(jj||"1"!=aa[e]?jj&&"2"==aa[e]&&(document.getElementById("a"+e).style.color="red",document.getElementById("a"+tem).removeAttribute("style"),tem=e):(document.getElementById("a"+e).style.color="red",document.getElementById("a"+tem).removeAttribute("style"),tem=e)))}function win(){for(var e=1;e<=2;e++){1==e&&(awe="1"),2==e&&(awe="2");for(var t=0;t<9;t+=3)if(aa[t]==aa[t+1]&&aa[t+1]==aa[t+2]&&aa[t+2]==awe)return void winner(awe);for(var a=0;a<=3;a++)if(aa[a]==aa[a+3]&&aa[a+3]==aa[a+6]&&aa[a+6]==awe)return void winner(awe);if(aa[0]==aa[4]&&aa[4]==aa[8]&&aa[8]==awe)return void winner(awe);if(aa[2]==aa[4]&&aa[4]==aa[6]&&aa[6]==awe)return void winner(awe)}}function rese(){aa=[3,3,3,3,3,3,3,3,3],document.getElementById("reset").style="visibility:visible"}function rematch(){aa=[!1,!1,!1,!1,!1,!1,!1,!1,!1];for(var e=0;e<9;e++)document.getElementById("a"+e).innerHTML="";jkl=0,document.getElementById("reset").style="visibility:hidden",jj=!0,awe=void 0,tem=void 0,durch="1"}function winner(e){1==e?(p1++,aler("Winner: X")):2==e&&(p2++,aler("Winner: O")),rese(),document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2}';
/*  var jj=true;
    var awe,jkl=0;
    var p1=0,p2=0; aa=[false,false,false,false,false,false,false,false,false];
    var tem,durch="1";

    function los(hh) {
        if((aa[hh]===false)&&(jkl<6))
        {
            if(!jj)
            {
                document.getElementById("a"+hh).innerHTML="X";
                document.getElementById("turn").innerHTML="Turn: O";
                aa[hh]="1";

            }
            else
            {
                 document.getElementById("a"+hh).innerHTML="O";
                 document.getElementById("turn").innerHTML="Turn: X";
                 aa[hh]="2";
            }
            jj=!jj;
            win();

            jkl++;

        }
        else if((jkl>=6)){
            if((durch=="1")&&(aa[hh]!==false)){
                if((!jj)&&(aa[hh]=="1")){
                    document.getElementById("a"+hh).style.color="red";
                    tem=hh;
                    durch="2";
                }
                else if((jj)&&(aa[hh]=="2")){
                    document.getElementById("a"+hh).style.color="red";
                    tem=hh;
                    durch="2";
                }
            }
            else if((durch=="2")&&(hh==tem)){
                document.getElementById("a"+tem).removeAttribute("style");
                durch="1";
            }
            else if((durch=="2")&&(aa[hh]===false)){
                if(!jj){

                    document.getElementById("a"+hh).innerHTML="X";
                    document.getElementById("a"+tem).innerHTML=" ";
                    document.getElementById("turn").innerHTML="Turn: O";
                    document.getElementById("a"+tem).removeAttribute("style");
                    aa[hh]="1";
                    aa[tem]=false;

                }
                else
                {
                     document.getElementById("a"+hh).innerHTML="O";
                     document.getElementById("a"+tem).innerHTML=" ";
                     document.getElementById("turn").innerHTML="Turn: X";
                     document.getElementById("a"+tem).removeAttribute("style");
                     aa[hh]="2";
                     aa[tem]=false;
                }
                jj=!jj;
                win();

                durch="1";

            }
            else if((durch=="2")&&((aa[hh]!==false))){
                if((!jj)&&(aa[hh]=="1")){
                    document.getElementById("a"+hh).style.color="red";
                    document.getElementById("a"+tem).removeAttribute("style");
                    tem=hh;
                }
                else if((jj)&&(aa[hh]=="2")){
                    document.getElementById("a"+hh).style.color="red";
                    document.getElementById("a"+tem).removeAttribute("style");
                    tem=hh;
                }
            }
        }
    }

    function win(){
        for(var hhh=1;hhh<=2;hhh++)
            {
            if(hhh==1)
            {
                awe="1";
            }
            if(hhh==2)
            {
                awe="2";
            }

            for(var fo=0;fo<9;fo=fo+3)
            {
                if((aa[fo]==aa[fo+1])&&(aa[fo+1]==aa[fo+2])&&(aa[fo+2]==awe))
                {
                    winner(awe);
                    return;
                }
            }
            for(var fa=0;fa<=3;fa++)
            {
                if((aa[fa]==aa[fa+3])&&(aa[fa+3]==aa[fa+6])&&(aa[fa+6]==awe))
                {
                    winner(awe);
                    return;
                }
            }

            if((aa[0]==aa[4])&&(aa[4]==aa[8])&&(aa[8]==awe))
            {
                 winner(awe);
                 return;
            }
            if((aa[2]==aa[4])&&(aa[4]==aa[6])&&(aa[6]==awe))
            {
                 winner(awe);
                 return;
            }
        }
    }

     function rese(){
         aa=[3,3,3,3,3,3,3,3,3];
         document.getElementById("reset").style="visibility:visible";
    }


     function rematch(){
         aa=[false,false,false,false,false,false,false,false,false];
         for(var www = 0;www<9;www++){
         document.getElementById("a"+www).innerHTML="";}
         jkl=0;
         document.getElementById("reset").style="visibility:hidden";


        jj=true;
        awe = undefined;
        tem = undefined;
        durch="1";
     }

     function winner(ji){
         if(ji==1){
             p1++;
             aler("Winner: X");
         }
         else if(ji==2){
             p2++;
             aler("Winner: O");
         }
         rese();
         document.getElementById("score").innerHTML="X: "+p1+" vs. O: "+p2;
     }*/
var tut1, modus = 0;
var erro = false;

//funktionen von online ohne socket berechtigung und mit " und ' weshalb Problem beim String umwandelen!

function unread(ff){
    if(ff==0){
        var yourscripttag = document.getElementById("chatt");
        yourscripttag.remove();
        var newscript = document.createElement("style");
        newscript.type = "text/css";
        newscript.id = "chatt";
        newscript.appendChild(document.createTextNode("#cha::after{display:none;content:'0'}"));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }
    else if(ff>9){
        var yourscripttag = document.getElementById('chatt');
        yourscripttag.remove();
        var newscript = document.createElement('style');
        newscript.type = 'text/css';
        newscript.id = 'chatt';
        newscript.appendChild(document.createTextNode("#cha::after{display:block;content:'9+'}"));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }
    else if(ff>0){
        var yourscripttag = document.getElementById('chatt');
        yourscripttag.remove();
        var newscript = document.createElement('style');
        newscript.type = 'text/css';
        newscript.id = 'chatt';
        newscript.appendChild(document.createTextNode("#cha::after{display:block;content:'" + ff + "'}"));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }
}

function typingin(ff){
    var yourscripttag = document.getElementById("typingg");
    yourscripttag.remove();
    var newscript = document.createElement("style");
    newscript.type = "text/css";
    newscript.id = "typingg";
    if(ff){
        newscript.appendChild(document.createTextNode("#chat-content:after{display:block}"));
    }
    else{
        newscript.appendChild(document.createTextNode("#chat-content:after{display:none}"));
    }
    document.getElementsByTagName('head').item(0).appendChild(newscript);
}

function chatwrite(wer,was){
    if(wer=="system"){
        text = "<center><p style='font-style: italic;'>" + was + "</p></center>";
    }
    else if(wer=="me"){
        text = "<p style='text-align: end;'>" + was + "</p>";
    }
    else if(wer=="other"){
        text = "<p>" + was + "</p>";
        nachrichtplus(1);
    }
    document.getElementById("chat-content").innerHTML = document.getElementById("chat-content").innerHTML + text;
}

function htmlSpecialChars(hh) {
    const specialChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'}
    hh = hh.replace(/[&<>"#]/g, find => specialChars [find]);
    return hh;
}

async function chatwarning(){
    erro = true;
    aler("Der Chat besitzt keinerlei Worfilter!<br>Die Webseite hat nichts mit den Inhalten welche Übermittelt werden zu tun und  übernimmt keinerlei Haftung für jegliche von dritter Übermittelte Inhalte!<br><div  align='left' style='float:left;'><button onclick='chatok();'>Okay verstanden</button></div><div  align='right' style='margin-bottom: -18px;'><button onclick='erro=false;sp()'>Kein Interesse</button></div>", "hid");
}

async function chatok(){
    erro = false;
    sp();
    nofillter = true;
    localStorage.setItem('nofillter', true);
    chat.style.display = 'block';
    await sleep(100);
    document.getElementsByClassName('chat-window')[0].classList.add('movechat');
    document.getElementById('chatmodal').classList.add('chatopa');
    unread(0);
    unrea = 0;
    inopenchat = true;
}

function nochnichtgespielt(){
    //document.getElementById("tut1").style.display="block";
    aler("Sieht so aus als würdest du das erste mal diesen Modus spielen. <br>Willst du ein Tutorial?<br><div  align='left' style='float:left;'><button onclick='ja(), tut1fals()'>Ja</button></div><div  align='right' style='margin-bottom: -18px;'><button onclick='nein(), tut1fals()'>Nein</button></div>", "hid");
}

//Ende Extrawurtst Funktionen.

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reloadSript(scriptt) {
    var yourscripttag = document.getElementById('yourscripttagID');
    yourscripttag.remove();
    var newscript = document.createElement('script');
    newscript.type = 'text/javascript';
    newscript.id = 'yourscripttagID';
    newscript.appendChild(document.createTextNode(scriptt));
    document.getElementsByTagName('head').item(0).appendChild(newscript);
}

function show(contain){
    document.getElementById("div0").style = "display:none !important";
    document.getElementById("div1").style = "display:none !important";
    document.getElementById("div2").style = "display:none !important";
    document.getElementById("singel").style = "display:none !important";
    document.getElementById("multiplayer").style = "display:none !important";
    document.getElementById("experimental-area").style = "display:none !important";
    document.getElementById(contain).style = "display:block !important";
}

function on() {
    resett();
    reloadSript(online);
    show("multiplayer");
    document.getElementById("the").classList.add("ingame");
    document.getElementById("help").style.display = "none";
    modus = 1;
}

function off() {
    resett();
    reloadSript(offline);
    show("div1");
    document.getElementById("the").classList.add("ingame");
    document.getElementById("help").style.display = "block";
    modus = 1;
}

async function back() {
    fadebutton(true);
    await sleep(animationspeed);
    reloadSript("");
    show("div0");
    document.getElementById("the").classList.remove("ingame");
    document.getElementById("help").style.display = "none";
    modus = 0;
    await sleep(100);
    fadebutton(false);
}

function sing() {
    show("singel");
    document.getElementById("the").classList.add("ingame");
    modus = 0;
}

function ein() {
    resett();
    reloadSript(easy);
    show("div1");
    document.getElementById("the").classList.add("ingame");
    document.getElementById("help").style.display = "block";
    modus = 1;
}

function mit() {
    resett();
    reloadSript(mittel);
    show("div1");
    document.getElementById("the").classList.add("ingame");
    document.getElementById("help").style.display = "block";
    modus = 1;
}

function schw() {
    resett();
    reloadSript(schwer);
    show("div1");
    document.getElementById("the").classList.add("ingame");
    document.getElementById("help").style.display = "block";
    modus = 1;
}


function experloc() {
    resett();
    reloadSript(experimentloc);
    show("div1");
    document.getElementById("the").classList.add("ingame");
    modus = 2;
    if(tut1 != "false") {
        //document.getElementById("tut1").style.display="block";
        aler("Sieht so aus als würdest du das erste mal diesen Modus spielen. <br>Willst du ein Tutorial?<br><div  align='left' style='float:left;'><button onclick='ja(), tut1fals()'>Ja</button></div><div  align='right' style='margin-bottom: -18px;'><button onclick='nein(), tut1fals()'>Nein</button></div>", "hid");
    } else {
        document.getElementById("help").style.display = "block";
    }
}

function expermp() {
    resett();
    reloadSript(experimentmp);
    show("multiplayer");
    document.getElementById("the").classList.add("ingame");
    modus = 2;
    document.getElementById("help").style.display = "none";
}

function experarea() {
    show("experimental-area");
    document.getElementById("the").classList.add("ingame");
    modus = 0;
}

function nein() {
    sp();
    document.getElementById("help").style.display = "block";
}

function ja() {
    if(modus == 1) {
        aler("<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style='color:#50ff1e'>X</span> und <span style='color:#50ff1e'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diargonalen zu haben.<br><br><div  align='left' style='float:left;'><button onclick='sp()'>Ok</button></div><div  align='right' style='margin-bottom: -18px;'><button onclick='animat1()'>Animation</button></div>", "hid");
    } else if(modus == 2) {
        aler("<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style='color:#50ff1e'>X</span> und <span style='color:#50ff1e'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diargonalen zu haben.<br>Der Unterschied zum normalen Spiel besteht jedoch darin, dass jeder nur 3 Zeichen besitzt.<br>Wenn alle gesetzt worden sind, werden die Zeichen auf den Feldern solange versetzt, bis einer Gewonnen hat.<br><br><div  align='left' style='float:left;'><button onclick='sp()'>Ok</button></div><div  align='right' style='margin-bottom: -18px;'><button onclick='animat2()'>Animation</button></div>", "hid");
    }
}

function tut1fals() {
    localStorage.setItem("tut1", "false");
    tut1 = "false";
}
async function animat1() {
    var bac = document.getElementsByClassName("back");
    for(var i = 0; i < 4; i++) bac[i].style.display = "none";
    document.getElementById("help").style.display = "none";
    for(var www = 0; www < 9; www++) document.getElementById("a" + www).innerHTML = "";
    sp();
    await sleep(500);
    document.getElementById("a0").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a4").innerHTML = "O";
    await sleep(1000);
    document.getElementById("a8").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a2").innerHTML = "O";
    await sleep(1000);
    document.getElementById("a6").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a7").innerHTML = "O";
    await sleep(1000);
    document.getElementById("a3").innerHTML = "X";
    await sleep(500);
    document.getElementById("a0").innerHTML = "";
    document.getElementById("a3").innerHTML = "";
    document.getElementById("a6").innerHTML = "";
    await sleep(500);
    document.getElementById("a0").innerHTML = "X";
    document.getElementById("a3").innerHTML = "X";
    document.getElementById("a6").innerHTML = "X";
    await sleep(500);
    document.getElementById("a0").innerHTML = "";
    document.getElementById("a3").innerHTML = "";
    document.getElementById("a6").innerHTML = "";
    await sleep(500);
    document.getElementById("a0").innerHTML = "X";
    document.getElementById("a3").innerHTML = "X";
    document.getElementById("a6").innerHTML = "X";
    await sleep(500);
    for(var www = 0; www < 9; www++) {
        if(aa[www] == "1") document.getElementById("a" + www).innerHTML = "X";
        else if(aa[www] == "2") document.getElementById("a" + www).innerHTML = "O";
        else document.getElementById("a" + www).innerHTML = "";
    }
    document.getElementById("help").style.display = "block";
    for(i = 0; i < 4; i++) bac[i].removeAttribute("style");
    ja();
}
async function animat2() {
    var bac = document.getElementsByClassName("back");
    for(var i = 0; i < 4; i++) bac[i].style.display = "none";
    document.getElementById("help").style.display = "none";
    for(var www = 0; www < 9; www++) document.getElementById("a" + www).innerHTML = "";
    sp();
    await sleep(500);
    document.getElementById("a0").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a4").innerHTML = "O";
    await sleep(1000);
    document.getElementById("a8").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a2").innerHTML = "O";
    await sleep(1000);
    document.getElementById("a6").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a7").innerHTML = "O";
    await sleep(1000);
    document.getElementById("a8").style.color = "red";
    await sleep(1000);
    document.getElementById("a8").innerHTML = "";
    document.getElementById("a8").removeAttribute("style");
    document.getElementById("a5").innerHTML = "X";
    await sleep(1000);
    document.getElementById("a2").style.color = "red";
    await sleep(1000);
    document.getElementById("a2").innerHTML = "";
    document.getElementById("a2").removeAttribute("style");
    document.getElementById("a1").innerHTML = "O";
    await sleep(500);
    document.getElementById("a1").innerHTML = "";
    document.getElementById("a4").innerHTML = "";
    document.getElementById("a7").innerHTML = "";
    await sleep(500);
    document.getElementById("a1").innerHTML = "O";
    document.getElementById("a4").innerHTML = "O";
    document.getElementById("a7").innerHTML = "O";
    await sleep(500);
    document.getElementById("a1").innerHTML = "";
    document.getElementById("a4").innerHTML = "";
    document.getElementById("a7").innerHTML = "";
    await sleep(500);
    document.getElementById("a1").innerHTML = "O";
    document.getElementById("a4").innerHTML = "O";
    document.getElementById("a7").innerHTML = "O";
    await sleep(500);
    for(var www = 0; www < 9; www++) {
        if(aa[www] == "1") document.getElementById("a" + www).innerHTML = "X";
        else if(aa[www] == "2") document.getElementById("a" + www).innerHTML = "O";
        else document.getElementById("a" + www).innerHTML = "";
    }
    document.getElementById("help").style.display = "block";
    for(i = 0; i < 4; i++) bac[i].removeAttribute("style");
    ja();
}
async function help() {
    document.getElementById("help").style.display = "none";
    aler("<b>Hilfe</b><br><br>Willst du ein Tutorial zu diesem Spielmodus?<br><br><div  align='left' style='float:left;'><button onclick='ja()'>Ja</button></div><div  align='right' style='margin-bottom: -18px;'><button onclick='sp()'>Nein</button></div>", "hid");
}

async function sp() {
    if(erro === false)
        modal.style.display = "none";
    document.getElementById("help").style.display = "block";
}
window.onclick = function(event) {
    if(event.target == modal) {
        sp();
    }
    else if(event.target == chat) {
        closechat();
    }
    else if(event.target == patch){
        closepatch();
    }
}

function aler(al, ex) {
    document.getElementById("mote").innerHTML = al;
    modal.style.display = "block";
    if(ex == "hid") {
        document.getElementsByClassName("close")[0].style.display = "none";
    } else {
        document.getElementsByClassName("close")[0].style.display = "block";
    }
}

function resett() {
    aa = [false, false, false, false, false, false, false, false, false];
    for(var www = 0; www < 9; www++) {
        document.getElementById("a" + www).innerHTML = "";
    }
    document.getElementById("reset").style = "visibility:hidden";
    document.getElementById("score").innerHTML = "X: 0 vs. O: 0";
}
var them = "l";

function theme() {
    if(them == "l") {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        them = "d";
        localStorage.setItem("themec", "dark");
    } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        them = "l";
        localStorage.setItem("themec", "light");
    }
}

function err() { //<meta http-equiv="refresh" content="5; URL=http://meine zieladresse">
    erro = true;
    var newmeta = document.createElement('meta');
    newmeta.httpEquiv = 'refresh';
    newmeta.content = "5; URL=https://karlsgymnasium.ddns.net:2001";
    document.getElementsByTagName('head').item(0).appendChild(newmeta);
}

async function fadebutton(tt){
    let ff;
    if(tt){
        document.getElementsByClassName("slide")[0].disabled = true;
        ff = document.getElementsByClassName("mvr");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add("links");
        }
        ff = document.getElementsByClassName("mvl");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add("recht");
        }
        ff = document.getElementsByClassName("chopa");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add("hexhex");
        }
        ff = document.getElementsByClassName("groser");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add("kein");
        }
    }
    else if(!tt){
        ff = document.getElementsByClassName("mvr");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove("links");
        }
        ff = document.getElementsByClassName("mvl");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove("recht");
        }
        ff = document.getElementsByClassName("chopa");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove("hexhex");
        }
        ff = document.getElementsByClassName("groser");
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove("kein");
        }
        await sleep(animationspeed);
        document.getElementsByClassName("slide")[0].disabled = false;
    }
}

function changeanimationspeed(ff){
    ff /= 2;
    animationspeed = ff;
    localStorage.setItem("animationspeed",ff);
    document.documentElement.style.setProperty("--animationspeed", ff+"ms");
    ff = (ff*2)/3;
    document.documentElement.style.setProperty("--animationspeed2", ff+"ms");

}

async function closepatch(){
    document.getElementsByClassName("patch-window")[0].classList.remove("movechat");
    patch.classList.remove("chatopa");
    await sleep(animationspeed);
    patch.style.display = "none";
}

async function pat(){
    patch.style.display = "block";
    await sleep(100);
    document.getElementsByClassName("patch-window")[0].classList.add("movechat");
    patch.classList.add("chatopa");
    var yourscripttag = document.getElementById("patchh");
    yourscripttag.remove();
    var newscript = document.createElement("style");
    newscript.type = "text/css";
    newscript.id = "patchh";
    newscript.appendChild(document.createTextNode("#note::after{display:none}"));
    document.getElementsByTagName('head').item(0).appendChild(newscript);
    localStorage.setItem("patchversion", document.getElementById("version").innerHTML)
}