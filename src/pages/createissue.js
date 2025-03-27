import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CreateIssueForm from './createissue/createissueform';
import LookupForm from './createissue/lookupform';
import SuccessMessage from './createissue/successmessage';
import IssueDetails from './createissue/issuedetails';

const CreateIssue = () => {
  const navigate = useNavigate();
  
  const [success, setSuccess] = useState(false);
  const [issueId, setIssueId] = useState('');
  const [showLookupForm, setShowLookupForm] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  
  const toggleLookupForm = () => {
    setShowLookupForm(!showLookupForm);
    setLookupResult(null);
  };
  
  // If we have a successful submission, show the thank you page
  if (success) {
    return (
      <SuccessMessage 
        issueId={issueId} 
        onCreateAnother={() => {
          setSuccess(false);
          setIssueId('');
        }}
        onLookupIssue={() => {
          setSuccess(false);
          setIssueId('');
          setShowLookupForm(true);
        }}
      />
    );
  }
  
  // If we have a lookup result, show the issue details
  if (lookupResult) {
    return (
      <IssueDetails 
        lookupResult={lookupResult} 
        onBack={() => {
          setLookupResult(null);
        }}
      />
    );
  }
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-secondary text-white text-center pb-5"><h1>Kokanje</h1>
            </Card.Header>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h2>{showLookupForm ? 'Look Up Issue' : 'Create New Issue'}</h2>
              <Button 
                variant="light" 
                size="sm" 
                onClick={toggleLookupForm}
              >
                {showLookupForm ? 'Create New Issue' : 'I have an issue number'}
              </Button>
            </Card.Header>
            <Card.Body>
              {showLookupForm ? (
                <LookupForm 
                  onLookupSuccess={setLookupResult}
                />
              ) : (
                <CreateIssueForm 
                  onCreateSuccess={(id) => {
                    setSuccess(true);
                    setIssueId(id);
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateIssue;
