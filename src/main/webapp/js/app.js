user = {};

function isEmpty(str) {
    if (str.value == "") {
        return true;
    };
}


function loginCheck() {
    var inputUsername = document.forms["loginForm"]["fname"];
    var pass = document.forms["loginForm"]["fpass"];

    if (isEmpty(inputUsername) || isEmpty(pass)) {
        if (isEmpty(inputUsername)) {
            document.getElementById('loginButton').style.backgroundColor = "red";
            document.getElementById('usernameText').onclick = onClickUser;
            setColor('usernameText', 'red');
            setColor('pUsername', 'red');
            errorMessage(2);
        };

        if (isEmpty(pass)) {
            document.getElementById('pPassword').style.color = "red";
            document.getElementById('loginButton').style.backgroundColor = "red";
            document.getElementById('passwordText').onclick = onClickPass;
            setColor('passwordText', 'red');
            setColor('pPassword', 'red');
        }; //
    } else {
        var url = 'http://parking-parking-backend.193b.starter-ca-central-1.openshiftapps.com/parking-backend/login';
        user.username = inputUsername.value;
        user.password = pass.value;
        var data = {
            username: user.username,
            password: user.password
        };
        $.ajax({
            type: "POST",
            url: url,
            crossDomain: true,
            data: JSON.stringify(data),
            success: function(data) {
                if (data.username) {
                    user.name = data.firstName + " " + data.lastName;
                    user.hasParking = data.type == 'PERMANENT';
                    isLogedIn();
                    document.getElementById('errorMessage').innerHTML = "";
                }
            },
            error: function(data) {
                errorMessage(1);
            	document.getElementById('usernameText').onclick = onClickUser;
            	document.getElementById('passwordText').onclick = onClickPass;
            },
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "Access-Control-Allow-Credentials": "true"
            }
        });
    }
    return false;
}

function onClickPass() {
	document.getElementById('passwordText').value = "";
    document.getElementById('passwordText').focus();
    document.getElementById('passwordText').style.color = "black";
    document.getElementById('pPassword').style.color = "black";
}

function onClickUser() {
    document.getElementById('usernameText').value = "";
    document.getElementById('usernameText').style.color = "black";
    document.getElementById('pUsername').style.color = "black";
}

function setColor(id, color) {
    document.getElementById(id).style.color = color;
}

function isLogedIn() {
    visibility('loginAlignment', 'none');
    visibility('contentAlignment', 'block');

    var str = "<h2>Hello " + user.name + " ! <input type=\"button\" class=\"logoutButtons\" id=\"logoutButton\" value=\"Logout\"onclick=\"window.location.reload()\"></input></h2>";
    $('#welcomeMessage').html(str);

    if (user.hasParking) {
        $('#withParking').load('html/with-parking.html', toggleState);
    } else {
        $('#withoutParking').load('html/without-parking.html', toggleState);
    }
}


function showFreeSpots() {
    $.ajax({
        type: "GET",
        url: "http://parking-parking-backend.193b.starter-ca-central-1.openshiftapps.com/parking-backend/vacancies",
        crossDomain: true,
        dataType: 'json',
        success: function(response) {
            spotsArray = response;

            var datas = [];
            for (var i = 0; i < spotsArray.length; i++) {
                var item = spotsArray[i];
                var arr = [];
                arr.push(item.spot.number);
                arr.push(item.spot.floor);
                arr.push(item.date);
                arr.push("");
                datas.push(arr);
            }
            $('#freeSpots').DataTable({
                data: datas,
                "columnDefs": [{
                    "render": function(data, type, row) {
                        var spot = row[0];
                        var floor = row[1];
                        return '<input class="claimButton" id="cbtn" data-spot="' + spot + '" data-floor="' + floor + '" type="button" value="Claim"></input>';
                    },
                    "targets": 2
                }]
            })
            $('.claimButton').on("click", function(evt) {
                var btn = $(evt.target);
                var spot = btn.data('spot');
                var floor = btn.data('floor');
                var date = btn.data('date');
                var postUser = user.username;
                //*******************

                $.ajax({
                    type: "POST",
                    url: "http://parking-parking-backend.193b.starter-ca-central-1.openshiftapps.com/parking-backend/" + postUser + "/bookings/spots/" + spot + "?floor=" + floor,
                    success: function(spotsArray) {
                        var message = "<h2 class='back' id=\"release\">Hello " + user.name + "<br><br> Your parking space today is spot " + btn.data('spot') +
                            " floor " + btn.data('floor') + "!<input type=\"button\" class=\"logoutButtons\" id=\"logoutButton\" value=\"Logout\"onclick=\"window.location.reload()\"></input> " + "<br><br><img src=\"./images/emoji.png\"/>" + "</h2>";

                        $('#welcomeMessage').html(message);
                        visibility('freeSpots', 'none');
                        visibility('freeSpotsText', 'none');
                        visibility('freeSpots_wrapper', 'none');
                    },
                    error: function(data) {
                        visibility('freeSpots', 'none');
                        visibility('freeSpotsText', 'none');
                        visibility('freeSpots_wrapper', 'none');
                        console.log(arguments);
                        if (!isEmpty(data.responseText)) {
                            var err = JSON.parse(data.responseText);
                            document.getElementById('postError').innerHTML = err.error;
                            document.getElementById('postError').style.color = 'red';
                        }
                    },
                    headers: {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                        "Access-Control-Allow-Credentials": "true"
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(user.username + ":" + user.password));
                    }
                });
            });
        },
        error: function(data) {
            errorMessage(3);
        },
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "Access-Control-Allow-Credentials": "true"
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(user.username + ":" + user.password));
        }
    });
}


