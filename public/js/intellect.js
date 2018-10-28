(() => {
    function itemPopup(t) {
        document.getElementById(t).classList.toggle("show")
    }
    $(".buyItem").on("click", function() {
        var t = parseInt($("#userGold").text()),
            e = +$(this).find(".price").text(),
            i = $("#userGold"),
            n = $("#intId"),
            n2 = +$("#intId").text();
            if(n2 === 100){
                alert('Your intellect is already maximum.');
            } else {
        if (t > e || t === e) {
            var s = $("#username").text(),
                userId = $('#userId').text(),
                o = this.id,
                r = $(this).closest(".text-center").find(".title").text(),
                c = +$(this).find(".price").text(),
                l = $(this).closest(".text-center").find(".item").attr("src"),
                m = +$(this).closest(".text-center").find(".power").text(),
                d = +$(this).find(".price").text();
            i.html(function(t, e) {
                return 1 * e - d
            }), n.html(function(t, e) {
                var result = 1 * e + m;
                return result > 100 ? 100 : result;
            }), socket.emit("item-bought-intel", {
                username: s,
                itemId: o,
                item_title: r,
                item_price: c,
                item_img: l,
                item_power: m,
                userId: userId
            }), $("#inventory").append('<img src="' + l + '">')
        } else console.log("not enough gold")
    }
    });
})();



/*(() => {function itemPopup(t){document.getElementById(t).classList.toggle("show")}$(".buyItem").on("click",function(){var t=parseInt($("#userGold").text()),e=+$(this).find(".price").text(),i=$("#userGold"),n=$("#intId");if(t>e||t===e){var s=$("#username").text(),o=this.id,r=$(this).closest(".text-center").find(".title").text(),c=+$(this).find(".price").text(),l=$(this).closest(".text-center").find(".item").attr("src"),m=+$(this).closest(".text-center").find(".power").text(),d=+$(this).find(".price").text();i.html(function(t,e){return 1*e-d}),n.html(function(t,e){return 1*e+m}),socket.emit("item-bought-intel",{username:s,itemId:o,item_title:r,item_price:c,item_img:l,item_power:m}),$("#inventory").append('<img src="'+l+'">')}else console.log("not enough gold")});})();*/