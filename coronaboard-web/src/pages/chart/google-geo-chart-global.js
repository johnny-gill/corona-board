import Chart from 'react-google-charts';
import React from 'react';
import { Container } from 'react-bootstrap';

const data = [
  ['Country', 'Confirmed'],
  ['United States', 34321093],
  ['India', 29506328],
  ['Brazil', 17413996],
  ['France', 5740665],
  ['Turkey', 5330447],
];

const options = {
  colorAxis: { colors: ['skyblue', 'purple'] },
};

const GoogleGeoChart = () => {
  return (
    <Container>
      <Chart
        chartType="GeoChart"
        width="100%"
        hegiht="100%"
        data={data}
        options={options}
      />
    </Container>
  );
};

export default GoogleGeoChart;
