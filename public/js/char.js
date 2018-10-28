$( document ).ready(function() {
$('.upgrade-strength').on('click', function() {
    var strCount = $('#strengthId');
    var strId = +$('#strengthId').text();
    var points = $('#points');
    var username = $('#username').text();
    var userId = $('#userId').text();
    if(strId < 100) {
    socket.emit('upgrade-str', {
        userid: userId
    });

    strCount.html(function(i, val) { return val*1+1 }); 
    points.html(function(i, val) { 
        

if(val*1>0){
     val = val*1-1;
     if(val == 0){
         document.getElementById("strBtn").innerHTML = "";
         document.getElementById("dexBtn").innerHTML = "";
         document.getElementById("vitBtn").innerHTML = "";
         document.getElementById("intBtn").innerHTML = "";
     } return val;
 }

});
    } else {
        alert('Your strength is already maximum');
    }
});

$('.upgrade-dexterity').on('click', function() {
    var dexCount = $('#dexterityId');
    var dexInt = + $('#dexterityId').text();
    var points = $('#points');
    var username = $('#username').text();
    var userId = $('#userId').text();
    if(dexInt < 100){
        socket.emit('upgrade-dex', {
            userid: userId
        });

    dexCount.html(function(i, val) { return val*1+1 }); 

    points.html(function(i, val) { 

        if(val*1>0){
             val = val*1-1;
             if(val == 0){
                 document.getElementById("strBtn").innerHTML = "";
                 document.getElementById("dexBtn").innerHTML = "";
                 document.getElementById("vitBtn").innerHTML = "";
                 document.getElementById("intBtn").innerHTML = "";
             } return val;
         }
        
        });

} else {
    alert('Your dexterity is already maximum.');
}    
});

$('.upgrade-vitality').on('click', function() {
    var vitCount = $('#vitalityId');
    var vitInt = +$('#vitalityId').text();
    var points = $('#points');
    var username = $('#username').text();
    var userId = $('#userId').text();
    if(vitInt < 100){
    socket.emit('upgrade-vit', {
        userid: userId
    });

    vitCount.html(function(i, val) { return val*1+1 }); 
    points.html(function(i, val) { 

if(val*1>0){
     val = val*1-1;
     if(val == 0){
         document.getElementById("strBtn").innerHTML = "";
         document.getElementById("dexBtn").innerHTML = "";
         document.getElementById("vitBtn").innerHTML = "";
         document.getElementById("intBtn").innerHTML = "";
     } return val;
 }

});
} else {
    alert('Your vitality is already maximum.');
}
});

$('.upgrade-intellect').on('click', function() {
    var intCount = $('#intellectId');
    var intInt = +$('#intellectId').text();
    var points = $('#points');
    var username = $('#username').text();
    var userId = $('#userId').text();
    if(intInt < 100){
    socket.emit('upgrade-int', {
        userid: userId
    });

    intCount.html(function(i, val) { return val*1+1 }); 
    points.html(function(i, val) { 

if(val*1>0){
     val = val*1-1;
     if(val == 0){
         document.getElementById("strBtn").innerHTML = "";
         document.getElementById("dexBtn").innerHTML = "";
         document.getElementById("vitBtn").innerHTML = "";
         document.getElementById("intBtn").innerHTML = "";
     } return val;
 }

});
} else {
    alert('Your intellect is already maximum.');
}
});
});