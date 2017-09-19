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
			//document.getElementById('usernameText').style.color = "red";
			//document.getElementById('pUsername').style.color = "red";
			document.getElementById('submitButton').style.backgroundColor = "red";
			document.getElementById('usernameText').onclick = onClickUser;
	
			//2nd version
			setColorAndDisplay('usernameText', 'red', undefined);
			setColorAndDisplay('pUsername', 'red', undefined);
		};
	
		if (isEmpty(pass)) {
			pass2.value = "Acest camp trebuie completat!";
			//document.getElementById('passwordText1').style.display = 'none';
			//document.getElementById('passwordText2').style.display = 'block';
			//document.getElementById('passwordText2').style.color = "red";
			document.getElementById('pPassword').style.color = "red";
			document.getElementById('submitButton').style.backgroundColor = "red";
			document.getElementById('passwordText2').onclick = onClickPass;
	
			//2nd version
			setColorAndDisplay('passwordText1', undefined, 'none');
			setColorAndDisplay('passwordText2', 'red', 'block');
			setColorAndDisplay('pPassword', 'red', undefined);
		};
	} else {
        var url = 'http://localhost:8080/backend/login';
        var data = {username:inputUsername.value, password: pass.value};
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
			},
			headers: {
                "content-type": "application/json",
                "cache-control": "no-cache"
            }
        });

		/*
		if (user.value == validUser && pass.value == validPass) {

		} else {
			document.getElementById('errorMessage').innerHTML = "User sau parola incorcta!";
		}
		*/
	}
}

function onClickPass () {
	//document.getElementById('passwordText2').style.display = 'none';
	//document.getElementById('passwordText1').style.display = 'block';
	visibility('passwordText1', 'block');
	visibility('passwordText2', 'none');

	document.getElementById('passwordText1').focus();
	document.getElementById('pPassword').style.color = "black";
	document.getElementById('submitButton').style.backgroundColor = "transparent";
}

function onClickUser () {
	document.getElementById('usernameText').value = "";
	document.getElementById('usernameText').style.color = "black";
	document.getElementById('pUsername').style.color = "black";
	document.getElementById('submitButton').style.backgroundColor = "transparent";
}

function setColorAndDisplay (id, color, display) {
	document.getElementById(id).style.color = color;
	document.getElementById(id).style.display = display;
}

function isLogedIn () {
	visibility('loginAlignment', 'none');
	visibility('contentAlignment', 'block');

	// TODO at a later point:  create generic functions
	// show('loginAlignment');
	// hide('contentAlignment');



	
/*
	var user = {};
	user.name = 'Ioana';
	user.hasParking = false;
*/	
	var str = "<h2 class=\"white\">Hello " + user.name + " ! <input type=\"button\" id=\"logoutButton\" value=\"Logout\"onclick=\"isLogedOut();\"></input></h2>";
	$('#welcomeMessage').html(str);
	
	// TODO 
	// show hide/content based on user.hasParking s
	function toggleState() {
		if (user.hasParking) {
			$('#withoutParking').hide();
	        $('#withParking').show();

	        $(document).ready(function() {
    			$('#claimButton').DataTable();
			} );
		} else if (user.hasParking == false) {
			$('#withoutParking').show();
	        $('#withParking').hide();

		}
	}

	if (user.hasParking) {
        $('#withParking').load('html/with-parking.html', toggleState);
	} else if (user.hasParking == false) {
		$('#withoutParking').load('html/without-parking.html', toggleState);
	}



	return false;

}

function isLogedOut () {
	visibility('loginAlignment', 'block');
	visibility('contentAlignment', 'none');

	document.getElementById('usernameText').value = "";
	document.getElementById('passwordText1').value = "";
	
}

function visibility (id, atribute) {
	document.getElementById(id).style.display = atribute;
}
