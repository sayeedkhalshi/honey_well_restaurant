window.onload = function () {
    var i = 0; // Start Point
    var images = []; // Images Array
    var time = 3000; // Time Between Switch

    // Change Image
    function changeImg() {
        document.slide.src = images[i];

        // Check If Index Is Under Max
        if (i < images.length - 1) {
            // Add 1 to Index
            i++;
        } else {
            // Reset Back To O
            i = 0;
        }

        // Run function every x seconds
        setTimeout("changeImg()", time);
    }

    changeImg();

    document.getElementById("edit").addEventListener("click", loadName);

    function loadName(e) {
        e.preventDefault();

        var xhr = new XMLHttpRequest();
        var url = "/fullname";
        var oldName = document.getElementById("name-view");

        xhr.open("GET", url, true);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                var res = xhr.responseText;
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(res, "text/html");

                var pageData = htmlDoc.getElementById("form");

                oldName.innerHTML = pageData.innerHTML;

                /*
                window.history.pushState(
                    { html: htmlDoc.html, pageTitle: document.title },
                    "",
                    url
                );

                
                window.onpopstate = function (e) {
                    if (e.state) {
                        document.getElementById("all-content").innerHTML =
                            e.state.html;
                        document.title = e.state.pageTitle;
                    }
                };
                */
            }
            console.log("Done");
        };

        xhr.onprogress = function () {
            oldName.innerHTML = "Loading...";
            console.log("Loadind...");
        };

        xhr.onerror = function () {
            oldName.innerHTML = "Load error";
            console.log("Error");
        };

        xhr.send();
    }
};
