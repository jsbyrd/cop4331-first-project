const urlBase = 'http://www.cop4331-27.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;
	console.log(url);

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
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

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
	
				window.location.href = "login.html";
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

function doAddContact()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let contactFirstName = document.getElementById("contactTextFirst").value;
	let contactLastName = document.getElementById("contactTextLast").value;
	let phoneNumber = document.getElementById("contactTextNumber").value;
	let email = document.getElementById("contactTextEmail").value;
	phoneNumber = removeDashesAndConvertToNumber(phoneNumber);

	readCookie();
	
	console.log(contactFirstName + " " + contactLastName + " "  + phoneNumber + " " + email + " " + userId);
	// document.getElementById("loginResult").innerHTML = "";

	let tmp = {firstName:contactFirstName,lastName:contactLastName,Phone:phoneNumber,Email:email, userId: userId};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/CreateContact.' + extension;
	console.log(url);

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

				console.log(userId);
		
				if( userId >= 0 )
				{		
					document.getElementById("createResult").innerHTML = "Contact succesfully added!";
				}
				if (userId < 0)
				{
					document.getElementById("createResult").innerHTML = "unable to add contact";
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function removeDashesAndConvertToNumber(inputText) {
	// Remove dashes from the input text
	const textWithoutDashes = inputText.replace(/-/g, '');
  
	// Convert the text to a number
	const resultNumber = parseFloat(textWithoutDashes);
  
	return isNaN(resultNumber) ? null : resultNumber;
  }

function doDeleteContact(id)
{
	console.log("delete" + id);

	let warning = window.confirm('Are you sure you want to delete this contact?');
    if(!warning){
        return;
		}
	//turns id into json object
	let tmp = {id:id};
	let jsonPayload = JSON.stringify( tmp );

	//access json php
	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{

				console.log("Contact has been deleted");
				
				// refresh page
				doSearchContact(null);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function doSearchContact(event) {

if (event != null) {
  event.preventDefault();
}

  // Remove previously searched contacts
  let contactsTable = document.getElementById("tbody");
  let rowCount = contactsTable.rows.length;
  for (let i = 0; i < rowCount; i++) {
    contactsTable.deleteRow(0);
  }

	let search = document.getElementById("query").value;
	// Get userId from cookie
	readCookie();

	let tmp = {search:search,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				jsonObject = JSON.parse( xhr.responseText );
				if (jsonObject.results === undefined) return;

        let contactRow;
        let firstNameCell;
        let lastNameCell;
        let emailCell;
        let phoneCell;
		let updateCell;
        let deleteCell;
		let id;

				for( let i=0; i<jsonObject.results.length; i++ )
				{
          // Get contact info
          let contactResultObject = jsonObject.results[i];
          // Create new table row
					contactRow = contactsTable.insertRow(-1);
          // Create new cells
          firstNameCell = contactRow.insertCell(0);
          lastNameCell = contactRow.insertCell(1);
          emailCell = contactRow.insertCell(2);
          phoneCell = contactRow.insertCell(3);
		  updateCell = contactRow.insertCell(4);
		  deleteCell = contactRow.insertCell(5);
          // Insert corresponding text into cells;
          firstNameCell.innerHTML = contactResultObject.FirstName;
          lastNameCell.innerHTML = contactResultObject.LastName;
          emailCell.innerHTML = contactResultObject.Email;
          phoneCell.innerHTML = contactResultObject.Phone;
		  id = contactResultObject.ID;
		  console.log(id);
		  
		  var editImage = document.createElement('img');
		  editImage.src = 'images/edit.png'; // Set the image source
		  editImage.alt = 'Image Alt Text'; 

		  let updateButton = document.createElement('button');
		  updateButton.setAttribute('type','button');
		  updateButton.appendChild(editImage);
		  updateButton.classList.add('updateButton');
		  updateCell.appendChild(updateButton);

		  var trashImage = document.createElement('img');
		  trashImage.src = 'images/trash.png'; // Set the image source
		  trashImage.alt = 'Image Alt Text'; 

		  let deleteButton = document.createElement('button');
		  deleteButton.setAttribute('type','button');
		  deleteButton.setAttribute('data-hidden-value', id);
		  deleteButton.appendChild(trashImage);
		  deleteButton.classList.add('deleteButton');

		  deleteButton.addEventListener('click', function(event) {
			// Prevent the click event from propagating to other elements (e.g., the search button)
			event.stopPropagation();

			const id = deleteButton.getAttribute('data-hidden-value');
			console.log("button value" + id);
			doDeleteContact(id);
		
		});

		  deleteCell.appendChild(deleteButton);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}
