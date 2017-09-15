/*function submitButton(){
	var valueOfUsernameText = document.getElementById("usernameText").value;
	var valueOfPasswordText=document.getElementById("passwordText").value;
	var randomUsername="admin";
	var randomPass="123";
	
	if(valueOfUsernameText==""){
		 emptyUsername();
	} else {
		document.getElementById("withoutUsername").style.display="none";
	}
	
	if(valueOfPasswordText==""){
		emptyPass();
	} else {
		document.getElementById("withoutPass").style.display="none";
	}
	
	if(valueOfUsernameText==randomUsername && valueOfPasswordText==randomPass){
		correctUsernameAndPass();
		}
	else if(valueOfUsernameText!="" && valueOfPasswordText!=""){
		incorectPass();
	}
	
	function emptyUsername(){
		document.getElementById("withoutUsername").innerHTML="Complete the username!";
		document.getElementById("withoutUsername").style.display="block";
		document.getElementById("withoutUsername").style.color="red";
		document.getElementById("isConnect").style.display="none";
	}	
	
	function emptyPass(){
		document.getElementById("withoutPass").innerHTML="Complete the password!";
		document.getElementById("withoutPass").style.display="block";
		document.getElementById("withoutPass").style.color="red";
		document.getElementById("isConnect").style.display="none";
	}
	
	function correctUsernameAndPass(){
		document.getElementById("isConnect").innerHTML="Welcome, you are connected!";
		document.getElementById("isConnect").style.display="block";
		document.getElementById("isConnect").style.fontWeight="bold";
		document.getElementById("isConnect").style.color="green";
		document.getElementById("submitButton").disabled= true;


	}
	
	function incorectPass(){
		document.getElementById("isConnect").innerHTML="Username or password are incorect";
		document.getElementById("isConnect").style.display="block";
		document.getElementById("isConnect").style.color="red";
	}
}
*/

// New One

function loginSubmitButton () {
	loginCheck();
}

function isEmpty (str) {
	if (str.value == "") {
		return true;
	};
}


function loginCheck () {
	var user = document.forms["loginForm"]["fname"];
	var pass = document.forms["loginForm"]["fpass"];
	var pass2 = document.forms["loginForm"]["fpass2"];
	var validUser = "demo";
	var validPass = "demo";

	if (isEmpty(user) || isEmpty(pass)) {
		if (isEmpty(user)) {
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
		if (user.value == validUser && pass.value == validPass) {
			isLogedIn();
		};
	}
}

function onClickPass () {
	document.getElementById('passwordText2').style.display = 'none';
	document.getElementById('passwordText1').style.display = 'block';
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
	document.getElementById('loginAlignment').style.display = 'none';
	document.getElementById('contentAlignment').style.display = 'block';
	document.getElementById('contentAlignment').innerHTML = "<h2>Hello " + document.getElementById('usernameText').value + " !</h2>";
	return true;
}

function isLogedOut () {
	document.getElementById('loginAlignment').style.display = 'block';
	document.getElementById('contentAlignment').style.display = 'none';
}
