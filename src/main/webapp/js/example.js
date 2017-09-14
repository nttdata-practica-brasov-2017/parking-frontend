function submitButton(){
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
