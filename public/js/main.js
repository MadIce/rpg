$(document).ready(function($) {
    (() => {

$('#sent-btn').on('click', function(){

    var username = $('#username').text();
    var message = $('#message').val();
    var length = message.replace(/\s/g, "");
      if(length.length < 3) {
          $('#message').val('');
          $('#message').attr("placeholder", "Min length 3 chars");
      } else {
          $('#message').val('');
          $('#message').attr("placeholder", "Sent!");
          socket.emit('message-sent', {
              username: username,
              message: message
          });
      }
    });
    
    socket.on('message-sent', function(data) {
        if(data.username === "Phasmastis") {
            $('.chatroom').prepend('<small><span style="color: white">'+data.createdAt+'</span> <strong><a href="/character/'+data.username+'" class="user-link"><span><img src="/img/crown.png" id="crown">'+data.username+'</span> '
            +'</strong></a><span style="color: white">'+data.message+'</span></small><br>');            
        } else {
            $('.chatroom').prepend('<small><span style="color: white">'+data.createdAt+'</span> <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+' '
            +'</strong></a><span style="color: white">'+data.message+'</span></small><br>');
        }
    });
            socket.on('online-users', function(data) {
                document.getElementById("onlineUsers").innerHTML = data.users;
            });
    
            socket.on('user-disconnected', function(data) {
                document.getElementById("onlineUsers").innerHTML = data.user;
            });
    
            socket.on('item-bought-str', function(data){
                $('.live').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> bought <img src="'+data.item_img+'"> '+data.item_title+' for '+data.item_price+' <img src="/img/gold.png" style="margin-top: -1%; height: 8px" alt=""></small></br>');
            });
            socket.on('item-bought-dex', function(data){
                $('.live').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> bought <img src="'+data.item_img+'"> '+data.item_title+' for '+data.item_price+' <img src="/img/gold.png" style="margin-top: -1%; height: 8px" alt=""></small></br>');
            }); 
            socket.on('item-bought-vit', function(data){
                $('.live').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> bought <img src="'+data.item_img+'"> '+data.item_title+' for '+data.item_price+' <img src="/img/gold.png" style="margin-top: -1%; height: 8px" alt=""></small></br>');
            });  
            socket.on('item-bought-intel', function(data){
                $('.live').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> bought <img src="'+data.item_img+'"> '+data.item_title+' for '+data.item_price+' <img src="/img/gold.png" style="margin-top: -1%; height: 8px" alt=""></small></br>');
            });   
            socket.on('item-bought-pot', function(data){
                $('.live').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> bought <img src="'+data.item_img+'"> '+data.item_title+' for '+data.item_price+' <img src="/img/gold.png" style="margin-top: -1%; height: 8px" alt=""></small></br>');
            });       
    
            socket.on('fight-win', function(data) {
                $('.liveFights').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> won fight versus <strong><a href="/character/'+data.enemyname+'" class="user-link">'+data.enemyname+'</a></strong> and gain '+data.gold+' <img src="/img/gold.png" style="margin-top: -1%; height: 8px" alt=""> with '+data.exp+' exp points</small></br>');
            });
    
            socket.on('lost-fight', function(data) {
                $('.lostFights').prepend('<small>'+data.createdAt+' <strong><a href="/character/'+data.username+'" class="user-link">'+data.username+'</a></strong> lost fight versus <strong><a href="/character/'+data.enemyname+'" class="user-link">'+data.enemyname+'</a></strong></small></br>');
            });
        })();
        });