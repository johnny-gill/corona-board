import React from 'react';
import { Container } from 'react-bootstrap';
import { css } from '@emotion/react';
import { Echart } from '../../components/echart';

const PieChart = () => {
  const pieChartData = [
    { name: '여성', value: 76708 },
    { name: '남성', value: 77749 },
  ];

  const total = pieChartData.reduce((acc, x) => acc + x.value, 0);
  const series = [
    {
      label: {
        position: 'outer',
        formatter: (obj) => {
          const percent = ((obj.value / total) * 100).toFixed(1);
          return `${obj.name} ${obj.value}명\n(${percent})`;
        },
      },
      type: 'pie',
      radius: '50%',
      data: pieChartData,
    },
  ];

  const chartOption = {
    animation: true,
    title: {
      text: '대한민국 성별 확진자 현황',
      left: 'center',
      top: 30,
    },
    legend: {
      data: pieChartData.map((x) => x.name),
      bottom: 20,
    },
    series,
  };

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

export default PieChart;
