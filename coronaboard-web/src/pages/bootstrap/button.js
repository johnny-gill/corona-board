import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, Container } from 'react-bootstrap';

const ButtonPage = () => {
  return (
    <Container>
      <div>
        <Button variant="primary">primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="success">success</Button>
      </div>
      <hr />
      <ButtonGroup size="md">
        <Button variant="primary">오늘</Button>
        <Button variant="outline-primary">어제</Button>
      </ButtonGroup>
    </Container>
  );
};

export default ButtonPage;
