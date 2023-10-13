import React, { useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { Echart } from '../echart';
import { css } from '@emotion/react';
import { numberWithCommas } from '../../utils/formatter';

export const KoreaBySexChart = ({ koreaBySexChartData }) => {
  const [dataType, setDataType] = useState('confirmed'); // 확진자, 사망자 버튼
  const chartOption = generateChartOption(koreaBySexChartData, dataType);

  return (
    <Card>
      <Card.Body>
        <Echart
          wrapperCss={css`
            width: 100%;
            height: 400px;
          `}
          option={chartOption}
        />
        <ButtonGroup size="md">
          <Button
            variant="outline-primary"
            active={dataType === 'confirmed'}
            onClick={() => setDataType('confirmed')}
          >
            확진자
          </Button>
          <Button
            variant="outline-primary"
            active={dataType === 'death'}
            onClick={() => setDataType('death')}
          >
            사망자
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

/**
 *
 * @param {object} data
 * @param {string} dataType
 */
const generateChartOption = (data, dataType) => {
  const textByDataType = { confirmed: '확진자', death: '사망자' };
  const textBySex = { male: '남성', female: '여성' };
  const pieChartData = Object.keys(data).map((sexKey) => ({
    // sexKey : male, female
    name: textBySex[sexKey],
    value: data[sexKey][dataType],
  }));

  // 남녀 확진자 또는 사망자 합계
  const total = pieChartData.reduce((acc, x) => acc + x.value, 0);

  const series = [
    {
      label: {
        position: 'inner',
        formatter: (obj) => {
          const percent = ((obj.value / total) * 100).toFixed(1);
          return `${obj.name} ${numberWithCommas(obj.value)}명\n(${percent}%)`;
        },
      },
      type: 'pie',
      radius: '56%', // 챠트내에서 파이의 크기
      data: pieChartData,
    },
  ];

  return {
    animation: true,
    title: {
      text: '대한민국 성별 확진자 현황',
      subtext: `총 ${textByDataType[dataType]} 수 ${numberWithCommas(total)}명`,
      left: 'center',
    },
    legend: {
      data: pieChartData.map((x) => x.name),
      bottom: 20,
    },
    color: ['#2f4554', '#c23531'],
    series,
  };
};
