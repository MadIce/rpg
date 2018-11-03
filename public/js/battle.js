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

var FightInterval;

attBtn.on('click', function(){
attBtn.remove();

FightInterval = setInterval(function(){
        if(enemyHealth>0){
            socket.emit('attack', {
                username: userName,
                target: enemyName
            });

        }else{
          clearInterval(FightInterval);         
        }
      },1000);
document.getElementById("loading-image").setAttribute("style","display:block");
document.getElementById("loading-image").setAttribute("style","height:100px");

});


socket.on('fightWin', (data) => {
    console.log(data.msg);
});

    socket.on('attack-result', (data) => {

        $(".attBtn").attr("disabled", true);
        setTimeout(function(){ 
            $(".attBtn").attr("disabled", false);
        }, 1000);

        userHealthBar = $('#userHealth');
        enemyHealthBar = $('#enemyHealth');
        var minimum = 0;

        userHealth -= data.enemyDmg;
        enemyHealth -= data.userDmg;

    var uhealth = + $('#userHealth').text();
    var ehealth = + $('#enemyHealth').text();


    $('.user-bar').css('width', function(index, value){
        return uhealth+"%";
     });

    $('.enemy-bar').css('width', function(index, value){
        return ehealth+"%";
     });

   userHealthBar.html(function(i, val) { 
    const result = val*1-data.enemyDmg;
        return Math.max(result, 0);
    });  

   enemyHealthBar.html(function(i, val) { 
    const result = val*1-data.userDmg;
        return Math.max(result, 0);
    });  


/*
    $('.user-bar').css('width', function(index, value){
        return uhealth+"%";
     });

    $('.enemy-bar').css('width', function(index, value){
        return ehealth+"%";
     });
*/
    if(userHealth < 0){userHealth = minimum;}
    if(enemyHealth < 0){enemyHealth = minimum;}   

    if(enemyHealth === 0) {
      
        document.getElementById("fightInfo").innerHTML = '<strong>'+enemyName+'</strong> have been defeated.'+'<br>'+
        '<strong>' +enemyName+'</strong>' +' hit <strong>You</strong> with ' +data.enemyDmg+' dmg <br> ' + '<strong>You</strong> hit ' 
        +'<strong>'+enemyName+'</strong>'+ ' with '+ data.userDmg +' dmg'
        
        attBtn.remove();
        document.getElementById("rewardBtn").innerHTML = 
        '<button style="background-color: blue; font-size: 24px;" class="btn btn-primary" id="reward-button">Get reward 🏆</button>';
        $('#escapeBtn').remove();    
        document.querySelector('#reward-button').addEventListener('click', getReward);

                

    } else if(userHealth === 0 || userHealth < 0) {
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

        socket.on('battle-win', (data) => {

            document.getElementById("fightInfo").innerHTML = 

            '<strong>You</strong> won the fight.<br><strong>Reward:</strong><br>Gold: ' +data.gold+' <img src="/img/gold.png" style="margin-top: -1%"><br>EXP: '+data.exp+'<br>'
            +
            '<br>'
            +
            '<button style="font-size: 24px;" class="btn btn-danger" id="backtoarena">⚔️<br>Back To Arena</button>';
            document.querySelector('#backtoarena').addEventListener('click', backToArena);

        });


           socket.emit('win-fight', {
            username: userName,
            enemyname: enemyName
           });

    }
    function backToArena(){
        window.location.href = "/arena";
    }


})();
