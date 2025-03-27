import React from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';

const SuccessMessage = ({ issueId, onCreateAnother, onLookupIssue }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h2>Thank You!</h2>
            </Card.Header>
            <Card.Body className="text-center">
              <Alert variant="success">
                <h4>Your issue has been created successfully!</h4>
                <p className="mt-3">Your issue ID is: <strong>{issueId}</strong></p>
                <p>Please keep this number for your reference.</p>
              </Alert>
              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="primary" 
                  onClick={onCreateAnother}
                  className="mb-2"
                >
                  Create Another Issue
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={onLookupIssue}
                >
                  Lookup an Issue
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessMessage;
