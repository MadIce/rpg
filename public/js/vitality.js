(() => {
    function itemPopup(t) {
        document.getElementById(t).classList.toggle("show")
    }
    $(".buyItem").on("click", function() {
        var t = parseInt($("#userGold").text()),
            e = +$(this).find(".price").text(),
            i = $("#userGold"),
            n = $("#vitId"),
            n2 = +$("#vitId").text();
            if(n2 === 100) {
                alert('Your vitality is already maximum.');
            }
            else {
        if (t > e || t === e) {
            var s = $("#username").text(),
             userId = $("#userId").text(),
                o = this.id,
                r = $(this).closest(".text-center").find(".title").text(),
                c = +$(this).find(".price").text(),
                m = $(this).closest(".text-center").find(".item").attr("src"),
                l = +$(this).closest(".text-center").find(".power").text(),
                d = +$(this).find(".price").text();
            i.html(function(t, e) {
                return 1 * e - d
            }), n.html(function(t, e) {
                var result = 1 * e + l;
                return result > 100 ? 100 : result;
            }), socket.emit("item-bought-vit", {
                username: s,
                itemId: o,
                item_title: r,
                item_price: c,
                item_img: m,
                item_power: l,
                userId: userId
            }), $("#inventory").append('<img src="' + m + '">')
        } else console.log("not enough gold")
    }
    });
})();


/*(() => {function itemPopup(t){document.getElementById(t).classList.toggle("show")}$(".buyItem").on("click",function(){var t=parseInt($("#userGold").text()),e=+$(this).find(".price").text(),i=$("#userGold"),n=$("#vitId");if(t>e||t===e){var s=$("#username").text(),o=this.id,r=$(this).closest(".text-center").find(".title").text(),c=+$(this).find(".price").text(),m=$(this).closest(".text-center").find(".item").attr("src"),l=+$(this).closest(".text-center").find(".power").text(),d=+$(this).find(".price").text();i.html(function(t,e){return 1*e-d}),n.html(function(t,e){return 1*e+l}),socket.emit("item-bought-vit",{username:s,itemId:o,item_title:r,item_price:c,item_img:m,item_power:l}),$("#inventory").append('<img src="'+m+'">')}else console.log("not enough gold")});})();*/