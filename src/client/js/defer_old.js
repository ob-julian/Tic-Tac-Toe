

let animationspeed, intervall;
//const host = 'https://oberhofer.ddns.net:3000';
const host = 'localhost:3000';

// helpe functions for extrcting the script from the functions
function extractFunctionBody(func) {
    if (typeof func === 'function') {
        // Extract the function body using a regular expression
        const functionBody = func.toString().match(/(?<=\{)([\s\S]*)(?=\})/).map((s) => s.replace(/\r?\n/g, ''));

        // Return the function body
        return functionBody ? functionBody[0].trim() : 'Function body not found';
    } else {
        return 'Not a function';
    }
}

function onlineFunction() {
    const socket = io(host);
    let youAreP, enemyAre;
    let remake = false;
    let onlinem = false;
    let n, o = 0;
    let aa = [false, false, false, false, false, false, false, false, false];
    let opponent;
    let publicKey;
    let privateKey;

    function los(hh){
        socket.emit('turn', hh);
    }

    function rematch(){
        if(remake === false) {
            socket.emit('rematch');
            document.getElementById('reset').disabled = true;
        }

        else if(remake === true) socket.emit('rematchakkept');
    }

    function reset(){
        socket.emit('resee');
        for(let www = 0;www < 9;www++){
            document.getElementById('a' + www).innerHTML = '';
        }
        document.getElementById('reset').style = 'visibility:hidden';
        aa = [false, false, false, false, false, false, false, false, false];
    };


    async function neu(){
        fadebutton(true);
        await sleep(animationspeed);
        onlinem = true;
        const b = document.getElementById('inpu').value;
        socket.emit('conn', b, 1);
        localStorage.setItem('nameOnline', b);
    };

    socket.on('que', async function(data, player, enem, name){
        if(data == 1){
            if (!('Notification' in window)){}
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission){});
            }
            document.getElementById('help').style.display = 'none';
            closechat();
            document.getElementById('chat-content').innerHTML = '<center><b>Du solltest noch nicht hier sein!</b></center>';
            typing(false);
            fadebutton(true);
            await sleep(animationspeed);
            document.getElementById('div0').style = 'display:none';
            document.getElementById('div1').style = 'display:none';
            document.getElementById('div2').style = 'display:block';
            document.getElementById('multiplayer').style = 'display:none';
            await sleep(100);
            fadebutton(false);
        }
        else if(data == 2){
            youAreP = player;
            opponent = name;
            enemyAre = enem;
            fadebutton(true);
            document.getElementById('youAre').innerHTML = 'You are ' + player;
            await sleep(animationspeed);
            document.getElementById('div0').style = 'display:none';
            document.getElementById('div1').style = 'display:block';
            document.getElementById('div2').style = 'display:none';
            document.getElementById('multiplayer').style = 'display:none';
            try{
                if (!('Notification' in window)){}
                else if(Notification.permission === 'granted') {
                    const notification = new Notification('Gegner ' + name + ' will gegen dich spielen');
                }
            }
            catch(err){}
            document.getElementById('score').innerHTML = youAreP + ': 0 vs. ' + enemyAre + ': 0';
            showAlert('Gegner: ' + name);
            document.getElementById('help').style.display = 'block';
            document.getElementById('chat').style.display = 'block';
            //encryption setup
            const keyPair = await generateKeyPair();
            try {
                privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
                const pk = await crypto.subtle.exportKey('spki', keyPair.publicKey);
                socket.emit('publicKey', pk);
            }
            catch (e){
                console.log(e);
            }
            await sleep(100);
            fadebutton(false);
        }
    });

    socket.on('turned', function(player, enemy, pos){
        document.getElementById('a' + pos).innerHTML = player;
        document.getElementById('turn').innerHTML = 'Turn: ' + enemy;
        if(player == 'X') aa[pos] = '1';
        if(player == 'O') aa[pos] = '2';
    });

    socket.on('win', function(winer, punkteSelf, punkteEnemy, winner){
        if(winer == youAreP){
            document.getElementById('score').innerHTML = youAreP + ': ' + punkteSelf + ' vs. ' + enemyAre + ': ' + punkteEnemy;
            showAlert('Du hast gewonnen');
            chatwrite('system', 'Du hast gewonnen');
        }
        else{
            document.getElementById('score').innerHTML = youAreP + ': ' + punkteEnemy + ' vs. ' + enemyAre + ': ' + punkteSelf;
            showAlert('Du hast verloren');
            chatwrite('system', 'Du hast verloren');
        }
    });

    socket.on('rese', function(){
        document.getElementById('reset').style = 'visibility:visible';
    });

    socket.on('rematchask', function(){
        document.getElementById('reset').innerHTML = 'Accept Rematch';
        remake = true;
    });

    socket.on('resett', function(){
        document.getElementById('reset').innerHTML = 'Rematch';
        remake = false;
        document.getElementById('reset').disabled = false;
        reset();
    });

    socket.on('turnreset', function(){
        document.getElementById('turn').innerHTML = 'Turn: O';
    });


    document.onkeydown = function(event){
        if(event.keyCode === 13){
            if(onlinem == false){
                neu();
            }
            else if(inchat){
                sen();
            }
        }
    };

    function dis(){
        socket.emit('dis');
        document.getElementById('pin').style.display = 'none';
        document.getElementById('help').style.display = 'none';
        document.getElementById('chat').style.display = 'none';
        clearInterval(intervall);
    }

    socket.on('erro', function(){showAlert('Error:<br>Bitte starte dein Spiel neu', false);err();});

    function ping1(){
        console.log('ping1');
        const d = new Date();
        n = d.getTime();
        socket.emit('ping1');
    }

    socket.on('ping2', function(){
        const d = new Date();
        const m = d.getTime();

        const p = ((m - n) - o) / 10;
        for(let i = 0;i < 10;i++){
            setTimeout(function(){lo(p);}, i * 99);
        }

    });

    intervall = setInterval(ping1, 1000);

    function lo(a){
        document.getElementById('ping').innerHTML = Math.round(o + a);
        o += a;
    }

    document.getElementById('pin').style.display = 'block';

    let serverId;

    socket.on('serverRestart', async function(server){
        if((serverId != server) && (serverId != undefined)){
            showAlert('Bitte starte dein Spiel neu.<br>Es gab einen Server Neustart', false);err();

        }
        else{serverId = server;}
    });

    function typing(ff){
        if(ff){
            document.getElementById('cha').classList.remove('fa-comment');
            document.getElementById('cha').classList.add('fa-comment-dots');
        }
        else{
            document.getElementById('cha').classList.remove('fa-comment-dots');
            document.getElementById('cha').classList.add('fa-comment');
        }
        typingin(ff);
    }

    var inchat = false, inopenchat = false, unrea = 0;

    async function chating(){
        if(nofillter){
            chat.style.display = 'block';
            await sleep(100);
            document.getElementsByClassName('chat-window')[0].classList.add('movechat');
            document.getElementById('chatmodal').classList.add('chatopa');
            unread(0);
            unrea = 0;
            inopenchat = true;
        }
        else{
            chatwarning();
        }
    }

    async function closechat(){
        document.getElementsByClassName('chat-window')[0].classList.remove('movechat');
        document.getElementById('chatmodal').classList.remove('chatopa');
        inchat = false;
        inopenchat = false;
        await sleep(animationspeed);
        chat.style.display = 'none';
    }

    async function sen() {
        let message = document.getElementById('chatinputbox').value;
        message = message.trim();
        if (message !== '') {
            message = htmlEscapeSpecialChars(message);
            if (publicKey == null || publicKey === '')
                showAlert('Encryption not set up properly. Chat disabled.');
            else
                try {
                    const msg = await encrypt(message, publicKey);
                    socket.emit('sendMessage', msg);
                    chatwrite('me', message);
                } catch (err) {
                    showAlert('Encryption failed. Disabling Chat.');
                }
        }
        document.getElementById('chatinputbox').value = '';
    }

    function nachrichtplus(ff){
        if(!inopenchat){
            unrea += ff;
            unread(unrea);
        }
    }

    function foc(){
        socket.emit('foc1');
        inchat = true;
    }
    socket.on('foc2', function(){
        typing(true);
    });

    function blu(){
        socket.emit('blu1');
        inchat = false;
    }
    socket.on('blu2', function(){
        typing(false);
    });

    socket.on('startChat', function(){
        document.getElementById('chat-content').innerHTML = '';
        chatwrite('system', 'Dies ist der Anfang deines Chats mit ' + opponent);
    });

    socket.on('receiveMessage', async function (gg) {
        let msg;
        try {
            msg = await decrypt(gg, privateKey);
            chatwrite('other', msg);
        } catch (e) {
        }
    });

    //RSA stuff

    // Generate an RSA key pair
    async function generateKeyPair() {
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
    async function encrypt(message, publicKey) {
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
    async function decrypt(ciphertext, privateKey) {
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

    socket.on('getKey', function(key){
        publicKey = key;
    });
}
const normalMultiplyerScript = extractFunctionBody(onlineFunction);

function experimentMultiplayerFunction(){
    const socket = io(host);
    let youAreP, enemyAre;
    let remake = false;
    let onlinem = false;
    let n, o = 0;
    let aa = [false, false, false, false, false, false, false, false, false];
    let opponent;
    let publicKey;
    let privateKey;

    function los(hh){
        socket.emit('turn', hh);
    }

    function rematch(){
        if(remake === false) {
            socket.emit('rematch');
            document.getElementById('reset').disabled = true;
        }

        else if(remake === true) socket.emit('rematchakkept');
    }

    function reset(){
        socket.emit('resee');
        for(let www = 0;www < 9;www++){
            document.getElementById('a' + www).innerHTML = '';
        }
        document.getElementById('reset').style = 'visibility:hidden';
        aa = [false, false, false, false, false, false, false, false, false];
    };


    async function neu(){
        fadebutton(true);
        await sleep(animationspeed);
        onlinem = true;
        b = document.getElementById('inpu').value;
        socket.emit('conn', b, 2);
        localStorage.setItem('nameOnline', b);
    };

    socket.on('que', async function(data, player, enem, name){
        if(data == 1){
            if (!('Notification' in window)){}
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission){});
            }
            document.getElementById('help').style.display = 'none';
            closechat();
            document.getElementById('chat-content').innerHTML = '<center><b>Du solltest noch nicht hier sein!</b></center>';
            typing(false);
            fadebutton(true);
            await sleep(animationspeed);
            document.getElementById('div0').style = 'display:none';
            document.getElementById('div1').style = 'display:none';
            document.getElementById('div2').style = 'display:block';
            document.getElementById('multiplayer').style = 'display:none';
            await sleep(100);
            fadebutton(false);
        }
        else if(data == 2){
            youAreP = player;
            opponent = name;
            enemyAre = enem;
            fadebutton(true);
            document.getElementById('youAre').innerHTML = 'You are ' + player;
            await sleep(animationspeed);
            document.getElementById('div0').style = 'display:none';
            document.getElementById('div1').style = 'display:block';
            document.getElementById('div2').style = 'display:none';
            document.getElementById('multiplayer').style = 'display:none';
            try{
                if (!('Notification' in window)){}
                else if(Notification.permission === 'granted') {
                    const notification = new Notification('Gegner ' + name + ' will gegen dich spielen');
                }
            }
            catch(err){}
            document.getElementById('score').innerHTML = youAreP + ': 0 vs. ' + enemyAre + ': 0';
            showAlert('Gegner: ' + name);
            document.getElementById('help').style.display = 'block';
            document.getElementById('chat').style.display = 'block';
            //encryption setup
            const keyPair = await generateKeyPair();
            try {
                privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
                const pk = await crypto.subtle.exportKey('spki', keyPair.publicKey);
                socket.emit('publicKey', pk);
            }
            catch (e){}
            await sleep(100);
            fadebutton(false);
        }
    });

    socket.on('turned', function(player, enemy, pos, tem, fin){
        if(fin == 'move'){
            document.getElementById('a' + pos).innerHTML = player;
            document.getElementById('turn').innerHTML = 'Turn: ' + enemy;
            if(player == 'X') aa[pos] = '1';
            else if(player == 'O') aa[pos] = '2';
        }
        else if(fin == 'red'){
            document.getElementById('a' + pos).style.color = 'red';
        }
        else if(fin == 'rem'){
            document.getElementById('a' + tem).removeAttribute('style');
        }
        else if(fin == 'chan'){
            document.getElementById('a' + pos).style.color = 'red';
            document.getElementById('a' + tem).removeAttribute('style');
        }
        else if(fin == 'fin'){
            document.getElementById('a' + pos).innerHTML = player;
            document.getElementById('a' + tem).innerHTML = ' ';
            document.getElementById('a' + tem).removeAttribute('style');
            document.getElementById('turn').innerHTML = 'Turn: ' + enemy;
            if(player == 'X') aa[pos] = '1';
            else if(player == 'O') aa[pos] = '2';
            aa[tem] = false;
        }
    });

    socket.on('win', function(winer, punkteSelf, punkteEnemy, winner){
        if(winer == youAreP){
            document.getElementById('score').innerHTML = youAreP + ': ' + punkteSelf + ' vs. ' + enemyAre + ': ' + punkteEnemy;
            showAlert('Du hast gewonnen');
            chatwrite('system', 'Du hast gewonnen');
        }
        else{
            document.getElementById('score').innerHTML = youAreP + ': ' + punkteEnemy + ' vs. ' + enemyAre + ': ' + punkteSelf;
            showAlert('Du hast verloren');
            chatwrite('system', 'Du hast verloren');
        }
    });

    socket.on('rese', function(){
        document.getElementById('reset').style = 'visibility:visible';
    });

    socket.on('rematchask', function(){
        document.getElementById('reset').innerHTML = 'Accept Rematch';
        remake = true;
    });

    socket.on('resett', function(){
        document.getElementById('reset').innerHTML = 'Rematch';
        remake = false;
        document.getElementById('reset').disabled = false;
        reset();
    });

    socket.on('turnreset', function(){
        document.getElementById('turn').innerHTML = 'Turn: O';
    });


    document.onkeydown = function(event){
        if(event.keyCode === 13){
            if(onlinem == false){
                neu();
            }
            else if(inchat){
                sen();
            }
        }
    };

    function dis(){
        socket.emit('dis');
        document.getElementById('pin').style.display = 'none';
        document.getElementById('help').style.display = 'none';
        document.getElementById('chat').style.display = 'none';
        clearInterval(intervall);
    }

    socket.on('erro', function(){showAlert('Error:<br>Bitte starte dein Spiel neu', false);err();});

    function ping1(){
        const d = new Date();
        n = d.getTime();
        socket.emit('ping1');
    }

    socket.on('ping2', function(){
        const d = new Date();
        m = d.getTime();

        const p = ((m - n) - o) / 10;
        for(let i = 0;i < 10;i++){
            setTimeout(function(){lo(p);}, i * 99);
        }

    });

    intervall = setInterval(ping1, 1000);

    function lo(a){
        document.getElementById('ping').innerHTML = Math.round(o + a);
        o += a;
    }

    document.getElementById('pin').style.display = 'block';

    let serverId;

    socket.on('serverRestart', async function(server){
        if((serverId != server) && (serverId != undefined)){
            showAlert('Bitte starte dein Spiel neu.<br>Es gab einen Server Neustart', false);err();

        }
    else{serverId = server;}
    });



    function typing(ff){
        if(ff){
            document.getElementById('cha').classList.remove('fa-comment');
            document.getElementById('cha').classList.add('fa-comment-dots');
        }
        else{
            document.getElementById('cha').classList.remove('fa-comment-dots');
            document.getElementById('cha').classList.add('fa-comment');
        }
        typingin(ff);
    }

    var inchat = false, inopenchat = false, unrea = 0;

    async function chating(){
        if(nofillter){
            chat.style.display = 'block';
            await sleep(100);
            document.getElementsByClassName('chat-window')[0].classList.add('movechat');
            document.getElementById('chatmodal').classList.add('chatopa');
            unread(0);
            unrea = 0;
            inopenchat = true;
        }
        else{
            chatwarning();
        }
    }

    async function closechat(){
        document.getElementsByClassName('chat-window')[0].classList.remove('movechat');
        document.getElementById('chatmodal').classList.remove('chatopa');
        inchat = false;
        inopenchat = false;
        await sleep(animationspeed);
        chat.style.display = 'none';
    }

    async function sen() {
        let message = document.getElementById('chatinputbox').value;
        message = message.trim();
        if (message !== '') {
            message = htmlEscapeSpecialChars(message);
            if (publicKey == null || publicKey === '')
                showAlert('Encryption not set up properly. Chat disabled.');
            else
                try {
                    const msg = await encrypt(message, publicKey);
                    socket.emit('sendMessage', msg);
                    chatwrite('me', message);
                } catch (err) {
                    showAlert('Encryption failed. Disabling Chat.');
                }
        }
        document.getElementById('chatinputbox').value = '';
    }

    function nachrichtplus(ff){
        if(!inopenchat){
            unrea += ff;
            unread(unrea);
        }
    }

    function foc(){
        socket.emit('foc1');
        inchat = true;
    }
    socket.on('foc2', function(){
        typing(true);
    });

    function blu(){
        socket.emit('blu1');
        inchat = false;
    }
    socket.on('blu2', function(){
        typing(false);
    });

    socket.on('startChat', function(){
        document.getElementById('chat-content').innerHTML = '';
        chatwrite('system', 'Dies ist der Anfang deines Chats mit ' + opponent);
    });

    socket.on('receiveMessage', async function (gg) {
        let msg;
        try {
            msg = await decrypt(gg, privateKey);
            chatwrite('other', msg);
        } catch (e) {
        }
    });

    //RSA stuff

    // Generate an RSA key pair
    async function generateKeyPair() {
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
    async function encrypt(message, publicKey) {
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
    async function decrypt(ciphertext, privateKey) {
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

    socket.on('getKey', function(key){
        publicKey = key;
    });
}
const experimentMultiplayerScript = extractFunctionBody(experimentMultiplayerFunction);


function offlineFunction_broken(){
    let  hh, jj = true;
    let awe, jkl = 0;
    let p1 = 0, p2 = 0; aa = [false, false, false, false, false, false, false, false, false];
    function los(position){
        if((jj) && (aa[position] === false)){zug(position);
        if(win === false){bot();}}
    }

    function zug(hh)
    {
        if(aa[hh] === false)
        {
            if(!jj)
            {
                document.getElementById('a' + hh).innerHTML = 'X';
                document.getElementById('turn').innerHTML = 'Turn: O';
                aa[hh] = '1';

            }
            else
            {
                document.getElementById('a' + hh).innerHTML = 'O';
                document.getElementById('turn').innerHTML = 'Turn: X';
                aa[hh] = '2';
            }
            jj = !jj;

            for(let hhh = 1;hhh <= 2;hhh++)
            {
                if(hhh == 1)
                {
                    awe = '1';
                }
                if(hhh == 2)
                {
                    awe = '2';
                }

                for(let fo = 0;fo < 9;fo = fo + 3)
                {
                    if((aa[fo] == aa[fo + 1]) && (aa[fo + 1] == aa[fo + 2]) && (aa[fo + 2] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }
                for(let fa = 0;fa <= 3;fa++)
                {
                    if((aa[fa] == aa[fa + 3]) && (aa[fa + 3] == aa[fa + 6]) && (aa[fa + 6] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }

        if((aa[0] == aa[4]) && (aa[4] == aa[8]) && (aa[8] == awe))
                {
                    winner(awe);
                    return;
                }
                if((aa[2] == aa[4]) && (aa[4] == aa[6]) && (aa[6] == awe))
                {
                    winner(awe);
                    return;
                }
            }
            jkl++;
            if(jkl == 9)
            {
                rese();
            }
        }
    }

    function rese(){
        document.getElementById('reset').style = 'visibility:visible';
        jkl = 0;
        aa = [3, 3, 3, 3, 3, 3, 3, 3, 3];
        }


    function rematch(){
                aa = [false, false, false, false, false, false, false, false, false];
        for(let www = 0;www < 9;www++){
        document.getElementById('a' + www).innerHTML = '';}
        document.getElementById('reset').style = 'visibility:hidden';
    }

    function winner(ji){
        if(ji == 1){
            p1++;
            showAlert('Winner: X');
        }
        else if(ji == 2){
            p2++;
            showAlert('Winner: O');
        }
        rese();
        document.getElementById('score').innerHTML = 'X: ' + p1 + ' vs. O: ' + p2;
    }
}

function offlineFunction(){
    let hh, awe, jj = !0,
    jkl = 0,
    p1 = 0,
    p2 = 0;

function los(e) {
    if (!1 === aa[e]) {
        jj ? (document.getElementById('a' + e).innerHTML = 'O', document.getElementById('turn').innerHTML = 'Turn: X', aa[e] = '2') : (document.getElementById('a' + e).innerHTML = 'X', document.getElementById('turn').innerHTML = 'Turn: O', aa[e] = '1'), jj = !jj;
        for (let a = 1; a <= 2; a++) {
            1 == a && (awe = '1'), 2 == a && (awe = '2');
            for (let n = 0; n < 9; n += 3)
                if (aa[n] == aa[n + 1] && aa[n + 1] == aa[n + 2] && aa[n + 2] == awe) return void winner(awe);
            for (let r = 0; r <= 3; r++)
                if (aa[r] == aa[r + 3] && aa[r + 3] == aa[r + 6] && aa[r + 6] == awe) return void winner(awe);
            if (aa[0] == aa[4] && aa[4] == aa[8] && aa[8] == awe) return void winner(awe);
            if (aa[2] == aa[4] && aa[4] == aa[6] && aa[6] == awe) return void winner(awe);
        }
        9 == ++jkl && rese();
    }
}

function rese() {
    document.getElementById('reset').style = 'visibility:visible', jkl = 0, aa = [3, 3, 3, 3, 3, 3, 3, 3, 3];
}

function rematch() {
    aa = [!1, !1, !1, !1, !1, !1, !1, !1, !1];
    for (let e = 0; e < 9; e++) document.getElementById('a' + e).innerHTML = '';
    document.getElementById('reset').style = 'visibility:hidden';
}

function winner(e) {
    1 == e ? (p1++, showAlert('Gewinner: X')) : 2 == e && (p2++, showAlert('Gewinner: O')), rese(), document.getElementById('score').innerHTML = 'X: ' + p1 + ' vs. O: ' + p2;
}
aa = [!1, !1, !1, !1, !1, !1, !1, !1, !1];
}
const offlineScript = extractFunctionBody(offlineFunction);


function easyFunction(){
    let  hh, jj = true, win = false;
    let awe, jkl = 0;
    let p1 = 0, p2 = 0; aa = [false, false, false, false, false, false, false, false, false];
    function los(hh){
        if((jj) && (aa[hh] === false)){zug(hh);
        if(win === false){bot();}}
    }

    function zug(hh)
    {
        if(aa[hh] === false)
        {
            if(!jj)
            {
                document.getElementById('a' + hh).innerHTML = 'X';
                document.getElementById('turn').innerHTML = 'Turn: O';
                aa[hh] = '1';

            }
            else
            {
                document.getElementById('a' + hh).innerHTML = 'O';
                document.getElementById('turn').innerHTML = 'Turn: X';
                aa[hh] = '2';
            }
            jj = !jj;

            for(let hhh = 1;hhh <= 2;hhh++)
            {
                if(hhh == 1)
                {
                    awe = '1';
                }
                if(hhh == 2)
                {
                    awe = '2';
                }

                for(let fo = 0;fo < 9;fo = fo + 3)
                {
                    if((aa[fo] == aa[fo + 1]) && (aa[fo + 1] == aa[fo + 2]) && (aa[fo + 2] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }
                for(let fa = 0;fa <= 3;fa++)
                {
                    if((aa[fa] == aa[fa + 3]) && (aa[fa + 3] == aa[fa + 6]) && (aa[fa + 6] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }

        if((aa[0] == aa[4]) && (aa[4] == aa[8]) && (aa[8] == awe))
                {
                    winner(awe);
                    return;
                }
                if((aa[2] == aa[4]) && (aa[4] == aa[6]) && (aa[6] == awe))
                {
                    winner(awe);
                    return;
                }
            }
            jkl++;
            if(jkl == 9)
            {
                rese();
            }
        }
    }

    function rese(){
        document.getElementById('reset').style = 'visibility:visible';
        jkl = 0;
        aa = [3, 3, 3, 3, 3, 3, 3, 3, 3];
        win = true;
        }


    function rematch(){
        win = false;
        jj = true;
                aa = [false, false, false, false, false, false, false, false, false];
        for(let www = 0;www < 9;www++){
        document.getElementById('a' + www).innerHTML = '';}
        document.getElementById('reset').style = 'visibility:hidden';
    }

    function winner(ji){
        if(ji == 1){
            p1++;
            showAlert('Winner: X');
        }
        else if(ji == 2){
            p2++;
            showAlert('Winner: O');
        }
        rese();
        document.getElementById('score').innerHTML = 'X: ' + p1 + ' vs. O: ' + p2;
    }

    function bot(){
        let ran;
        do{ran = Math.floor(Math.random() * (9));}
        while(aa[ran] !== false);
        zug(ran);
    }
}
const easyBotScript = extractFunctionBody(easyFunction);

function mediumFunction(){
    let  hh, jj = true, win = false;
    let awe, jkl = 0;
    let p1 = 0, p2 = 0; aa = [false, false, false, false, false, false, false, false, false];
    let bb = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];

    function los(hh){
        if((jj) && (aa[hh] === false)){zug(hh);
        if(win === false){bot(hh);}}
    }

    function zug(hh)

    {
        if(aa[hh] === false)
        {
            if(!jj)
            {
                document.getElementById('a' + hh).innerHTML = 'X';
                document.getElementById('turn').innerHTML = 'Turn: O';
                aa[hh] = '1';

            }
            else
            {
                 document.getElementById('a' + hh).innerHTML = 'O';
                 document.getElementById('turn').innerHTML = 'Turn: X';
                 aa[hh] = '2';
            }
            jj = !jj;

            for(let hhh = 1;hhh <= 2;hhh++)
            {
                if(hhh == 1)
                {
                    awe = '1';
                }
                if(hhh == 2)
                {
                    awe = '2';
                }

                for(let fo = 0;fo < 9;fo = fo + 3)
                {
                    if((aa[fo] == aa[fo + 1]) && (aa[fo + 1] == aa[fo + 2]) && (aa[fo + 2] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }
                for(let fa = 0;fa <= 3;fa++)
                {
                    if((aa[fa] == aa[fa + 3]) && (aa[fa + 3] == aa[fa + 6]) && (aa[fa + 6] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }

            if((aa[0] == aa[4]) && (aa[4] == aa[8]) && (aa[8] == awe))
                {
                     winner(awe);
                     return;
                }
                if((aa[2] == aa[4]) && (aa[4] == aa[6]) && (aa[6] == awe))
                {
                     winner(awe);
                     return;
                }
            }
            jkl++;
            if(jkl == 9)
            {
                 rese();
            }
        }
    }

    function rese(){
        win = true;
          document.getElementById('reset').style = 'visibility:visible';
        jkl = 0;
        aa = [3, 3, 3, 3, 3, 3, 3, 3, 3];
        }


    function rematch(){
        aa = [false, false, false, false, false, false, false, false, false];
        for(let www = 0;www < 9;www++){
        document.getElementById('a' + www).innerHTML = '';}
        document.getElementById('reset').style = 'visibility:hidden';
        jj = true;
        win = false;
        bb = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];
    }

    function winner(ji){
        if(ji == 1){
            p1++;
            showAlert('Winner: X');
        }
        else if(ji == 2){

            p2++;
            showAlert('Winner: O');
        }
        rese();
        document.getElementById('score').innerHTML = 'X: ' + p1 + ' vs. O: ' + p2;
    }


    function bot(hh){
        let ran, i, tes;
        mov = false;
        write(hh, 1);//1=other Player 2=bot
        //testing own winning opertunity
        if(mov === false){
            for(i in bb) {//horizontal
                if(test(bb[i][0], bb[i][1], bb[i][2]) === true){
                    tes = test3(bb[i][0], bb[i][1], bb[i][2]);
                    //alert(i+" + "+tes);
                    if(tes !== false){
                        mov = true;
                        ran = 3 * i + tes * 1;
                    }
                }
            }
        }
        if(mov === false){//vertical
            for(i in bb) {
                if(test(bb[0][i], bb[1][i], bb[2][i]) === true){
                    tes = test3(bb[0][i], bb[1][i], bb[2][i]);
                    if(tes !== false){
                        mov = true;
                        ran = 3 * tes + i * 1;
                    }
                }
            }
        }
        if(mov === false){//diagonal \
            if(test(bb[0][0], bb[1][1], bb[2][2]) === true){
                tes = test3(bb[0][0], bb[1][1], bb[2][2]);
                if(tes !== false){
                    mov = true;
                    ran = 4 * tes;
                }
            }
        }
        if(mov === false){//diagonal /
            if(test(bb[0][2], bb[1][1], bb[2][0]) === true){
                tes = test3(bb[0][2], bb[1][1], bb[2][0]);
                if(tes !== false){
                    mov = true;
                    ran = 2 * tes + 2;
                }
            }
        }
        //checking win opertynity othre player
        if(mov == false){
            for(i in bb) {//horizontal
                if(test(bb[i][0], bb[i][1], bb[i][2]) === true){
                    tes = test2(bb[i][0], bb[i][1], bb[i][2]);
                    if(tes !== false){
                        mov = true;
                        ran = 3 * i + tes;
                    }
                }
            }
        }
        if(mov === false){//vertical
            for(i in bb) {
                if(test(bb[0][i], bb[1][i], bb[2][i]) === true){
                    tes = test2(bb[0][i], bb[1][i], bb[2][i]);
                    if(tes !== false){
                        mov = true;
                        ran = 3 * tes + i * 1;
                    }
                }
            }
        }
        if(mov === false){//diagonal \
            if(test(bb[0][0], bb[1][1], bb[2][2]) === true){
                tes = test2(bb[0][0], bb[1][1], bb[2][2]);
                if(tes !== false){
                    mov = true;
                    ran = 4 * tes;
                }
            }
        }
        if(mov === false){//diagonal /
            if(test(bb[0][2], bb[1][1], bb[2][0]) === true){
                tes = test2(bb[0][2], bb[1][1], bb[2][0]);
                if(tes !== false){
                    mov = true;
                    ran = 2 * tes + 2;
                }
            }
        }
        if(mov === false){
            do{ran = Math.floor(Math.random() * (9));}
            while(aa[ran] !== false);
            //do{ran =  Math.abs(Math.round(prompt()))-1;}
            //while(aa[ran]!==false);

            mov = true;
        }
        if(mov === true){
            zug(ran);
            write(ran, 2);
            //alert(bb);
        }


    }


    function write(hh, inp){
        switch (hh){
            case 0:bb[0][0] = inp;break;
            case 1:bb[0][1] = inp;break;
            case 2:bb[0][2] = inp;break;
            case 3:bb[1][0] = inp;break;
            case 4:bb[1][1] = inp;break;
            case 5:bb[1][2] = inp;break;
            case 6:bb[2][0] = inp;break;
            case 7:bb[2][1] = inp;break;
            case 8:bb[2][2] = inp;break;
            default:break;
        }
    }



    function test(a, b, c){
        if((a === undefined) || (b === undefined) || (c === undefined)){
            if((a == b) && (a == c)){
                return false;
            }
            else if((a == b) || (a == c) || (b == c)){
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

    function test2(a, b, c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a == 1) || (b == 1) || (c == 1)){
            if((a == 1) && (b == 1) && (isNaN(c)))return 2;
            else if((a == 1) && (c == 1) && (isNaN(b)))return 1;
            else if((c == 1) && (b == 1) && (isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    function test3(a, b, c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a == 2) || (b == 2) || (c == 2)){
            if((a == 2) && (b == 2) && (isNaN(c)))return 2;
            else if((a == 2) && (c == 2) && (isNaN(b)))return 1;
            else if((c == 2) && (b == 2) && (isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }
}
const mediumBotScript = extractFunctionBody(mediumFunction);


function hardFunction(){
    let jj = true, win = false;
    let awe, jkl = 0;
    let p1 = 0, p2 = 0; aa = [false, false, false, false, false, false, false, false, false];
    let bb = [[undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined]
        ];
    let moo, mii;

    function los(hh){
        if((jj) && (aa[hh] === false)){
            zug(hh);
            if(win === false){
                bot(hh);
            }
        }
    }

    function zug(hh) {
        if(aa[hh] === false)
        {
            if(!jj)
            {
                document.getElementById('a' + hh).innerHTML = 'X';
                document.getElementById('turn').innerHTML = 'Turn: O';
                aa[hh] = '1';

            }
            else
            {
                 document.getElementById('a' + hh).innerHTML = 'O';
                 document.getElementById('turn').innerHTML = 'Turn: X';
                 aa[hh] = '2';
            }
            jj = !jj;

            for(let hhh = 1;hhh <= 2;hhh++)
            {
                if(hhh == 1)
                {
                    awe = '1';
                }
                if(hhh == 2)
                {
                    awe = '2';
                }

                for(let fo = 0;fo < 9;fo = fo + 3)
                {
                    if((aa[fo] == aa[fo + 1]) && (aa[fo + 1] == aa[fo + 2]) && (aa[fo + 2] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }
                for(let fa = 0;fa <= 3;fa++)
                {
                    if((aa[fa] == aa[fa + 3]) && (aa[fa + 3] == aa[fa + 6]) && (aa[fa + 6] == awe))
                    {
                        winner(awe);
                        return;
                    }
                }

            if((aa[0] == aa[4]) && (aa[4] == aa[8]) && (aa[8] == awe))
                {
                     winner(awe);
                     return;
                }
                if((aa[2] == aa[4]) && (aa[4] == aa[6]) && (aa[6] == awe))
                {
                     winner(awe);
                     return;
                }
            }
            jkl++;
            if(jkl == 9)
            {
                 rese();
            }
        }
    }

    function rese(){
        win = true;
        aa = [3, 3, 3, 3, 3, 3, 3, 3, 3];
        document.getElementById('reset').style = 'visibility:visible';
        }


        function rematch(){
        aa = [false, false, false, false, false, false, false, false, false];
        for(let www = 0;www < 9;www++){
        document.getElementById('a' + www).innerHTML = '';}
        jj = true;
        win = false;
        bb = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];
        jkl = 0;
        awe = undefined;
        moo = undefined;
        mii = undefined;
        document.getElementById('reset').style = 'visibility:hidden';
    }

    function winner(ji){
        if(ji == 1){
            p1++;
            showAlert('Winner: X');
        }
        else if(ji == 2){

            p2++;
            showAlert('Winner: O');
        }
        rese();
        document.getElementById('score').innerHTML = 'X: ' + p1 + ' vs. O: ' + p2;
    }


    function bot(hh){
        let ran, i, tes;
        mov = false;
        write(hh, 1);//1=other Player 2=bot
        //testing own winning opertunity
        if(jkl >= 3){
            if(mov === false){
                for(i in bb) {//horizontal
                    if(test(bb[i][0], bb[i][1], bb[i][2]) === true){
                        tes = test3(bb[i][0], bb[i][1], bb[i][2]);
                        //alert(i+" + "+tes);
                        if(tes !== false){
                            mov = true;
                            ran = 3 * i + tes * 1;
                        }
                    }
                }
            }
            if(mov === false){//vertical
                for(i in bb) {
                    if(test(bb[0][i], bb[1][i], bb[2][i]) === true){
                        tes = test3(bb[0][i], bb[1][i], bb[2][i]);
                        if(tes !== false){
                            mov = true;
                            ran = 3 * tes + i * 1;
                        }
                    }
                }
            }
            if(mov === false){//diagonal \
                if(test(bb[0][0], bb[1][1], bb[2][2]) === true){
                    tes = test3(bb[0][0], bb[1][1], bb[2][2]);
                    if(tes !== false){
                        mov = true;
                        ran = 4 * tes;
                    }
                }
            }
            if(mov === false){//diagonal /
                if(test(bb[0][2], bb[1][1], bb[2][0]) === true){
                    tes = test3(bb[0][2], bb[1][1], bb[2][0]);
                    if(tes !== false){
                        mov = true;
                        ran = 2 * tes + 2;
                    }
                }
            }
            //checking win opertynity other player
            if(mov == false){
                for(i in bb) {//horizontal
                    if(test(bb[i][0], bb[i][1], bb[i][2]) === true){
                        tes = test2(bb[i][0], bb[i][1], bb[i][2]);
                        if(tes !== false){
                            mov = true;
                            ran = 3 * i + tes;
                        }
                    }
                }
            }
            if(mov === false){//vertical
                for(i in bb) {
                    if(test(bb[0][i], bb[1][i], bb[2][i]) === true){
                        tes = test2(bb[0][i], bb[1][i], bb[2][i]);
                        if(tes !== false){
                            mov = true;
                            ran = 3 * tes + i * 1;
                        }
                    }
                }
            }
            if(mov === false){//diagonal \
                if(test(bb[0][0], bb[1][1], bb[2][2]) === true){
                    tes = test2(bb[0][0], bb[1][1], bb[2][2]);
                    if(tes !== false){
                        mov = true;
                        ran = 4 * tes;
                    }
                }
            }
            if(mov === false){//diagonal /
                if(test(bb[0][2], bb[1][1], bb[2][0]) === true){
                    tes = test2(bb[0][2], bb[1][1], bb[2][0]);
                    if(tes !== false){
                        mov = true;
                        ran = 2 * tes + 2;
                    }
                }
            }
        }

        if(mov === false){//kjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkj
            if(jkl == 1){
                switch (hh){
                    case 0: ran = 4;break;
                    case 1: ran = 7;mii = 6;break;
                    case 2: ran = 4;break;
                    case 3: ran = 5;mii = 8;break;
                    case 4: ran = 6;mii = true;break;
                    case 5: ran = 3;mii = 0;break;
                    case 6: ran = 4;break;
                    case 7: ran = 1;mii = 2;break;
                    case 8: ran = 4;break;
                }
                if(ran == 4)moo = true;
                mov = true;
            }
            else{
                //  ???
                //  ?X?
                //  0??
                if((mov == false) && (mii === true) && (hh == 2) && (jkl == 3)){
                    ran = 0;
                    mov = true;
                }

                //?0?
                //?0?
                //oX?
                if((mov == false) && (hh == 4) && (jkl == 3)){
                    mov = true;
                    ran = Math.abs(Math.round(mii));
                }

                //  0X0
                //  ??X
                //  ??0
                if(mov == false){
                    if(test4(bb[0][1], bb[1][0], bb[0][0], bb[0][2], bb[2][0]) === true){
                        mov = true;
                        ran = 0;
                    }
                }
                if(mov == false){
                    if(test4(bb[0][1], bb[1][2], bb[0][2], bb[0][0], bb[2][2]) === true){
                        mov = true;
                        ran = 2;
                    }
                }
                if(mov == false){
                    if(test4(bb[2][1], bb[1][0], bb[2][0], bb[0][0], bb[2][2]) === true){
                        mov = true;
                        ran = 6;
                    }
                }
                if(mov == false){
                    if(test4(bb[2][1], bb[1][2], bb[2][2], bb[0][2], bb[2][0]) === true){
                        mov = true;
                        ran = 8;
                    }
                }
                //  X00
                //  ??0
                //  ??X
                if(mov == false){
                    if(test4(bb[2][0], bb[0][2], bb[1][0], bb[0][0], bb[0][1]) === true){
                        mov = true;
                        ran = 1;
                    }
                }
                if(mov == false){
                    if(test4(bb[2][0], bb[0][2], bb[2][1], bb[2][2], bb[1][2]) === true){
                        mov = true;
                        ran = 3;
                    }
                }
                if(mov == false){
                    if(test4(bb[0][0], bb[2][2], bb[0][1], bb[0][2], bb[1][2]) === true){
                        mov = true;
                        ran = 5;
                    }
                }
                if(mov == false){
                    if(test4(bb[0][0], bb[2][2], bb[1][0], bb[2][0], bb[2][1]) === true){
                        mov = true;
                        ran = 7;
                    }
                }
                //  X00
                //  ??X
                //  ??0
                if(mov == false){
                    if(test4(bb[0][0], bb[2][1], bb[2][0], bb[2][2], bb[1][0]) === true){
                        mov = true;
                        if(moo === true) ran = 3;
                        else ran = 8;
                    }
                }
                if(mov == false){
                    if(test4(bb[0][2], bb[2][1], bb[2][0], bb[2][2], bb[1][2]) === true){
                        mov = true;
                        if(moo === true) ran = 5;
                        else ran = 6;
                    }
                }

                if(mov == false){
                    if(test4(bb[0][2], bb[1][0], bb[0][0], bb[2][0], bb[0][1]) === true){
                        mov = true;
                        if(moo === true) ran = 1;
                        else ran = 6;
                    }
                }
                if(mov == false){
                    if(test4(bb[2][2], bb[1][0], bb[0][0], bb[2][0], bb[2][1]) === true){
                        mov = true;
                        if(moo === true) ran = 7;
                        else ran = 0;
                    }
                }

                if(mov == false){
                    if(test4(bb[2][0], bb[0][1], bb[0][0], bb[0][2], bb[1][0]) === true){
                        mov = true;
                        if(moo === true) ran = 3;
                        else ran = 2;
                    }
                }if(mov == false){
                    if(test4(bb[2][2], bb[0][1], bb[0][0], bb[0][2], bb[1][2]) === true){
                        mov = true;
                        if(moo === true) ran = 5;
                        else ran = 0;
                    }
                }

                if(mov == false){
                    if(test4(bb[0][0], bb[1][2], bb[0][2], bb[2][2], bb[0][1]) === true){
                        mov = true;
                        if(moo === true) ran = 1;
                        else ran = 8;
                    }
                }if(mov == false){
                    if(test4(bb[2][0], bb[1][2], bb[0][2], bb[2][2], bb[2][1]) === true){
                        mov = true;
                        if(moo === true) ran = 7;
                        else ran = 2;
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


            if(mov === false) {
                do{ran = Math.floor(Math.random() * (9));}
                while(aa[ran] !== false);
                //do{ran =  Math.abs(Math.round(prompt()))-1;}
                //while(aa[ran]!==false);
                mov = true;
            }

        }
        if(mov === true){
            zug(ran);
            write(ran, 2);
            //alert(bb);
        }


    }


    function write(hh, inp){
        switch (hh){
            case 0:bb[0][0] = inp;break;
            case 1:bb[0][1] = inp;break;
            case 2:bb[0][2] = inp;break;
            case 3:bb[1][0] = inp;break;
            case 4:bb[1][1] = inp;break;
            case 5:bb[1][2] = inp;break;
            case 6:bb[2][0] = inp;break;
            case 7:bb[2][1] = inp;break;
            case 8:bb[2][2] = inp;break;
            default:break;
        }
    }



    function test(a, b, c){
        if((a === undefined) || (b === undefined) || (c === undefined)){
            if((a == b) && (a == c)){
                return false;
            }
            else if((a == b) || (a == c) || (b == c)){
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

    function test2(a, b, c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a == 1) || (b == 1) || (c == 1)){
            if((a == 1) && (b == 1) && (isNaN(c)))return 2;
            else if((a == 1) && (c == 1) && (isNaN(b)))return 1;
            else if((c == 1) && (b == 1) && (isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    function test3(a, b, c){
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        c = Math.abs(Math.round(c));
        if((a == 2) || (b == 2) || (c == 2)){
            if((a == 2) && (b == 2) && (isNaN(c)))return 2;
            else if((a == 2) && (c == 2) && (isNaN(b)))return 1;
            else if((c == 2) && (b == 2) && (isNaN(a)))return 0;
            else return false;
        }
        else return false;
    }

    function test4(a, b, c, d, e){
        if((a == 1) && (b == 1) && (c === undefined) && (d === undefined) && (e === undefined)) return true;
        else return false;


    }
}
const hardBotScript = extractFunctionBody(hardFunction);


function experimentalLocalFunction(){
    let jj = true;
    let awe, jkl = 0;
    let p1 = 0, p2 = 0; aa = [false, false, false, false, false, false, false, false, false];
    let tem, durch = '1';

    function los(hh) {
        if((aa[hh] === false) && (jkl < 6))
        {
            if(!jj)
            {
                document.getElementById('a' + hh).innerHTML = 'X';
                document.getElementById('turn').innerHTML = 'Turn: O';
                aa[hh] = '1';

            }
            else
            {
                 document.getElementById('a' + hh).innerHTML = 'O';
                 document.getElementById('turn').innerHTML = 'Turn: X';
                 aa[hh] = '2';
            }
            jj = !jj;
            win();

            jkl++;

        }
        else if((jkl >= 6)){
            if((durch == '1') && (aa[hh] !== false)){
                if((!jj) && (aa[hh] == '1')){
                    document.getElementById('a' + hh).style.color = 'red';
                    tem = hh;
                    durch = '2';
                }
                else if((jj) && (aa[hh] == '2')){
                    document.getElementById('a' + hh).style.color = 'red';
                    tem = hh;
                    durch = '2';
                }
            }
            else if((durch == '2') && (hh == tem)){
                document.getElementById('a' + tem).removeAttribute('style');
                durch = '1';
            }
            else if((durch == '2') && (aa[hh] === false)){
                if(!jj){

                    document.getElementById('a' + hh).innerHTML = 'X';
                    document.getElementById('a' + tem).innerHTML = ' ';
                    document.getElementById('turn').innerHTML = 'Turn: O';
                    document.getElementById('a' + tem).removeAttribute('style');
                    aa[hh] = '1';
                    aa[tem] = false;

                }
                else
                {
                     document.getElementById('a' + hh).innerHTML = 'O';
                     document.getElementById('a' + tem).innerHTML = ' ';
                     document.getElementById('turn').innerHTML = 'Turn: X';
                     document.getElementById('a' + tem).removeAttribute('style');
                     aa[hh] = '2';
                     aa[tem] = false;
                }
                jj = !jj;
                win();

                durch = '1';

            }
            else if((durch == '2') && ((aa[hh] !== false))){
                if((!jj) && (aa[hh] == '1')){
                    document.getElementById('a' + hh).style.color = 'red';
                    document.getElementById('a' + tem).removeAttribute('style');
                    tem = hh;
                }
                else if((jj) && (aa[hh] == '2')){
                    document.getElementById('a' + hh).style.color = 'red';
                    document.getElementById('a' + tem).removeAttribute('style');
                    tem = hh;
                }
            }
        }
    }

    function win(){
        for(let hhh = 1;hhh <= 2;hhh++)
            {
            if(hhh == 1)
            {
                awe = '1';
            }
            if(hhh == 2)
            {
                awe = '2';
            }

            for(let fo = 0;fo < 9;fo = fo + 3)
            {
                if((aa[fo] == aa[fo + 1]) && (aa[fo + 1] == aa[fo + 2]) && (aa[fo + 2] == awe))
                {
                    winner(awe);
                    return;
                }
            }
            for(let fa = 0;fa <= 3;fa++)
            {
                if((aa[fa] == aa[fa + 3]) && (aa[fa + 3] == aa[fa + 6]) && (aa[fa + 6] == awe))
                {
                    winner(awe);
                    return;
                }
            }

            if((aa[0] == aa[4]) && (aa[4] == aa[8]) && (aa[8] == awe))
            {
                 winner(awe);
                 return;
            }
            if((aa[2] == aa[4]) && (aa[4] == aa[6]) && (aa[6] == awe))
            {
                 winner(awe);
                 return;
            }
        }
    }

     function rese(){
         aa = [3, 3, 3, 3, 3, 3, 3, 3, 3];
         document.getElementById('reset').style = 'visibility:visible';
    }


     function rematch(){
         aa = [false, false, false, false, false, false, false, false, false];
         for(let www = 0;www < 9;www++){
         document.getElementById('a' + www).innerHTML = '';}
         jkl = 0;
         document.getElementById('reset').style = 'visibility:hidden';


        jj = true;
        awe = undefined;
        tem = undefined;
        durch = '1';
     }

     function winner(ji){
         if(ji == 1){
             p1++;
             showAlert('Winner: X');
         }
         else if(ji == 2){
             p2++;
             showAlert('Winner: O');
         }
         rese();
         document.getElementById('score').innerHTML = 'X: ' + p1 + ' vs. O: ' + p2;
    }
}
const experimentLocalScript = extractFunctionBody(experimentalLocalFunction);

let experimentalTutorial;
let modus = 0;
let erro = false;

function unread(ff){
    if(ff == 0){
        var yourscripttag = document.getElementById('chatt');
        yourscripttag.remove();
        var newscript = document.createElement('style');
        newscript.type = 'text/css';
        newscript.id = 'chatt';
        newscript.appendChild(document.createTextNode('#cha::after{display:none;content:\'0\'}'));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }
    else if(ff > 9){
        var yourscripttag = document.getElementById('chatt');
        yourscripttag.remove();
        var newscript = document.createElement('style');
        newscript.type = 'text/css';
        newscript.id = 'chatt';
        newscript.appendChild(document.createTextNode('#cha::after{display:block;content:\'9+\'}'));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }
    else if(ff > 0){
        var yourscripttag = document.getElementById('chatt');
        yourscripttag.remove();
        var newscript = document.createElement('style');
        newscript.type = 'text/css';
        newscript.id = 'chatt';
        newscript.appendChild(document.createTextNode('#cha::after{display:block;content:\'' + ff + '\'}'));
        document.getElementsByTagName('head').item(0).appendChild(newscript);
    }
}

function typingin(ff){
    const yourscripttag = document.getElementById('typingg');
    yourscripttag.remove();
    const newscript = document.createElement('style');
    newscript.type = 'text/css';
    newscript.id = 'typingg';
    if(ff){
        newscript.appendChild(document.createTextNode('#chat-content:after{display:block}'));
    }
    else{
        newscript.appendChild(document.createTextNode('#chat-content:after{display:none}'));
    }
    document.getElementsByTagName('head').item(0).appendChild(newscript);
}

function chatwrite(wer, was){
    if(wer == 'system'){
        text = '<center><p style=\'font-style: italic;\'>' + was + '</p></center>';
    }
    else if(wer == 'me'){
        text = '<p style=\'text-align: end;\'>' + was + '</p>';
    }
    else if(wer == 'other'){
        text = '<p>' + was + '</p>';
        nachrichtplus(1);
    }
    document.getElementById('chat-content').innerHTML = document.getElementById('chat-content').innerHTML + text;
}

function htmlEscapeSpecialChars(text) {
    const specialChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&apos;'};
    return text.replace(/[&<>"#]/g, find => specialChars[find]);
}

async function chatwarning(){
    erro = true;
    showAlert('Der Chat besitzt keinerlei Worfilter!<br>Die Webseite hat nichts mit den Inhalten welche Übermittelt werden zu tun und  übernimmt keinerlei Haftung für jegliche von dritter Übermittelte Inhalte!<br><div  align=\'left\' style=\'float:left;\'><button onclick=\'chatOk();\'>Okay verstanden</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'erro=false;sp()\'>Kein Interesse</button></div>', false);
}

async function chatOk(){
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
    //document.getElementById("experimentalTutorial").style.display="block";
    showAlert('Sieht so aus als würdest du das erste mal diesen Modus spielen. <br>Willst du ein Tutorial?<br><div  align=\'left\' style=\'float:left;\'><button onclick=\'ja(), experimentalTutorialfals()\'>Ja</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'nein(), experimentalTutorialfals()\'>Nein</button></div>', false);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reloadScript(scriptt) {
    const yourscripttag = document.getElementById('toBeAutoFilledScript');
    yourscripttag.remove();
    const newscript = document.createElement('script');
    newscript.type = 'text/javascript';
    newscript.id = 'toBeAutoFilledScript';
    newscript.appendChild(document.createTextNode(scriptt));
    document.getElementsByTagName('head').item(0).appendChild(newscript);
}

function show(contain){
    document.getElementById('div0').style = 'display:none !important';
    document.getElementById('div1').style = 'display:none !important';
    document.getElementById('div2').style = 'display:none !important';
    document.getElementById('singleplayer').style = 'display:none !important';
    document.getElementById('multiplayer').style = 'display:none !important';
    document.getElementById('experimental-area').style = 'display:none !important';
    document.getElementById(contain).style = 'display:block !important';
}

function notInGame() {
    modus = 0;
}

function back() {
    show('div0');
    document.getElementById('settingsBox').classList.remove('ingame');
    document.getElementById('help').style.display = 'none';
    notInGame();
}

function onlineMultiplayer() {
    resett();
    reloadScript(normalMultiplyerScript);
    show('multiplayer');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'none';
    modus = 1;
}

function localMultiplayer() {
    resett();
    reloadScript(offlineScript);
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    modus = 1;
}

function singleplayerArea() {
    show('singleplayer');
    document.getElementById('settingsBox').classList.add('ingame');
    notInGame();
}

function easyBot() {
    resett();
    reloadScript(easyBotScript);
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    modus = 1;
}

function mediumBot() {
    resett();
    reloadScript(mediumBotScript);
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    modus = 1;
}

function hardBot() {
    resett();
    reloadScript(hardBotScript);
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    document.getElementById('help').style.display = 'block';
    modus = 1;
}


function experimentalLocalMultiplayer() {
    resett();
    reloadScript(experimentLocalScript);
    show('div1');
    document.getElementById('settingsBox').classList.add('ingame');
    modus = 2;
    if(experimentalTutorial != 'false') {
        //document.getElementById("experimentalTutorial").style.display="block";
        showAlert('Sieht so aus als würdest du das erste mal diesen Modus spielen. <br>Willst du ein Tutorial?<br><div  align=\'left\' style=\'float:left;\'><button onclick=\'ja(), experimentalTutorialfals()\'>Ja</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'nein(), experimentalTutorialfals()\'>Nein</button></div>', false);
    } else {
        document.getElementById('help').style.display = 'block';
    }
}

function experimentalMultiplayer() {
    resett();
    reloadScript(experimentMultiplayerScript);
    show('multiplayer');
    document.getElementById('settingsBox').classList.add('ingame');
    modus = 2;
    document.getElementById('help').style.display = 'none';
}

function experimentalArea() {
    show('experimental-area');
    document.getElementById('settingsBox').classList.add('ingame');
    notInGame();
}

function backButton() {
    const hash = String(window.location.hash).replace('#', '').trim();
    let newHash = '';
    switch (hash) {
        case 'easyBot':
        case 'mediumBot':
        case 'hardBot':
            newHash = 'singleplayer';
            break;
        case 'experimental-local-multiplayer':
        case 'experimental-multiplayer':
            newHash = 'experimental-area';
            break;
        case 'singleplayer':
        case 'multiplayer':
        case '1v1': 
        case 'experimental-area':
            newHash = '';
            break;
        default:
            newHash = '';
            break;
    }
    window.location.hash = newHash;
    reloadScript('');
}


function nein() {
    sp();
    document.getElementById('help').style.display = 'block';
}

function ja() {
    if(modus == 1) {
        showAlert('<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style=\'color:#50ff1e\'>X</span> und <span style=\'color:#50ff1e\'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diargonalen zu haben.<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'sp()\'>Ok</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'animat1()\'>Animation</button></div>', false);
    } else if(modus == 2) {
        showAlert('<b>Anleitung</b><br><br>Ihr (also du und dein Gegner) setzt jeweils  abwechselnd euer Zeichen (<span style=\'color:#50ff1e\'>X</span> und <span style=\'color:#50ff1e\'>O</span>).<br> Ziel ist es, als erstes 3 von seinen Zeichen in einer Reihe, Spalte oder Diargonalen zu haben.<br>Der Unterschied zum normalen Spiel besteht jedoch darin, dass jeder nur 3 Zeichen besitzt.<br>Wenn alle gesetzt worden sind, werden die Zeichen auf den Feldern solange versetzt, bis einer Gewonnen hat.<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'sp()\'>Ok</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'animat2()\'>Animation</button></div>', false);
    }
}

function experimentalTutorialfals() {
    localStorage.setItem('experimentalTutorial', 'false');
    experimentalTutorial = 'false';
}
async function animat1() {
    const bac = document.getElementsByClassName('back');
    for(var i = 0; i < 4; i++) bac[i].style.display = 'none';
    document.getElementById('help').style.display = 'none';
    for(var www = 0; www < 9; www++) document.getElementById('a' + www).innerHTML = '';
    sp();
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
    for(var www = 0; www < 9; www++) {
        if(aa[www] == '1') document.getElementById('a' + www).innerHTML = 'X';
        else if(aa[www] == '2') document.getElementById('a' + www).innerHTML = 'O';
        else document.getElementById('a' + www).innerHTML = '';
    }
    document.getElementById('help').style.display = 'block';
    for(i = 0; i < 4; i++) bac[i].removeAttribute('style');
    ja();
}
async function animat2() {
    const bac = document.getElementsByClassName('back');
    for(var i = 0; i < 4; i++) bac[i].style.display = 'none';
    document.getElementById('help').style.display = 'none';
    for(var www = 0; www < 9; www++) document.getElementById('a' + www).innerHTML = '';
    sp();
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
    for(var www = 0; www < 9; www++) {
        if(aa[www] == '1') document.getElementById('a' + www).innerHTML = 'X';
        else if(aa[www] == '2') document.getElementById('a' + www).innerHTML = 'O';
        else document.getElementById('a' + www).innerHTML = '';
    }
    document.getElementById('help').style.display = 'block';
    for(i = 0; i < 4; i++) bac[i].removeAttribute('style');
    ja();
}
async function help() {
    document.getElementById('help').style.display = 'none';
    showAlert('<b>Hilfe</b><br><br>Willst du ein Tutorial zu diesem Spielmodus?<br><br><div  align=\'left\' style=\'float:left;\'><button onclick=\'ja()\'>Ja</button></div><div  align=\'right\' style=\'margin-bottom: -18px;\'><button onclick=\'sp()\'>Nein</button></div>', false);
}

async function sp() {
    if(erro === false)
        modal.style.display = 'none';
    document.getElementById('help').style.display = 'block';
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
};

function showAlert(text, isClosable = true) {
    document.getElementById('mote').innerHTML = text;
    modal.style.display = 'block';
    if(!isClosable) {
        document.getElementsByClassName('close')[0].style.display = 'none';
    } else {
        document.getElementsByClassName('close')[0].style.display = 'block';
    }
}

function resett() {
    aa = [false, false, false, false, false, false, false, false, false];
    for(let www = 0; www < 9; www++) {
        document.getElementById('a' + www).innerHTML = '';
    }
    document.getElementById('reset').style = 'visibility:hidden';
    document.getElementById('score').innerHTML = 'X: 0 vs. O: 0';
}

function switchTheme() {
    if(themeColor == 'light') {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        themeColor = 'dark';
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        themeColor = 'light';
    }
    localStorage.setItem('themeColor', themeColor);
}

function err() { //<meta http-equiv="refresh" content="5; URL=http://meine zieladresse">
    erro = true;
    const newmeta = document.createElement('meta');
    newmeta.httpEquiv = 'refresh';
    newmeta.content = '5; URL=https://oberhofer.ddns.net/ttt';
    document.getElementsByTagName('head').item(0).appendChild(newmeta);
}

async function fadebutton(tt){
    let ff;
    if(tt){
        document.getElementsByClassName('slide')[0].disabled = true;
        ff = document.getElementsByClassName('moveRightElement');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('links');
        }
        ff = document.getElementsByClassName('moveLeftElement');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('recht');
        }
        ff = document.getElementsByClassName('fadeElement');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('hexhex');
        }
        ff = document.getElementsByClassName('groser');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.add('kein');
        }
    }
    else if(!tt){
        ff = document.getElementsByClassName('moveRightElement');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('links');
        }
        ff = document.getElementsByClassName('moveLeftElement');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('recht');
        }
        ff = document.getElementsByClassName('fadeElement');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('hexhex');
        }
        ff = document.getElementsByClassName('groser');
        for (var i = ff.length - 1; i >= 0; i--) {
            ff[i].classList.remove('kein');
        }
        await sleep(animationspeed);
        document.getElementsByClassName('slide')[0].disabled = false;
    }
}

function changeanimationspeed(ff){
    ff /= 2;
    animationspeed = ff;
    localStorage.setItem('animationspeed', ff);
    document.documentElement.style.setProperty('--animationspeed', ff + 'ms');
    ff = (ff * 2) / 3;
    document.documentElement.style.setProperty('--animationspeed2', ff + 'ms');

}

async function closepatch(){
    document.getElementsByClassName('patch-window')[0].classList.remove('movechat');
    patch.classList.remove('chatopa');
    await sleep(animationspeed);
    patch.style.display = 'none';
}

async function pat(){
    patch.style.display = 'block';
    await sleep(100);
    document.getElementsByClassName('patch-window')[0].classList.add('movechat');
    patch.classList.add('chatopa');
    const yourscripttag = document.getElementById('patchh');
    yourscripttag.remove();
    const newscript = document.createElement('style');
    newscript.type = 'text/css';
    newscript.id = 'patchh';
    newscript.appendChild(document.createTextNode('#note::after{display:none}'));
    document.getElementsByTagName('head').item(0).appendChild(newscript);
    localStorage.setItem('patchversion', document.getElementById('version').innerHTML);
}
