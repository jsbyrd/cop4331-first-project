const urlBase = 'http://www.cop4331-27.com/LAMPAPI';
const extension = 'php';

let firstName = "";
let lastName = "";
let userId = 0;

function doRegister()
{	
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;

	let tmp = {login:login,password:password,firstName,lastName};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					// document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          console.log("Uh.... something went wrong in Register.js");
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
    console.log("Uh.... something went wrong in Register.php");
		// document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}