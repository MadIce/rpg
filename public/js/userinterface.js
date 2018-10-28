(() => {
    function itemPopup(t) {
        document.getElementById(t).classList.toggle("show")
    }
    $(".eatBtn").on("click", function() {
        var t = +$(this).closest(".popuptext").find(".power").text(),
            e = $(this).closest(".popup").find(".boughtItemId").text(),
            i = ($(this).closest(".popup").find(".title").text(), $("#username").text()),
            n = +$("#userHealth").text();

            if(n === 100) {
                return alert('Your health is already full.');
            }

        $(".progress-bar").css("width", function(e, i) {
            return n + t + "%"
        });
        var s = $("#userHealth");
        n < 100 ? (s.html(function(e, i) {
            var n = 1 * i + t;
            return n > 100 ? 100 : n
        }), $(this).closest(".popup").find(".itemId").remove(), socket.emit("eat-it", {
            itemId: e,
            username: i
        }), $("#arenaBtn").html('<a href="/arena" class="btn btn-danger" style="float: right">ARENA ⚔️</a>')) : console.log("your health is full")
    }), $(".sellBtn").on("click", function() {
        var t = $(this).closest(".popup").find(".title").text(),
            e = $(this).closest(".popup").find(".boughtItemId").text(),
            i = $("#username").text(),
            n = $("#userGold"),
            s = +$(this).closest(".popuptext").find(".itemPrice").text(),
            o = $(this).closest(".popup").find(".itemId").attr("src"),
            r = $("#strId"),
          //  l = $("#dexId"),
            u = $("#vitId"),
            p = $("#intId"),
            a = +$(this).closest(".popuptext").find(".power").text(),
            c = $(this).closest(".popup").find(".itemType").text();
            /*"Strength" === c ? r.html(function(t, e) {
                var i = 1 * e - a;
                return Math.max(i, 0)
            }) : "Dexterity" === c ? l.html(function(t, e) {
                var i = 1 * e - a;
                return Math.max(i, 0)
            }) : "Vitality" === c ? u.html(function(t, e) {
                var i = 1 * e - a;
                return Math.max(i, 0)
            }) : "Intellect" === c && p.html(function(t, e) {
                var i = 1 * e - a;
                return Math.max(i, 0)
            }), n.html(function(t, e) {
                return 1 * e + s
            }),*/ $(this).closest(".popup").find(".itemId").remove(), socket.emit("sell-item", {
            itemId: e,
            username: i,
            itemImg: o,
            itemPrice: s,
            title: t
        })
    });

    socket.on('currentItemDex', (data) => {
        $("#dexId").text(data.currentItemDex);
    });
    socket.on('currentItemStr', (data) => {
        $("#strId").text(data.currentItemStr);
    });    
    socket.on('currentItemVit', (data) => {
        $("#vitId").text(data.currentItemVit);
    });
    socket.on('currentItemInt', (data) => {
        $("#intId").text(data.currentItemInt);
    });


    var reviveCount = +$('#reviveCount').text();
    if(reviveCount === 3) {
        document.getElementById("reviveInfo").innerHTML = 'You reached the maximum limit of revives.';
    }

})();





/*(() => {function itemPopup(t){document.getElementById(t).classList.toggle("show")}$(".eatBtn").on("click",function(){var t=+$(this).closest(".popuptext").find(".power").text(),e=$(this).closest(".popup").find(".boughtItemId").text(),i=($(this).closest(".popup").find(".title").text(),$("#username").text()),n=+$("#userHealth").text();$(".progress-bar").css("width",function(e,i){return n+t+"%"});var s=$("#userHealth");n<100?(s.html(function(e,i){var n=1*i+t;return n>100?100:n}),$(this).closest(".popup").find(".itemId").remove(),socket.emit("eat-it",{itemId:e,username:i}),$("#arenaBtn").html('<a href="/arena" class="btn btn-danger">ARENA ⚔️</a>')):console.log("your health is full")}),$(".sellBtn").on("click",function(){var t=$(this).closest(".popup").find(".title").text(),e=$(this).closest(".popup").find(".boughtItemId").text(),i=$("#username").text(),n=$("#userGold"),s=+$(this).closest(".popuptext").find(".itemPrice").text(),o=$(this).closest(".popup").find(".itemId").attr("src"),r=$("#strId"),l=$("#dexId"),u=$("#vitId"),p=$("intId"),a=+$(this).closest(".popuptext").find(".power").text(),c=$(this).closest(".popup").find(".itemType").text();"Strength"===c?r.html(function(t,e){var i=1*e-a;return Math.max(i,0)}):"Dexterity"===c?l.html(function(t,e){var i=1*e-a;return Math.max(i,0)}):"Vitality"===c?u.html(function(t,e){var i=1*e-a;return Math.max(i,0)}):"Intellect"===c&&p.html(function(t,e){var i=1*e-a;return Math.max(i,0)}),n.html(function(t,e){return 1*e+s}),$(this).closest(".popup").find(".itemId").remove(),socket.emit("sell-item",{itemId:e,username:i,itemImg:o,itemPrice:s,title:t})});})();*/