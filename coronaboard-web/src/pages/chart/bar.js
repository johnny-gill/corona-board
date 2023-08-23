import React from 'react';
import { Container } from 'react-bootstrap';
import { Echart } from '../../components/echart';
import { css } from '@emotion/react';

const labelOptions = {
  show: true,
  position: 'top',
};

const series = [
  {
    name: '확진',
    type: 'bar',
    color: '#e2431e',
    label: labelOptions,
    data: [743, 556, 485, 454, 602],
  },
  {
    name: '격리해제',
    type: 'bar',
    color: '#6f9654',
    label: labelOptions,
    data: [474, 499, 599, 551, 762],
  },
];

const chartOption = {
  title: {
    text: '대한민국 코로나 19 추이',
    left: 'center',
  },
  legend: {
    // 범례
    data: series.map((x) => x.name),
    bottom: 20,
  },
  xAxis: {
    data: ['6.5', '6.6', '6.7', '6.8', '6.9'],
  },
  yAxis: {},
  tooltip: {
    trigger: 'axis',
  },
  series,
  animation: true,
};

const BarChart = () => {
  return (
    <Container>
      <Echart
        wrapperCss={css`
          width: 100%;
          height: 400px;
        `}
        option={chartOption}
      />
    </Container>
  );
};

export default BarChart;