function toggleState() {
    if (user.hasParking) {

        $('#withoutParking').hide();
        $('#withParking').show();
        visibility('releaseValidate', 'none');
        visibility('alreadyReleased', 'none');


        var postUser = user.username;
        $.ajax({
            type: "GET",
            url: "http://parking-parking-backend.193b.starter-ca-central-1.openshiftapps.com/parking-backend/" + postUser + "/vacancies/assigned",
            crossDomain: true,
            dataType: 'json',
            success: function(response) {
                if (response.length !== 0) {
                    document.getElementById('alreadyReleased').innerHTML = "You already released your spot!" + "<br><br><img src=\"./images/freeParking.png\"/>";
                    visibility('alreadyReleased', 'block');
                } else {
                    visibility('releaseButton', 'block');
                    visibility('showParkingSpot', 'block');
                }
            },
            error: function(data) {
                document.getElementById('errorMessage').innerHTML = "A aparut o eroare!";
            },
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "Access-Control-Allow-Credentials": "true"
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(user.username + ":" + user.password));
            }
        });

    } else if (user.hasParking == false) {


        $.ajax({
            type: "GET",
            url: "http://parking-parking-backend.193b.starter-ca-central-1.openshiftapps.com/parking-backend/" + user.username + "/bookings",
            crossDomain: true,
            success: function(response) {
                $('#withParking').hide();
                $('#withoutParking').show();

                if (response.length != 0) {
                    $('#withoutParking').hide();
                    var message = "<h2 class='back'>Hello " + user.name + "<br><br><br><br> You have parking spot for today!" +
                        "<br><br><img src=\"./images/reservedParking.png\"/> <input type=\"button\" class=\"logoutButtons\" id=\"logoutButton\" value=\"Logout\"onclick=\"window.location.reload()\"></input></h2>"
                    $('#welcomeMessage').html(message);

                } else {
                    showFreeSpots();
                }
            },
            error: function(response) {
                errorMessage(3);
            },
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "Access-Control-Allow-Credentials": "true"
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(user.username + ":" + user.password));
            }
        });

    }
}


function visibility(id, atribute) {
    document.getElementById(id).style.display = atribute;
}

function releaseSubmitButton() {
    var postUser = user.username;
    var isReleased = false;
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: "http://parking-parking-backend.193b.starter-ca-central-1.openshiftapps.com/parking-backend/" + postUser + "/vacancies/assigned",
        success: function(spotsArray) {
            document.getElementById('releaseValidate').innerHTML = "<br><br>Your spot was released successfully!<br><br><img src=\"./images/emoji.png\"/>";
            visibility('releaseButton', 'none');
            visibility('showParkingSpot', 'none');
            isReleased = true;

        },
        error: function(data) {
            visibility('releaseValidate', 'none');
            if (!isEmpty(data.responseText)) {
                var err = JSON.parse(data.responseText);
                document.getElementById('postError').innerHTML = err.error;
                document.getElementById('postError').style.color = 'red';
            }
        },
        headers: {
            "cache-control": "no-cache",
            "Authorization": "Basic " + btoa(user.username + ":" + user.password),
            "Access-Control-Allow-Credentials": "true",
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(user.username + ":" + user.password));
        }
    });

    visibility('releaseValidate', 'block');
}

function errorMessage(arg) {
    switch (arg) {
        case 1:
            document.getElementById('errorMessage').innerHTML = "Invalid username or password!"
            document.getElementById('errorMessage').style.color = 'red';
            document.getElementById('loginButton').style.backgroundColor = "red";
            setColor('usernameText', 'red');
            setColor('pUsername', 'red');
            setColor('passwordText', 'red');
            setColor('pPassword', 'red');
            break;
        case 2:
            document.getElementById('errorMessage').innerHTML = "Enter an username and a password!"
            document.getElementById('errorMessage').style.color = 'red';
            break;
        case 3:
            document.getElementById('errorMessage').innerHTML = "ServerError"
            document.getElementById('errorMessage').style.color = 'red';
            break;
    }
}
