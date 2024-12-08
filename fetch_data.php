<?php
$api_url = "https://jsonplaceholder.typicode.com/users";

try {
    $response = file_get_contents($api_url);
    if ($response === FALSE) {
        throw new Exception("Unable to fetch data from the API.");
    }
    header('Content-Type: application/json');
    echo $response;
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
