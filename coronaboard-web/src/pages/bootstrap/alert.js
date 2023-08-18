import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Container } from 'react-bootstrap';

const AlertPage = () => {
  return (
    <Container className="pt-3">
      <Alert variant="primary">Primary</Alert>
      <Alert variant="danger">Danger</Alert>
    </Container>
  );
};

export default AlertPage;
