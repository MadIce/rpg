(() => {
    function itemPopup(t) {
        document.getElementById(t).classList.toggle("show")
    }
  //  var socket = io();
    $(".buyItem").on("click", function() {
        var t = parseInt($("#userGold").text()),
            e = +$(this).find(".price").text(),
            i = $("#userGold");
        if (t > e || t === e) {
            var n = $("#username").text(),
               userId = $("#userId").text(),
                s = this.id,
                o = $(this).closest(".text-center").find(".title").text(),
                r = +$(this).find(".price").text(),
                c = $(this).closest(".text-center").find(".item").attr("src"),
                m = +$(this).closest(".text-center").find(".power").text(),
                l = +$(this).find(".price").text();
            i.html(function(t, e) {
                return 1 * e - l
            }), socket.emit("item-bought-pot", {
                username: n,
                itemId: s,
                item_title: o,
                item_price: r,
                item_img: c,
                item_power: m,
                userId: userId
            }), $("#inventory").append('<img src="' + c + '">')
        } else console.log("not enough gold")
    });
})();


/*(() => {function itemPopup(t){document.getElementById(t).classList.toggle("show")}var socket=io();$(".buyItem").on("click",function(){var t=parseInt($("#userGold").text()),e=+$(this).find(".price").text(),i=$("#userGold");if(t>e||t===e){var n=$("#username").text(),s=this.id,o=$(this).closest(".text-center").find(".title").text(),r=+$(this).find(".price").text(),c=$(this).closest(".text-center").find(".item").attr("src"),m=+$(this).closest(".text-center").find(".power").text(),l=+$(this).find(".price").text();i.html(function(t,e){return 1*e-l}),socket.emit("item-bought-pot",{username:n,itemId:s,item_title:o,item_price:r,item_img:c,item_power:m}),$("#inventory").append('<img src="'+c+'">')}else console.log("not enough gold")});})();*/