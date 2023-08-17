import Slide from '../components/slide';
import React from 'react';

const SinglePage = ({ pageContext }) => {
  const { dataSource } = pageContext;
  const { countryByCc, globalStats } = dataSource;

  console.log(countryByCc);
  console.log(globalStats);

  return (
    <div>
      <h1>코로나보드</h1>
      <Slide title="국가별 현황">국가별 현황을 보여줍니다.</Slide>
    </div>
  );
};

export default SinglePage;
