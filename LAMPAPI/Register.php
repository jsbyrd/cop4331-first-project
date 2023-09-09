<?php
    $inData = getRequestInfo();
    // Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
    // Complete registration
	else
	{
		// Aquire vars
		$login = $inData['login'];
		$password = $inData['password'];
		$firstName = $inData['firstName'];
		$lastName = $inData['lastName'];
		// Check if account already exists
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();
		// Account already exists
		if($row = $result->fetch_assoc())
		{
			returnWithError("Account already exists");
		}
		else
		{
			// Attempt to insert into database
			$sql = "INSERT INTO Users (Login, Password, FirstName, LastName) VALUES ('$login', 
				   '$password', '$firstName', '$lastName')";
			if ($conn->query($sql) == TRUE)
			{
				returnWithInfo($login, $password, $firstName, $lastName);
			}
			else
			{
				returnWithError("Account could not be created");
			}
		}
		$stmt->close();
		$conn->close();
	}
	// Helper functions
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	function returnWithInfo($login, $password, $firstName, $lastName)
	{
		$retValue = '{"login":"' . $login . '","password":"' . $password . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":"NONE"}';
		sendResultInfoAsJson($retValue);
	}
?>