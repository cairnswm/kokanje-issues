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

// Get HTTP method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : (isset($_SERVER['ORIG_PATH_INFO']) ? $_SERVER['ORIG_PATH_INFO'] : '');

// Process based on HTTP method
switch ($method) {
    case 'GET':
        handleGetRequest($issue);
        break;
    case 'POST':
        handlePostRequest($issue);
        break;
    case 'PUT':
        // Extract ID from /{id} in path
        $id = null;
        if (preg_match('#^/([0-9]+)$#', $path, $matches)) {
            $id = intval($matches[1]);
        }
        handlePutRequest($issue, $id);
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
    $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : (isset($_SERVER['ORIG_PATH_INFO']) ? $_SERVER['ORIG_PATH_INFO'] : '');
    $id = null;
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
    } elseif (preg_match('#^/([0-9]+)$#', $path, $matches)) {
        $id = intval($matches[1]);
    }
    if ($id !== null) {
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
        !empty($data->issue) &&
        !empty($data->issue_number)
    ) {
        // Set issue properties
        $issue->unit = $data->unit;
        $issue->issue = $data->issue;
        $issue->issue_number = $data->issue_number;
        $issue->status = !empty($data->status) ? $data->status : "created";
        
        // Create the issue
        if ($issue->create()) {
            http_response_code(201);
            echo json_encode([
                "message" => "Issue created successfully",
                "id" => $issue->id,
                "issue_number" => $issue->issue_number
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
 * @param int|null $id Issue ID from path
 */
function handlePutRequest($issue, $id = null) {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Check if ID is provided
    if ($id !== null) {
        $issue->id = $id;
    } else if (!empty($data->id)) {
        $issue->id = $data->id;
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update issue. No ID provided"]);
        return;
    }
    
    // Set issue properties
    $issue->unit = $data->unit ?? "";
    $issue->issue = $data->issue ?? "";
    $issue->issue_number = $data->issue_number ?? "";
    $issue->status = $data->status ?? "";
    
    // Update the issue
    if ($issue->update()) {
        http_response_code(200);
        echo json_encode(["message" => "Issue updated successfully"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update issue"]);
    }
}
?>
