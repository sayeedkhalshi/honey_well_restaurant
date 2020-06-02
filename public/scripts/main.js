window.onload = function () {
    //starts reservation form disabling

    //getting the reservations, date, hour, table data
    let reservations = document.getElementsByClassName("reservations-future");
    let reservationsComb = [];

    for (let i = 0; i < reservations.length; i++) {
        reservationsComb.push(reservations[i].innerHTML);
    }

    let datesGrab = document.getElementsByClassName("date-future");
    let hoursGrab = document.getElementsByClassName("hour-future");
    let tablesGrab = document.getElementsByClassName("table-future");
    let tables = [];
    let hours = [];
    let dates = [];
    for (let i = 0; i < tablesGrab.length; i++) {
        tables.push(tablesGrab[i].innerHTML);
    }
    for (let i = 0; i < hoursGrab.length; i++) {
        hours.push(hoursGrab[i].innerHTML);
    }
    for (let i = 0; i < datesGrab.length; i++) {
        dates.push(datesGrab[i].innerHTML);
    }

    let allComForADate = hours.length * tables.length;

    //getting the reservation form value
    let dateId = document.getElementById("reserveddate");
    let hourId = document.getElementById("reservedhour");
    let tableId = document.getElementById("reservedtable");

    //run table and hour disable function globally
    disableTable();
    hourDisable();
    //run disbale table on change the value
    dateId.addEventListener("change", disableTable);
    dateId.addEventListener("change", hourDisable);
    hourId.addEventListener("change", disableTable);

    function disableTable() {
        //reset the options hidden attibute first
        for (let option = 1; option < tableId.options.length; option++) {
            tableId.options[option].removeAttribute("disabled");
        }

        for (let option = 0; option < tableId.options.length; option++) {
            let combination =
                dateId.value.split(" ")[1] +
                " " +
                hourId.value.split(" ")[1] +
                " " +
                tableId.options[option].value.split(" ")[1];

            if (reservationsComb.indexOf(combination) != -1) {
                //diable options in table
                tableId.options[option].setAttribute("disabled", true);
            }
        }
    }

    //hour disable
    function hourDisable() {
        for (let option = 1; option < hourId.options.length; option++) {
            hourId.options[option].removeAttribute("disabled");
        }

        for (let option = 1; option < hourId.options.length; option++) {
            let count = 0;
            for (let t = 0; t < tables.length; t++) {
                let comb =
                    dateId.value.split(" ")[1] +
                    " " +
                    hourId.options[option].value.split(" ")[1] +
                    " " +
                    tables[t];

                if (reservationsComb.indexOf(comb) != -1) {
                    count += 1;
                }
            }
            if (count == tables.length) {
                hourId.options[option].setAttribute("disabled", true);
            }
        }
    }

    //date disabled
    for (let j = 0; j < dateId.options.length; j++) {
        let AllResForADate = 0;
        for (let k = 0; k < reservationsComb.length; k++) {
            if (
                dateId.options[j].innerHTML == reservationsComb[k].split(" ")[0]
            ) {
                AllResForADate += 1;
            }
        }
        if (AllResForADate == allComForADate) {
            dateId.options[j].setAttribute("disabled", true);
        }
    }

    //end reservation form disabling

    /*
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
    */
};
