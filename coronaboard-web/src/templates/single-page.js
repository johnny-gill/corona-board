import { css } from '@emotion/react';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dashboard } from '../components/dashboard';
import { Notice } from '../components/notice';
import { GlobalSlide } from '../components/global-slide';
import { GlobalChartSlide } from '../components/global-chart-slide';
import { KoreaTestChart } from '../components/chart/korea-test-chart';
import { KoreaBySexChart } from '../components/chart/korea-by-sex-chart';
import { KoreaByAgeChart } from '../components/chart/korea-by-age-chart';

const SinglePage = ({ pageContext }) => {
  const { dataSource } = pageContext;
  const {
    lastUpdated,
    globalStats,
    notice,
    koreaTestChartData,
    koreaBySexChartData,
    koreaByAgeChartData,
  } = dataSource;
  const lastUpdatedFormatted = new Date(lastUpdated).toLocaleString();

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
      <Notice notice={notice} />
      <GlobalSlide id="global-slide" dataSource={dataSource} />
      <GlobalChartSlide id="global-chart-slide" dataSource={dataSource} />
      <KoreaTestChart
        id="korea-test-chart"
        koreaTestChartData={koreaTestChartData}
      />
      <KoreaBySexChart
        id="korea-by-sex-chart"
        koreaBySexChartData={koreaBySexChartData}
      />
      <KoreaByAgeChart
        id="korea-by-age-chart"
        data={koreaByAgeChartData}
      />
    </div>
  );
};

export default SinglePage;
