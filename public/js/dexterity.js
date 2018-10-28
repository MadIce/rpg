(() => {
    function itemPopup(t) {
        document.getElementById(t).classList.toggle("show")
    }
    $(".buyItem").on("click", function() {
        var t = parseInt($("#userGold").text()),
            e = +$(this).find(".price").text(),
            i = $("#userGold"),
            n = $("#dexId"),
            n2 = +$('#dexId').text();
            if(n2 === 100) {
                alert('Your dexterity is already maximum.');
            } else {
        if (t > e || t === e) {
            var s = $("#username").text(),
               userId = $("#userId").text(),
                o = this.id,
                r = $(this).closest(".text-center").find(".title").text(),
                c = +$(this).find(".price").text(),
                m = $(this).closest(".text-center").find(".item").attr("src"),
                d = +$(this).closest(".text-center").find(".power").text(),
                l = +$(this).find(".price").text();
            i.html(function(t, e) {
                return 1 * e - l
            }), n.html(function(t, e) {
               // return 1 * e + d
                var result = 1 * e + d;
                return result > 100 ? 100 : result;
            }), socket.emit("item-bought-dex", {
                username: s,
                itemId: o,
                item_title: r,
                item_price: c,
                item_img: m,
                item_power: d,
                userId: userId
            }), $("#inventory").append('<img src="' + m + '">')
        } else console.log("not enough gold")
    }
    });

})();

/*(() => {function itemPopup(t){document.getElementById(t).classList.toggle("show")}$(".buyItem").on("click",function(){var t=parseInt($("#userGold").text()),e=+$(this).find(".price").text(),i=$("#userGold"),n=$("#dexId");if(t>e||t===e){var s=$("#username").text(),o=this.id,r=$(this).closest(".text-center").find(".title").text(),c=+$(this).find(".price").text(),m=$(this).closest(".text-center").find(".item").attr("src"),d=+$(this).closest(".text-center").find(".power").text(),l=+$(this).find(".price").text();i.html(function(t,e){return 1*e-l}),n.html(function(t,e){return 1*e+d}),socket.emit("item-bought-dex",{username:s,itemId:o,item_title:r,item_price:c,item_img:m,item_power:d}),$("#inventory").append('<img src="'+m+'">')}else console.log("not enough gold")});})();*/