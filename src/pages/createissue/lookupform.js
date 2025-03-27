import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { IssueContext } from '../../contexts/issuecontext';

const LookupForm = ({ onLookupSuccess }) => {
  const { fetchIssue, loading, error } = useContext(IssueContext);
  
  const [lookupId, setLookupId] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleLookupChange = (e) => {
    setLookupId(e.target.value);
  };
  
  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!lookupId.trim() || isNaN(parseInt(lookupId))) {
      setFormError('Please enter a valid issue number');
      return;
    }
    
    const result = await fetchIssue(lookupId);
    
    if (result) {
      onLookupSuccess(result);
    } else {
      setFormError('Issue not found');
    }
  };
  
  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {formError && <Alert variant="danger">{formError}</Alert>}
      
      <Form onSubmit={handleLookupSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Issue Number</Form.Label>
          <Form.Control
            type="text"
            value={lookupId}
            onChange={handleLookupChange}
            placeholder="Enter issue number"
            disabled={loading}
          />
        </Form.Group>
        
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Looking up...' : 'Look Up Issue'}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LookupForm;
