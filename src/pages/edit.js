import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { IssueContext } from '../contexts/issuecontext';
import { accessElf } from '../functions/accessElf';

const Edit = () => {
  const { fetchIssue, updateIssue, loading, error } = useContext(IssueContext);
  const navigate = useNavigate();
  const { id } = useParams();

  accessElf.track("create issue");
  
  const [formData, setFormData] = useState({
    id: '',
    unit: '',
    issue: '',
    status: ''
  });
  
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Status options
  const statusOptions = ['created', 'in progress', 'resolved', 'closed'];
  
  useEffect(() => {
    const loadIssue = async () => {
      setIsLoading(true);
      const issue = await fetchIssue(id);
      
      if (issue) {
        setFormData({
          id: issue.id,
          unit: issue.unit,
          issue: issue.issue,
          status: issue.status
        });
      } else {
        setFormError('Issue not found');
      }
      
      setIsLoading(false);
    };
    
    loadIssue();
  }, [fetchIssue, id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);
    
    // Validate form
    if (!formData.unit.trim()) {
      setFormError('Unit is required');
      return;
    }
    
    if (!formData.issue.trim()) {
      setFormError('Issue description is required');
      return;
    }
    
    if (!formData.status.trim()) {
      setFormError('Status is required');
      return;
    }
    
    // Submit the form
    const result = await updateIssue(formData);
    
    if (result) {
      setSuccess(true);
      
      // Redirect to the list page after a short delay
      setTimeout(() => {
        navigate('/list');
      }, 2000);
    }
  };
  
  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h2>Edit Issue #{id}</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {formError && <Alert variant="danger">{formError}</Alert>}
              {success && <Alert variant="success">Issue updated successfully! Redirecting to issues list...</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Enter unit"
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Issue Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    placeholder="Describe the issue"
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="warning" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Issue'}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/list')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Edit;
