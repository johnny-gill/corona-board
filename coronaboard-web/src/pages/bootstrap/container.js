import React from 'react';
import { css } from '@emotion/react';
import { Container } from 'react-bootstrap';

const borderedGrid = css`
  text-align: center;
  div {
    background-color: rgba(39, 41, 43, 0.03);
    border: 1px solid rgba(39, 41, 43, 0.1);
    padding: 10px;
    margin-bottom: 20px;
  }
`;

/**
 * 
 * 
 * 576px(min-width)~767px 에서는 540px(max-width)로 세팅 : .container, .container-sm
 * 768px(min-width)~991px 에서는 720px(max-width)로 세팅 : .container, .container-sm, .container-md
 * 992px(min-width)~1119px 에서는 960px(max-width)로 세팅 : .container, .container-sm, .container-md, container-lg
 * 1120px(min-width)~1399px 에서는 1140px(max-width)로 세팅 : .container, .container-sm, .container-md, container-lg, .container-xl
 * .container-fluid는 무조건 width 100%
 * 
 * 
 */
const ContainerPage = () => {
  return (
    <div className="pt-3" css={borderedGrid}>
      <h2>화면 너비에 따른 컨테이너 너비 비교</h2>
      <Container>.container</Container>
      <Container fluid="sm">.container-sm</Container>
      <Container fluid="md">.container-md</Container>
      <Container fluid="lg">.container-lg</Container>
      <Container fluid="xl">.container-xl</Container>
      <Container fluid="fluid">.container-fluid</Container>
    </div>
  );
};

export default ContainerPage;
