import React from 'react';
import { Container } from 'react-bootstrap';
import Chart from 'react-google-charts';

const header = [
  { type: 'string', label: '지역' },
  { type: 'number', label: '확진자' },
  { type: 'number', label: '사망자' },
  { type: 'number', label: '격리해제' },
  { type: 'number', label: '치명률' },
];

const rows = [
  ['서울', 22717, 277, 17487],
  ['경기', 18378, 393, 14538],
  ['대구', 8176, 206, 7787],
];

const fatalityRateAddedRows = rows.map((row) => {
  const [region, confirmed, death, released] = row;

  const fatalityRate = (death / confirmed) * 100;
  const fatalityRateFormatted = {
    v: fatalityRate,
    f: `${fatalityRate.toFixed(1)}%`,
  };

  const confirmedFormatted = {
    v: confirmed,
    f: `${confirmed}<br><span class="text-danger">(+101)</span>`,
  };

  const releasedFormatted = {
    v: released,
    f: `${released}<br><span class="text-success">(+30)</span>`,
  };
  
  return [
    region,
    confirmedFormatted,
    death,
    releasedFormatted,
    fatalityRateFormatted,
  ];
});

const data = [header, ...fatalityRateAddedRows];

const GoogleTableChart = () => {
  return (
    <Container>
      <Chart
        chartType="Table"
        loader={<div>Loading...</div>}
        data={data}
        options={{
          showRowNumber: true,
          allowHtml: true,
          width: '100%',
          height: '100%',
        }}
      />
    </Container>
  );
};

export default GoogleTableChart;
