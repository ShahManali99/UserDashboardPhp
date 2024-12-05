<?php
$api_url = 'https://jsonplaceholder.typicode.com/users';

$response = file_get_contents($api_url);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch data from API']);
} else {
    header('Content-Type: application/json');
    echo $response;
}