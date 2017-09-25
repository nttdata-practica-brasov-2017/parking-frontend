user = {};

function loginSubmitButton () {
	loginCheck();
}

function isEmpty (str) {
	if (str.value == "") {
		return true;
	};
}


function loginCheck () {
	var inputUsername = document.forms["loginForm"]["fname"];
	var pass = document.forms["loginForm"]["fpass"];
	var pass2 = document.forms["loginForm"]["fpass2"];

	if (isEmpty(inputUsername) || isEmpty(pass)) {
		if (isEmpty(inputUsername)) {
			user.value = "Acest camp trebuie completat!";
			document.getElementById('submitButton').style.backgroundColor = "red";
			document.getElementById('usernameText').onclick = onClickUser;
			setColor('usernameText', 'red');
			setColor('pUsername', 'red');
		};
	
		if (isEmpty(pass)) {
			pass2.value = "Acest camp trebuie completat!";
			document.getElementById('pPassword').style.color = "red";
			document.getElementById('submitButton').style.backgroundColor = "red";
			document.getElementById('passwordText').onclick = onClickPass;
			setColor('passwordText', 'red');
			setColor('pPassword', 'red');
		};//
	} else {
        var url = 'http://localhost:8080/backend/login';
        user.username = inputUsername.value;
        user.password = pass.value;
        var data = {username:user.username, password: user.password};
		$.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
			success: function(data) {
				if (data.username) {
                    user.name = data.firstName + " " + data.lastName;
                    user.hasParking = data.type  == 'PERMANENT';
                    isLogedIn();
                    document.getElementById('errorMessage').innerHTML = "";
				}
			},
			error: function(data) {
                document.getElementById('errorMessage').innerHTML = "User sau parola incorcta!";
                document.getElementById('errorMessage').s
			},
			headers: {
                "content-type": "application/json",
                "cache-control": "no-cache"   
            }
        });
	}
}

function onClickPass () {

	document.getElementById('passwordText').focus();
	document.getElementById('pPassword').style.color = "black";
	document.getElementById('submitButton').style.backgroundColor = "transparent";
}

function onClickUser () {
	document.getElementById('usernameText').value = "";
	document.getElementById('usernameText').style.color = "black";
	document.getElementById('pUsername').style.color = "black";
	document.getElementById('submitButton').style.backgroundColor = "transparent";
}

function setColor (id, color) {
	document.getElementById(id).style.color = color;
}

