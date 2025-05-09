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
        <p>This API lets you manage issues in a system. You can view, create, and update issues using the routes below. Each route uses a different HTTP method. If you are new to APIs, think of these as different ways to interact with the system:</p>
        <ul>
            <li><strong>GET</strong>: Used to <b>read</b> or <b>view</b> information.</li>
            <li><strong>POST</strong>: Used to <b>create</b> something new.</li>
            <li><strong>PUT</strong>: Used to <b>update</b> something that already exists.</li>
        </ul>
        <p>Below are examples for each route. You can use tools like <a href="https://www.postman.com/" target="_blank">Postman</a> or browser extensions like <b>REST Client</b> to try these out.</p>
        <div class="alert alert-info">
            <p>Base URL: <code><?php echo "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']); ?>/api.php</code></p>
        </div>
        <div class="endpoint">
            <h2>GET - View All Issues</h2>
            <p><b>What it does:</b> Shows a list of all issues. You can use this to see everything in the system.</p>
            <p><b>How to use:</b> Open your browser and go to:</p>
            <pre><code>GET /api.php?page=1&items_per_page=100</code></pre>
            <p>You can change the page number or how many items you want to see at once.</p>
            <h4>Response Example:</h4>
            <pre><code>{
    "issues": [
        {
            "id": "1",
            "issue_number": "1001",
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
            <h2>GET - View a Single Issue</h2>
            <p><b>What it does:</b> Shows details for one specific issue.</p>
            <p><b>How to use:</b> In your browser, go to:</p>
            <pre><code>GET /api.php?id=1</code></pre>
            <p>Replace <code>1</code> with the ID of the issue you want to see.</p>
            <h4>Response Example:</h4>
            <pre><code>{
    "id": "1",
    "issue_number": "1001",
    "unit": "Unit A",
    "issue": "Issue description",
    "modified_at": "2023-01-01 12:00:00",
    "status": "created"
}</code></pre>
        </div>
        <div class="endpoint">
            <h2>POST - Create a New Issue</h2>
            <p><b>What it does:</b> Adds a new issue to the system.</p>
            <p><b>How to use:</b> You need a tool like Postman or REST Client. Set the method to <b>POST</b>, the URL to <code>/api.php</code>, and the body to JSON like this:</p>
            <pre><code>{
    "unit": "Unit A",
    "issue": "Describe the problem here"
}</code></pre>
            <p>Click send. If successful, you will get a message and the new issue's ID.</p>
            <h4>Response Example:</h4>
            <pre><code>{
    "message": "Issue created successfully",
    "id": 1
}</code></pre>
        </div>
        <div class="endpoint">
            <h2>PUT - Update an Existing Issue</h2>
            <p><b>What it does:</b> Changes the details of an existing issue.</p>
            <p><b>How to use:</b> Use a tool like Postman. Set the method to <b>PUT</b>, the URL to <code>/api.php/1</code> (replace <code>1</code> with the issue's ID), and the body to JSON like this:</p>
            <pre><code>{
    "unit": "Updated Unit",
    "issue": "Updated description",
    "status": "resolved"
}</code></pre>
            <p>Click send. If successful, you will get a confirmation message.</p>
            <h4>Response Example:</h4>
            <pre><code>{
    "message": "Issue updated successfully"
}</code></pre>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
