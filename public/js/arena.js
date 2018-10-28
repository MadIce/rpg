(() => {var userName=$("#userName").text(),enemyName=$("#enemyName").text(),userID=$("#userID").text(),enemyID=$("#enemyID").text(),userHealth=+$("#userHealth").text(),enemyHealth=+$("#enemyHealth").text(),attBtn=$(".attBtn"),fightInfo=$("#fightInfo");function getReward(){$("#reward-button").remove(),$("#rewardBtn").remove(),socket.on("fight-win",function(e){document.getElementById("fightInfo").innerHTML="<strong>You</strong> won the fight.<br><strong>Reward:</strong><br>Gold: "+e.gold+' <img src="/img/gold.png" style="margin-top: -1%"><br>EXP: '+e.exp+'<br><br><button style="font-size: 24px;" class="btn btn-danger" id="backtoarena">⚔️<br>Back To Arena</button>',document.querySelector("#backtoarena").addEventListener("click",backToArena)}),socket.emit("win-fight",{username:userName,enemyname:enemyName})}function backToArena(){window.location.href="/arena"}userStr=+$("#userStr").text(),userDex=+$("#userDex").text(),userVit=+$("#userVit").text(),userInt=+$("#userIntel").text(),enemyStr=+$("#enemyStr").text(),enemyDex=+$("#enemyDex").text(),enemyVit=+$("#enemyVit").text(),enemyInt=+$("#enemyIntel").text(),userLevel=+$("#userLevel").text(),enemyLevel=+$("#enemyLevel").text(),userType=$("#userType").text(),enemyType=$("#enemyType").text(),attBtn.on("click",function(){if("Ranged"===userType&&"Melee"===enemyType)var e=(userDex+userStr)/2+userInt/4,t=Math.ceil((2*userLevel/5+2)*(e*(userInt/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyStr)/2+enemyInt/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyInt/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Ranged"===userType&&"Magic"===enemyType)e=(userDex+userStr)/2+userInt/4,t=Math.ceil((2*userLevel/5+2)*(e*(userInt/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyInt)/2+enemyStr/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyStr/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Ranged"===userType&&"Ranged"===enemyType)e=(userDex+userStr)/2+userInt/4,t=Math.ceil((2*userLevel/5+2)*(e*(userInt/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyStr)/2+enemyInt/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyInt/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Melee"===userType&&"Ranged"===enemyType)e=(userDex+userStr)/2+userInt/4,t=Math.ceil((2*userLevel/5+2)*(e*(userInt/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyStr)/2+enemyInt/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyInt/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Melee"===userType&&"Magic"===enemyType)e=(userDex+userStr)/2+userInt/4,t=Math.ceil((2*userLevel/5+2)*(e*(userInt/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyInt)/2+enemyStr/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyStr/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Melee"===userType&&"Meele"===enemyType)e=(userDex+userStr)/2+userInt/4,t=Math.ceil((2*userLevel/5+2)*(e*(userInt/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyStr)/2+enemyInt/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyInt/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Magic"===userType&&"Ranged"===enemyType)e=(userDex+userInt)/2+userStr/4,t=Math.ceil((2*userLevel/5+2)*(e*(userStr/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyStr)/2+enemyInt/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyInt/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Magic"===userType&&"Melee"===enemyType)e=(userDex+userInt)/2+userStr/4,t=Math.ceil((2*userLevel/5+2)*(e*(userStr/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyStr)/2+enemyInt/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyInt/(userVit+userDex))/50)+4+Math.random(.9,1.1));if("Magic"===userType&&"Magic"===enemyType)e=(userDex+userInt)/2+userStr/4,t=Math.ceil((2*userLevel/5+2)*(e*(userStr/(enemyVit+enemyDex))/50)+4+Math.random(.9,1.1)),n=(enemyDex+enemyInt)/2+enemyStr/4,r=Math.ceil((2*enemyLevel/5+2)*(n*(enemyStr/(userVit+userDex))/50)+4+Math.random(.9,1.1));var m=t,a=r;userHealth-=a,enemyHealth-=m,userHealthBar=$("#userHealth"),enemyHealthBar=$("#enemyHealth"),userHealthBar.html(function(e,t){var n=1*t-a;return Math.max(n,0)}),enemyHealthBar.html(function(e,t){var n=1*t-m;return Math.max(n,0)});var s=+$("#userHealth").text(),u=+$("#enemyHealth").text();$(".user-bar").css("width",function(e,t){return s+"%"}),$(".enemy-bar").css("width",function(e,t){return u+"%"}),userHealth<0&&(userHealth=0),enemyHealth<0&&(enemyHealth=0),0===enemyHealth?(document.getElementById("fightInfo").innerHTML="<strong>"+enemyName+"</strong> have been defeated.<br><strong>"+enemyName+"</strong> hit <strong>You</strong> with "+a+" dmg <br> <strong>You</strong> hit <strong>"+enemyName+"</strong> with "+m+" dmg",attBtn.remove(),document.getElementById("rewardBtn").innerHTML='<button style="background-color: blue; font-size: 24px;" class="btn btn-primary" id="reward-button">Get reward 🏆</button>',$("#escapeBtn").remove(),document.querySelector("#reward-button").addEventListener("click",getReward)):0===userHealth?(document.getElementById("fightInfo").innerHTML="<strong>You</strong> have been defeated.<br>",attBtn.remove(),$("#escapeBtn").remove(),socket.emit("fight-lost",{username:userName}),socket.emit("lost-fight",{username:userName,enemyname:enemyName}),window.setTimeout(function(){window.location.href="/"},1500)):document.getElementById("fightInfo").innerHTML="<strong>"+enemyName+"</strong> hit <strong>You</strong> with "+a+" dmg <br> <strong>You</strong> hit <strong>"+enemyName+"</strong> with "+m+" dmg"}),$("#escapeBtn").on("click",function(){socket.emit("escaped-fight",{health:userHealth,username:userName})});})();








(() => {
    function itemPopup(ID) {
        var popup = document.getElementById(ID);
        popup.classList.toggle("show");
    }
    // USERNAMES
    var userName = $('#userName').text();
    var enemyName = $('#enemyName').text();
    //ID's
    var userID = $('#userID').text();
    var enemyID = $('#enemyID').text();
    // HEALTH
    var userHealth = + $('#userHealth').text();
    var enemyHealth = + $('#enemyHealth').text();
    // FIGHT OPTIONS
    var attBtn = $('.attBtn');
    var fightInfo = $('#fightInfo');
    //USER & ENEMY STATS
    userStr = + $('#userStr').text();
    userDex = + $('#userDex').text();
    userVit = + $('#userVit').text();
    userInt = + $('#userIntel').text();
    
    enemyStr = + $('#enemyStr').text();
    enemyDex = + $('#enemyDex').text();
    enemyVit = + $('#enemyVit').text();
    enemyInt = + $('#enemyIntel').text()
    //LEVELS
    userLevel = + $('#userLevel').text();
    enemyLevel = +$('#enemyLevel').text();
    //TYPES
    userType = $('#userType').text();
    enemyType = $('#enemyType').text();
    
    attBtn.on('click', function(){
    
        /*
       if(userType === 'Ranged' && enemyType === 'Melee'){
        
        var userPower = ((userDex + userStr) / 2) + userInt / 4;
        var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userInt/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
    
         var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
          var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyInt/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));        
       }
    
    
       if(userType === 'Ranged' && enemyType === 'Magic'){
        
        var userPower = ((userDex + userStr) / 2) + userInt / 4;
        var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userInt/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
    
         var enemyPower = ((enemyDex + enemyInt) / 2) + enemyStr / 4;
          var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyStr/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
      
       }
    
       if(userType === 'Ranged' && enemyType === 'Ranged'){
        
        var userPower = ((userDex + userStr) / 2) + userInt / 4;
        var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userInt/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
    
        var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
        var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyInt/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
    
       }
    
       if(userType === 'Melee' && enemyType === 'Ranged'){
        
        var userPower = ((userDex + userStr) / 2) + userInt / 4;
          var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userInt/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));        
    
        var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
        var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyInt/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
       }
    
    
          if(userType === 'Melee' && enemyType === 'Magic'){
    
        var userPower = ((userDex + userStr) / 2) + userInt / 4;
          var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userInt/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));        
    
        var enemyPower = ((enemyDex + enemyInt) / 2) + enemyStr / 4;
        var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyStr/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
    
      }
    
          if(userType === 'Melee' && enemyType === 'Meele'){
    
        var userPower = ((userDex + userStr) / 2) + userInt / 4;
          var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userInt/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));        
    
        var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
          var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyInt/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));        
       }
    
    
          if(userType === 'Magic' && enemyType === 'Ranged'){
    
        var userPower = ((userDex + userInt) / 2) + userStr / 4;
        var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userStr/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
    
        var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
        var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyInt/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
       }
    
          if(userType === 'Magic' && enemyType === 'Melee'){
    
        var userPower = ((userDex + userInt) / 2) + userStr / 4;
        var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userStr/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
    
        var enemyPower = ((enemyDex + enemyStr) / 2) + enemyInt / 4;
        var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyInt/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
       }
    
    
          if(userType === 'Magic' && enemyType === 'Magic'){
    
        var userPower = ((userDex + userInt) / 2) + userStr / 4;
        var userDamage = Math.ceil((((2*userLevel/5) + 2) * (userPower * (userStr/(enemyVit + enemyDex)) / 50) + 4) + Math.random(0.9,1.1));
    
        var enemyPower = ((enemyDex + enemyInt) / 2) + enemyStr / 4;
        var enemyDamage = Math.ceil((((2*enemyLevel/5) + 2) * (enemyPower * (enemyStr/(userVit + userDex)) / 50) + 4) + Math.random(0.9,1.1));
      }   
        var userDmg = userDamage;
        var enemyDmg = enemyDamage;
        var minimum = 0;
    
        userHealth -= enemyDmg;
        enemyHealth -= userDmg; */
    
        socket.emit('attack');
    });
        socket.on('attack-result', (data) => {
    
        
    
       userHealthBar = $('#userHealth');
       enemyHealthBar = $('#enemyHealth');
    
       userHealthBar.html(function(i, val) { 
        const result = val*1-data.enemyDmg;
            return Math.max(result, 0);
        });  
    
       enemyHealthBar.html(function(i, val) { 
        const result = val*1-data.userDmg;
            return Math.max(result, 0);
        });  
    
        var uhealth = + $('#userHealth').text();
        var ehealth = + $('#enemyHealth').text();
    
        $('.user-bar').css('width', function(index, value){
            return uhealth+"%";
         });
    
        $('.enemy-bar').css('width', function(index, value){
            return ehealth+"%";
         });
    
        if(userHealth < 0){userHealth = minimum;}
        if(enemyHealth < 0){enemyHealth = minimum;}   
    
        if(enemyHealth === 0) {
          
            document.getElementById("fightInfo").innerHTML = '<strong>'+enemyName+'</strong> have been defeated.'+'<br>'+
            '<strong>' +enemyName+'</strong>' +' hit <strong>You</strong> with ' +enemyDmg+' dmg <br> ' + '<strong>You</strong> hit ' 
            +'<strong>'+enemyName+'</strong>'+ ' with '+ userDmg +' dmg'
            
            attBtn.remove();
            document.getElementById("rewardBtn").innerHTML = 
            '<button style="background-color: blue; font-size: 24px;" class="btn btn-primary" id="reward-button">Get reward 🏆</button>';
            $('#escapeBtn').remove();    
            document.querySelector('#reward-button').addEventListener('click', getReward);
    
                    
    
        } else if(userHealth === 0) {
            document.getElementById("fightInfo").innerHTML = '<strong>You</strong> have been defeated.<br>';
            attBtn.remove();
            $('#escapeBtn').remove(); 
    
            socket.emit('fight-lost', ({
                username: userName
            }));
    
    
            socket.emit('lost-fight', {
                username: userName,
                enemyname: enemyName
            });
    
            window.setTimeout(function(){
                window.location.href = "/";
            }, 1500);      
    
        } else {
            document.getElementById("fightInfo").innerHTML = '<strong>' +enemyName+'</strong>' +' hit <strong>You</strong> with ' +data.enemyDmg+' dmg <br> ' + '<strong>You</strong> hit ' 
            +'<strong>'+enemyName+'</strong>'+ ' with '+ data.userDmg +' dmg';            
        }
    });
    
    
    $('#escapeBtn').on('click', function(){
        socket.emit('escaped-fight', {
           health: userHealth,
           username: userName
        });
    });
    
    
        function getReward(){
            $('#reward-button').remove();
            $('#rewardBtn').remove();
    
            socket.on('fight-win', (data) => {
    
                document.getElementById("fightInfo").innerHTML = 
    
                '<strong>You</strong> won the fight.<br><strong>Reward:</strong><br>Gold: ' +data.gold+' <img src="/img/gold.png" style="margin-top: -1%"><br>EXP: '+data.exp+'<br>'
                +
                '<br>'
                +
                '<button style="font-size: 24px;" class="btn btn-danger" id="backtoarena">⚔️<br>Back To Arena</button>';
                document.querySelector('#backtoarena').addEventListener('click', backToArena);
    
            });
    /*
            socket.emit('win-fight', {
                username: userName,
                enemyname: enemyName
            });   */
            if(enemyHealth === 0) {
            socket.emit('win-fight');
            } 
    
    
        }
        function backToArena(){
            window.location.href = "/arena";
        }
    })();