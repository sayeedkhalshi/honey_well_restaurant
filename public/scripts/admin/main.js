window.onload = function () {
    //admin section starts

    var today = new Date().toISOString().split("T")[0];
    document.getElementsByName("opendate")[0].setAttribute("min", today);

    //admin section ends
};
