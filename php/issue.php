<?php
/**
 * Issue class for handling issue-related operations
 */
class Issue {
    private $conn;
    private $table_name = "issue";
    
    public $id;
    public $unit;
    public $issue;
    public $issue_number;
    public $modified_at;
    public $status;
    
    /**
     * Constructor with database connection
     * @param mysqli $db Database connection
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get issues with pagination
     * @param int $page Page number
     * @param int $items_per_page Number of items per page
     * @return array Array of issues
     */
    public function getIssues($page = 1, $items_per_page = 100) {
        // Calculate offset
        $offset = ($page - 1) * $items_per_page;
        
        // Query with pagination
        $query = "SELECT id, unit, issue, issue_number, created_at, modified_at, status 
                 FROM " . $this->table_name . " 
                 ORDER BY modified_at DESC 
                 LIMIT ?, ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $offset, $items_per_page);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Get total count for pagination info
        $count_query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $count_result = $this->conn->query($count_query);
        $total_rows = $count_result->fetch_assoc()['total'];
        $total_pages = ceil($total_rows / $items_per_page);
        
        // Fetch results
        $issues = [];
        while ($row = $result->fetch_assoc()) {
            $issues[] = $row;
        }
        
        // Return issues with pagination info
        return [
            "issues" => $issues,
            "pagination" => [
                "total_rows" => $total_rows,
                "total_pages" => $total_pages,
                "current_page" => $page,
                "items_per_page" => $items_per_page
            ]
        ];
    }
    
    /**
     * Get a single issue by ID
     * @param int $id Issue ID
     * @return array|null Issue data or null if not found
     */
    public function getIssue($id) {
        $query = "SELECT id, unit, issue, issue_number, modified_at, status 
                 FROM " . $this->table_name . " 
                 WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        // Execute query
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return null;
    }
    
    /**
     * Create a new issue
     * @return bool True if created successfully, false otherwise
     */
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (unit, issue, issue_number, status) 
                VALUES (?, ?, ?, ?)";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->unit = htmlspecialchars(strip_tags($this->unit));
        $this->issue = htmlspecialchars(strip_tags($this->issue));
        $this->issue_number = htmlspecialchars(strip_tags($this->issue_number));
        $this->status = htmlspecialchars(strip_tags($this->status));
        
        // Bind parameters
        $stmt->bind_param("ssss", $this->unit, $this->issue, $this->issue_number, $this->status);
        
        // Execute query
        if ($stmt->execute()) {
            $this->id = $this->conn->insert_id;
            return true;
        }
        
        return false;
    }
    
    /**
     * Update an existing issue
     * @return bool True if updated successfully, false otherwise
     */
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET unit = ?, issue = ?, issue_number = ?, status = ?, modified_at = CURRENT_TIMESTAMP 
                WHERE id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->unit = htmlspecialchars(strip_tags($this->unit));
        $this->issue = htmlspecialchars(strip_tags($this->issue));
        $this->issue_number = htmlspecialchars(strip_tags($this->issue_number));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind parameters
        $stmt->bind_param("ssssi", $this->unit, $this->issue, $this->issue_number, $this->status, $this->id);
        
        // Execute query
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>
