<?php
    $inData = getRequestInfo();
    // Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
    // Delete account
    else
    {
        // Acquire vars
        $id = $inData['id'];
        // Attempt to delete from database
        $sql = "DELETE FROM Contacts WHERE ID=$id";
        if ($conn->query($sql) == TRUE)
        {
            returnWithInfo($id);
        }
        else
        {
            returnWithError("Unable to delete contact");
        }
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
		$retValue = '{"ID":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
    function returnWithInfo($id)
	{
		$retValue = '{"ID":"' . $id . '","error":"NONE"}';
		sendResultInfoAsJson($retValue);
	}
?>