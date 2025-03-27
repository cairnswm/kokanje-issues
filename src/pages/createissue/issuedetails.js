import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const IssueDetails = ({ lookupResult, onBack }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h2>Issue Details</h2>
            </Card.Header>
            <Card.Body>
              <dl className="row">
                <dt className="col-sm-3">Issue ID:</dt>
                <dd className="col-sm-9">{lookupResult.id}</dd>
                
                <dt className="col-sm-3">Unit:</dt>
                <dd className="col-sm-9">{lookupResult.unit}</dd>
                
                <dt className="col-sm-3">Description:</dt>
                <dd className="col-sm-9">{lookupResult.issue}</dd>
                
                <dt className="col-sm-3">Status:</dt>
                <dd className="col-sm-9">{lookupResult.status}</dd>
                
                <dt className="col-sm-3">Last Updated:</dt>
                <dd className="col-sm-9">{new Date(lookupResult.modified_at).toLocaleString()}</dd>
              </dl>
              
              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  onClick={onBack}
                >
                  Back to Create Issue
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default IssueDetails;
