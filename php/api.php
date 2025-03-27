<?php
/**
 * API endpoint for issue management
 */

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and issue files
include_once 'dbconfig.php';
include_once 'issue.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Create issue object
$issue = new Issue($db);

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on HTTP method
switch ($method) {
    case 'GET':
        handleGetRequest($issue);
        break;
    case 'POST':
        handlePostRequest($issue);
        break;
    case 'PUT':
        handlePutRequest($issue);
        break;
    case 'OPTIONS':
        // Handle preflight requests
        http_response_code(200);
        exit(0);
        break;
    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

/**
 * Handle GET requests
 * @param Issue $issue Issue object
 */
function handleGetRequest($issue) {
    // Check if ID is provided
    if (isset($_GET['id'])) {
        // Get single issue
        $id = intval($_GET['id']);
        $result = $issue->getIssue($id);
        
        if ($result) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Issue not found"]);
        }
    } else {
        // Get all issues with pagination
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $items_per_page = isset($_GET['items_per_page']) ? intval($_GET['items_per_page']) : 100;
        
        // Validate pagination parameters
        if ($page < 1) $page = 1;
        if ($items_per_page < 1 || $items_per_page > 1000) $items_per_page = 100;
        
        $result = $issue->getIssues($page, $items_per_page);
        
        http_response_code(200);
        echo json_encode($result);
    }
}

/**
 * Handle POST requests
 * @param Issue $issue Issue object
 */
function handlePostRequest($issue) {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Check if data is complete
    if (
        !empty($data->unit) &&
        !empty($data->issue)
    ) {
        // Set issue properties
        $issue->unit = $data->unit;
        $issue->issue = $data->issue;
        $issue->status = !empty($data->status) ? $data->status : "created";
        
        // Create the issue
        if ($issue->create()) {
            http_response_code(201);
            echo json_encode([
                "message" => "Issue created successfully",
                "id" => $issue->id
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create issue"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create issue. Data is incomplete"]);
    }
}

/**
 * Handle PUT requests
 * @param Issue $issue Issue object
 */
function handlePutRequest($issue) {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Check if ID is provided
    if (!empty($data->id)) {
        // Set issue properties
        $issue->id = $data->id;
        $issue->unit = $data->unit ?? "";
        $issue->issue = $data->issue ?? "";
        $issue->status = $data->status ?? "";
        
        // Update the issue
        if ($issue->update()) {
            http_response_code(200);
            echo json_encode(["message" => "Issue updated successfully"]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update issue"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update issue. No ID provided"]);
    }
}
?>
