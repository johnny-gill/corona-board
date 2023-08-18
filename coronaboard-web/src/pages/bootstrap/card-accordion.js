import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Container } from 'react-bootstrap';

const CardAccordionPage = () => {
  return (
    <Container className="pt-3">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="p-0">#0 Header</Accordion.Header>
          <Accordion.Body>#0 Body</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>#1 Header</Accordion.Header>
          <Accordion.Body>#1 Body</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default CardAccordionPage;
