<?php
require_once 'dbconfig.php';
// Get database connection
$database = new Database();
$conn = $database->getConnection();

// Get parameters
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$date = isset($_GET['date']) ? $_GET['date'] : null;
$modified = isset($_GET['modified']) ? $_GET['modified'] : null;

// Validate parameters
if (!$id && !$date && !$modified) {
    http_response_code(400);
    echo json_encode(["error" => "At least one parameter (id, date, or modified) is required."]);
    exit;
}

// Build query
$query = "SELECT id, unit, issue, issue_number, created_at, modified_at, status FROM issue WHERE 1=1";
$params = [];
$types = "";

if ($id) {
    $query .= " AND id > ?";
    $params[] = $id;
    $types .= "i";
}

if ($date) {
    $query .= " AND created_at > ?";
    $params[] = $date;
    $types .= "s";
}

if ($modified) {
    $query .= " AND modified_at > ?";
    $params[] = $modified;
    $types .= "s";
}

$query .= " ORDER BY id ASC";

// Prepare and execute statement
$stmt = $conn->prepare($query);
if ($types) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $unit, $issue, $issue_number, $created_at, $modified_at, $status);

// Fetch results
$issues = [];
while ($stmt->fetch()) {
    $issues[] = [
        'id' => $id,
        'unit' => $unit,
        'issue' => $issue,
        'issue_number' => $issue_number,
        'created_at' => $created_at,
        'modified_at' => $modified_at,
        'status' => $status
    ];
}

// Return results
header('Content-Type: application/json');
echo json_encode($issues);