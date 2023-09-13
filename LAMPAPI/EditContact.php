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
		$id = $inData['id'];
		$sql = "UPDATE Contacts SET firstName = '$firstName', lastName = '$lastName', Phone = '$Phone', Email = '$Email' WHERE ID = $id";
		if ($conn->query($sql) == TRUE)
		{
			returnWithInfo($id, $firstName, $lastName, $Phone, $Email);
		}
		//Otherwise, edit the contact's information
		else
		{
			returnWithError("Unable to update contact");
		}

		$conn->close();
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

	function returnWithInfo($id, $firstName, $lastName, $Phone, $Email)
	{
		$retValue = '{"id":"' . $id . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","Phone":"' 
		. $Phone . '","Email":"' . $Email . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>