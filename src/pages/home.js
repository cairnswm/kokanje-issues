import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IssueContext } from '../contexts/issuecontext';

const Home = () => {
  const { createIssue, loading, error } = useContext(IssueContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    unit: '',
    issue: ''
  });
  
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  
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
    
    // Submit the form
    const result = await createIssue(formData);
    
    if (result) {
      setSuccess(true);
      setFormData({
        unit: '',
        issue: ''
      });
      
      // Redirect to the list page after a short delay
      setTimeout(() => {
        navigate('/list');
      }, 2000);
    }
  };
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h2>Create New Issue</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {formError && <Alert variant="danger">{formError}</Alert>}
              {success && <Alert variant="success">Issue created successfully! Redirecting to issues list...</Alert>}
              
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
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Issue'}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/list')}
                    disabled={loading}
                  >
                    View All Issues
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

export default Home;
