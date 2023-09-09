<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		// Acquire variables
		$firstName = $inData['firstName'];
		$lastName = $inData['lastName'];
		$Phone = $inData["Phone"];
		$Email = $inData["Email"];
		$userId = $inData["userId"];
		// Check if account already exists
		$stmt = $conn->prepare("SELECT ID FROM Contacts WHERE firstName =? AND lastName =? AND Phone =? AND Email =? AND userId =?");
		$stmt->bind_param("sssss", $firstName, $lastName, $Phone, $Email, $userId);
		$stmt->execute();
		$result = $stmt->get_result();
		if ( $row = $result->fetch_assoc() )
		{
			returnWithError("Account already exists");
		}
		//Otherwise, add account to database
		else
		{
			//Attempt to insert into database
			$sql = "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES ('$firstName', '$lastName', '$Phone', '$Email', '$userId')";
			if($conn->query($sql) == TRUE)
			{
				returnWithInfo($firstName, $lastName, $Phone, $Email, $userId);
			}
			else
			{
				returnWithError("Account could not be created");
			}
		}
		$stmt->close();
		$conn->close();
		returnWithError("");
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($firstName, $lastName, $Phone, $Email, $userId)
	{
		$retValue = '{"id":0,"firstName":"' . $firstName . '","lastName":"' . $lastName .
			'","Phone":"' . $Phone . '","Email":"' . $Email . '","userId":"' . $userId . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>