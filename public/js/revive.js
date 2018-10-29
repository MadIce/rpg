(() => {

var reviveCount = +$('#reviveCount').text();
if(reviveCount === 3) {
    document.getElementById("reviveInfo").innerHTML = 'You reached the maximum limit of revives.';
}

})();
