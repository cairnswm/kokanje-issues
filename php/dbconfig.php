<?php
/**
 * Database configuration
 */
class Database {
    private $host = "cairns.co.za";
    private $db_name = "cairnsco_kokanje";
    private $username = "cairnsco_kokanje";
    private $password = "cairnsco_kokanje";
    private $conn = null;
    
    /**
     * Get database connection
     * @return mysqli|null Database connection
     */
    public function getConnection() {
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            return $this->conn;
        } catch (Exception $e) {
            echo "Database connection error: " . $e->getMessage();
            return null;
        }
    }
}
?>
