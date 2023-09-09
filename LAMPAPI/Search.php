<?php
    $inData = getRequestInfo();
    // Search vars
    $searchResults = "";
	$searchCount = 0;
    // Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
    // Retrieve contact information
	else
	{
        // Attempt to search for relevant contacts
        $stmt = $conn->prepare("select FirstName,LastName,Phone,Email from Contacts where CONCAT_WS(' ',FirstName,LastName) like ? and UserID=?");
		$contactName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $contactName, $inData["userId"]);
		$stmt->execute();
        $result = $stmt->get_result();
        // Collect all contacts that fit criteria
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
            $newClient = array(
                "FirstName" => $row["FirstName"],
                "LastName" => $row["LastName"],
                "Phone" => $row["Phone"],
                "Email" => $row["Email"]);
            $newClient = json_encode($newClient);
			$searchResults .= '' . $newClient . '';
		}
        // Invalid search
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
        // Valid search
		else
		{
			returnWithInfo( $searchResults );
		}
		$stmt->close();
		$conn->close();
	}
    // Helper functions
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
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>