<?php
/**
 * API Documentation Page
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Issue API Documentation</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .endpoint {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container my-5">
        <h1 class="mb-4">Issue API Documentation</h1>
        
        <div class="alert alert-info">
            <p>Base URL: <code><?php echo "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']); ?>/api.php</code></p>
        </div>
        
        <div class="endpoint">
            <h2>GET - Retrieve Issues</h2>
            <p>Get all issues with pagination support.</p>
            
            <h4>Parameters:</h4>
            <ul>
                <li><code>page</code> (optional) - Page number (default: 1)</li>
                <li><code>items_per_page</code> (optional) - Number of items per page (default: 100)</li>
            </ul>
            
            <h4>Example:</h4>
            <pre><code>GET /api.php?page=1&items_per_page=100</code></pre>
            
            <h4>Response:</h4>
            <pre><code>{
    "issues": [
        {
            "id": "1",
            "unit": "Unit A",
            "issue": "Issue description",
            "modified_at": "2023-01-01 12:00:00",
            "status": "created"
        },
        ...
    ],
    "pagination": {
        "total_rows": 150,
        "total_pages": 2,
        "current_page": 1,
        "items_per_page": 100
    }
}</code></pre>
        </div>
        
        <div class="endpoint">
            <h2>GET - Retrieve Single Issue</h2>
            <p>Get a single issue by ID.</p>
            
            <h4>Parameters:</h4>
            <ul>
                <li><code>id</code> (required) - Issue ID</li>
            </ul>
            
            <h4>Example:</h4>
            <pre><code>GET /api.php?id=1</code></pre>
            
            <h4>Response:</h4>
            <pre><code>{
    "id": "1",
    "unit": "Unit A",
    "issue": "Issue description",
    "modified_at": "2023-01-01 12:00:00",
    "status": "created"
}</code></pre>
        </div>
        
        <div class="endpoint">
            <h2>POST - Create Issue</h2>
            <p>Create a new issue.</p>
            
            <h4>Request Body:</h4>
            <pre><code>{
    "unit": "Unit A",
    "issue": "Issue description",
    "status": "created" // Optional, defaults to "created"
}</code></pre>
            
            <h4>Example:</h4>
            <pre><code>POST /api.php
Content-Type: application/json

{
    "unit": "Unit A",
    "issue": "Issue description"
}</code></pre>
            
            <h4>Response:</h4>
            <pre><code>{
    "message": "Issue created successfully",
    "id": 1
}</code></pre>
        </div>
        
        <div class="endpoint">
            <h2>PUT - Update Issue</h2>
            <p>Update an existing issue.</p>
            
            <h4>Request Body:</h4>
            <pre><code>{
    "id": 1, // Required
    "unit": "Updated Unit",
    "issue": "Updated description",
    "status": "resolved"
}</code></pre>
            
            <h4>Example:</h4>
            <pre><code>PUT /api.php
Content-Type: application/json

{
    "id": 1,
    "unit": "Updated Unit",
    "issue": "Updated description",
    "status": "resolved"
}</code></pre>
            
            <h4>Response:</h4>
            <pre><code>{
    "message": "Issue updated successfully"
}</code></pre>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
