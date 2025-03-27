import React, { useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IssueContext } from "../contexts/issuecontext";

const List = () => {
  const { 
    issues, 
    allIssues, 
    loading, 
    error, 
    pagination, 
    filters, 
    sorting,
    updateFilters, 
    resetFilters,
    updateSorting,
    fetchIssues 
  } = useContext(IssueContext);
  const navigate = useNavigate();

  // Get unique units for filter dropdown
  const uniqueUnits = [...new Set(allIssues.map((issue) => issue.unit))];

  // Status options
  const statusOptions = ["created", "in progress", "resolved", "closed"];

  useEffect(() => {
    // Fetch issues when component mounts
    fetchIssues(1, pagination.itemsPerPage);
  }, [fetchIssues, pagination.itemsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({
      [name]: value,
    });
  };

  const handlePageChange = (page) => {
    // Just update the pagination page
    // The filtering is handled in the context
    fetchIssues(page, pagination.itemsPerPage);
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    // Fetch issues with the new page size
    fetchIssues(1, newPageSize);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === pagination.currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-secondary text-white text-center pb-5">
              <h1>Kokanje</h1>
            </Card.Header>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h2>Issues List</h2>
              <Button variant="light" onClick={() => navigate("/")}>
                Create New Issue
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Filters */}
              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Filter by Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Filter by Unit</Form.Label>
                    <Form.Select
                      name="unit"
                      value={filters.unit}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Units</option>
                      {uniqueUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <div className="d-grid gap-2 w-100">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        resetFilters();
                        fetchIssues(1, pagination.itemsPerPage);
                      }}
                      disabled={loading}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Error message */}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* Loading spinner */}
              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  {/* Issues table */}
                  {issues.length > 0 ? (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th 
                            onClick={() => updateSorting('id')}
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            ID {sorting.field === 'id' && (
                              <span>{sorting.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </th>
                          <th 
                            onClick={() => updateSorting('unit')}
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            Unit {sorting.field === 'unit' && (
                              <span>{sorting.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </th>
                          <th 
                            onClick={() => updateSorting('issue')}
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            Issue {sorting.field === 'issue' && (
                              <span>{sorting.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </th>
                          <th 
                            onClick={() => updateSorting('status')}
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            Status {sorting.field === 'status' && (
                              <span>{sorting.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </th>
                          <th 
                            onClick={() => updateSorting('created_at')}
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            Created {sorting.field === 'created_at' && (
                              <span>{sorting.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </th>
                          <th 
                            onClick={() => updateSorting('modified_at')}
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            Last Modified {sorting.field === 'modified_at' && (
                              <span>{sorting.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map((issue) => (
                          <tr key={issue.id}>
                            <td>{issue.id}</td>
                            <td>{issue.unit}</td>
                            <td>
                              {issue.issue.length > 100
                                ? `${issue.issue.substring(0, 100)}...`
                                : issue.issue}
                            </td>
                            <td>
                              <span
                                className={`badge bg-${
                                  issue.status === "created"
                                    ? "secondary"
                                    : issue.status === "in progress"
                                    ? "primary"
                                    : issue.status === "resolved"
                                    ? "success"
                                    : "dark"
                                }`}
                              >
                                {issue.status}
                              </span>
                            </td>
                            <td>
                              {new Date(issue.created_at).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td>
                              {new Date(issue.modified_at).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEdit(issue.id)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">No issues found.</Alert>
                  )}

                  {/* Pagination and Page Size Controls */}
                  {issues.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <Form.Group className="d-flex align-items-center">
                        <Form.Label className="me-2 mb-0">Items per page:</Form.Label>
                        <Form.Select 
                          style={{ width: 'auto' }}
                          value={pagination.itemsPerPage}
                          onChange={handlePageSizeChange}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </Form.Select>
                      </Form.Group>
                      <Pagination>
                        <Pagination.First
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.currentPage === 1}
                        />
                        <Pagination.Prev
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                        />

                        {paginationItems}

                        <Pagination.Next
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                        />
                        <Pagination.Last
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default List;
