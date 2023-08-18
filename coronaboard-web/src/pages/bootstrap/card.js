import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container } from 'react-bootstrap';

const CardPage = () => {
  return (
    <Container className="pt-3">
      <Card.Header>헤더</Card.Header>
      <Card.Body>
        <Card.Title>타이틀</Card.Title>
        <Card.Subtitle className="text-muted mb-3">서브타이틀</Card.Subtitle>
        <Card.Text>텍스트</Card.Text>
      </Card.Body>
    </Container>
  );
};

export default CardPage;
