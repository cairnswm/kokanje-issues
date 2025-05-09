# Kokanje Issue Management System

Kokanje is a simple web-based issue management system. It lets you create, view, and update issues easily. You can use it to keep track of problems or tasks in your organization or project.

## Pages Overview

### API Documentation (index.php)
This page explains how the system's backend works. It shows how other programs or developers can connect to Kokanje to get, add, or update issues. Most users do not need to use this page.

### Main Application Pages

- **Home Page (Create Issue)**: When you open Kokanje, you see a form to create a new issue. Fill in the details and submit to add a new issue. After submitting, you get an issue number to keep for reference. You can also look up an existing issue by its number.
- **Issues List (/list)**: This page shows all the issues that have been created. You can search, filter, sort, and export the list. You can also click to edit any issue.
- **Edit Issue (/edit/:id)**: This page lets you update the details or status of an existing issue. You get here by clicking 'Edit' on the issues list.

## Technical Explanation

Kokanje uses a React frontend with React-Bootstrap for UI and a PHP backend for the API. All data fetching and updates are handled in a React Context (`IssueContext`). Components use context to access and update issue data. The backend exposes RESTful endpoints for issue management, and the frontend interacts with these endpoints using fetch calls inside context methods. The project is set up with Webpack for development and production builds.

## Features

- React 18
- Webpack 5
- Bootstrap 5
- React-Bootstrap
- Context API for state management
- Development server with hot reloading
- Production build optimization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm start
```

This will open the application in your default browser at http://localhost:3000.

### Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

## Project Structure

- `public/` - Static files and HTML template
- `src/` - React application source code
- `dist/` - Production build output
- `webpack.config.js` - Webpack configuration
