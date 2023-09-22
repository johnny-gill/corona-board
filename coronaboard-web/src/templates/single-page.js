import { css } from '@emotion/react';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dashboard } from '../components/dashboard';

const SinglePage = ({ pageContext }) => {
  const { dataSource } = pageContext;
  const { lastUpdated, globalStats } = dataSource;
  const lastUpdatedFormatted = new Date(lastUpdated).toLocaleString();

  console.log(globalStats);
  
  return (
    <div id="top">
      <div
        css={css`
          position: absolute;
          background-color: black;
          width: 100%;
          height: 300px;
          z-index: -99;
        `}
      />
      <h1
        css={css`
          padding-top: 48px;
          padding-bottom: 24px;
          color: white;
          text-align: center;
          font-size: 28px;
        `}
      >
        코로나19(COVID-19) <br />
        실시간 상황판
      </h1>
      <p className="text-center text-white">
        마지막 업데이트 : {lastUpdatedFormatted}
      </p>
      <Dashboard globalStats={globalStats} />
    </div>
  );
};

export default SinglePage;