function isLogedIn () {
	if (user.hasParking == undefined) {};
	visibility('loginAlignment', 'none');
	visibility('contentAlignment', 'block');

	var str = "<h2>Hello " + user.name + " ! <input type=\"button\" id=\"logoutButton\" value=\"Logout\"onclick=\"window.location.reload()\"></input></h2>";
	$('#welcomeMessage').html(str);
	
	
	function toggleState() {
		if (user.hasParking) {
			
			$('#withoutParking').hide();
	        $('#withParking').show();
	        visibility('releaseIsOk', 'none');
	   

	       	var postUser = user.username;
	       	$.ajax({
	              	type: "GET",
	               	url: "http://localhost:8080/backend/" + postUser + "/vacancies/assigned",
	               	crossDomain: true,
	   				dataType: 'json',
	               success: function(response) {
	               		if (response.length !== 0) {
	               			document.getElementById('alreadyReleased').innerHTML = "Ai dat deja release!";
	               			visibility('releaseButton', 'none');
	               			visibility('releaseIsOk', 'none');
	               			visibility('showParkingSpot', 'none');
	               		}
	               },
	               error: function(data) {
	                   document.getElementById('errorMessage').innerHTML = "A aparut o eroare!";
	               },
	               headers: {
	                   "content-type": "application/json",
	                   "cache-control": "no-cache"
	               },
	               beforeSend: function (xhr) {
	   							xhr.setRequestHeader ("Authorization", "Basic " + btoa(user.username + ":" + user.password));
							}
	           });
	
		} else if (user.hasParking == false) {
			$('#withoutParking').show();
	        $('#withParking').hide();
			
				$.ajax({
                	type: "GET",
                	url:"http://localhost:8080/backend/" + user.username + "/bookings",
					crossDomain: true,
                	success: function(response) {
                	    if(response.length!=0) {
                	        $('#withoutParking').hide();
                	        var message = "<h2>Hello " + user.name + " you have parking spot for today" + "" +
                	            "! <input type=\"button\" id=\"logoutButton\" value=\"Logout\"onclick=\"window.location.reload()\"></input</h2>"
                	        $('#welcomeMessage').html(message);
	
                	    }
                	},
                	error: function(response) {
                	    document.getElementById('errorMessage').innerHTML = "A aparut o eroare!";
                	},
                	headers: {
                	    "content-type": "application/json",
                	    "cache-control": "no-cache"
                	},
            	});

	           $.ajax({
	               type: "GET",
	               url: "http://localhost:8080/backend/vacancies",
	               crossDomain: true,
	   			dataType: 'json',
	               success: function(response) {
	               	spotsArray = response;
	
	               	var datas = [];
	               	for (var i=0; i< spotsArray.length; i++) {
	               		var item = spotsArray[i];
	               		var arr = [];
	               		arr.push(item.spot.number);
	               		arr.push(item.spot.floor);
	               		arr.push(item.date);
	               		arr.push("");
	               		datas.push(arr);
	               	}
	               	$('#freeSpots').DataTable(
	               		{
	               			data: datas,
	               			"columnDefs": [
	           					{
	           					    "render": function ( data, type, row ) {
	           					    	var spot = row[0];
	           					    	var floor = row[1];
	           					        return '<input class="claimButton" data-spot="' + spot + '" data-floor="' + floor + '" type="button" value="Claim"></input>';
	           					    },
	           					    "targets": 2
	           					}]
	               		})
	               	$('.claimButton').on("click", function(evt){
	               		var btn = $(evt.target);
	               		var spot = btn.data('spot');
	               		var floor = btn.data('floor');
	               		var date = btn.data('date');
	               		var postUser = user.username;
	               		//*******************
						$.ajax({
	           			    type: "POST",
	           			    url: "http://localhost:8080/backend/" + postUser + "/bookings/spots/" + spot + "?floor=" + floor,
	           			    success: function(spotsArray) {
	           			    	var message = "<h2>Hello " + user.name + "<br>" + " Your parking space today is spot " + btn.data('spot') + " floor " + btn.data('floor') + "" +
                                        "! <input type=\"button\" id=\"logoutButton\" value=\"Logout\"onclick=\"window.location.reload()\"></input</h2>"
                                $('#welcomeMessage').html(message);
                                visibility('freeSpots', 'none');
                                visibility('freeSpotsText', 'none');
                                visibility('freeSpots_wrapper', 'none');
	           			    },
	           			    error: function(data) {
	           			        document.getElementById('errorMessage').innerHTML = "A aparut o eroare!";
	           			    },
	           			    headers: {
	           			        "content-type": "application/json",
	           			        "cache-control": "no-cache"
	           			    },
	           			    beforeSend: function (xhr) {
	   							xhr.setRequestHeader ("Authorization", "Basic " + btoa(user.username + ":" + user.password));
							}
	           			});
	               		debugger; 
	               	});
	               },
	               error: function(data) {
	                   document.getElementById('errorMessage').innerHTML = "A aparut o eroare!";
	               },
	               headers: {
	                   "content-type": "application/json",
	                   "cache-control": "no-cache"
	               },
	               beforeSend: function (xhr) {
	   				xhr.setRequestHeader ("Authorization", "Basic " + btoa(user.username + ":" + user.password));
				}
	           });
			
		}
	}
//
	if (user.hasParking) {
        $('#withParking').load('html/with-parking.html', toggleState);
      
	} else if (user.hasParking == false) {
		$('#withoutParking').load('html/without-parking.html', toggleState);
	}



	return false;

}

function visibility (id, atribute) {
	document.getElementById(id).style.display = atribute;
}

function releaseSubmitButton() {
	var postUser = user.username;
	var isReleased = false;
	$.ajax({
        type: "POST",
        crossDomain: true,
        url: "http://localhost:8080/backend/" + postUser + "/vacancies/assigned",
        success: function(spotsArray) {
        	document.getElementById('releaseValidate').innerHTML = "Locul tau este eliberat!";
        	visibility('releaseButton', 'none');
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
        },
        beforeSend: function (xhr) {
        	xhr.setRequestHeader ("Authorization", "Basic " + btoa(user.username + ":" + user.password));
		}
    });

    visibility('releaseValidate', 'block');
    document.getElementById('releaseValidate').innerHTML = "Locul tau este eliberat!";
    visibility('releaseButton', 'none');
    visibility('releaseIsOk', 'none');

}

function errorMessage() {
	document.getElementById('errorMessage').innerHTML = ""
}