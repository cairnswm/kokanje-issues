import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { IssueContext } from '../../contexts/issuecontext';
import { useLocation } from 'react-router-dom';

const CreateIssueForm = ({ onCreateSuccess }) => {
  const { createIssue, loading, error } = useContext(IssueContext);
  const location = useLocation();

  const [formData, setFormData] = useState({
    unit: '',
    issue: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const unitParam = params.get('unit');
    if (unitParam) {
      setFormData(prev => ({ ...prev, unit: unitParam }));
    }
  }, [location.search]);

  const [formError, setFormError] = useState('');
  
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
      onCreateSuccess(result.id);
      setFormData({
        unit: '',
        issue: ''
      });
    }
  };
  
  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {formError && <Alert variant="danger">{formError}</Alert>}
      
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
        </div>
      </Form>
    </>
  );
};

export default CreateIssueForm;
