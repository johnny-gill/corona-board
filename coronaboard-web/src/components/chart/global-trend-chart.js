import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { Echart } from '../echart';
import { css } from '@emotion/react';
import Select from 'react-select';
import { colors } from '../../config';

export const globalTrendChart = ({ countryByCc }) => {
  const defaultSelectedItem = {
    value: 'global',
    label: '전 세계',
  };

  const [chartData, setChartData] = useState(null); // 차트 데이터
  const [dataType, setDataType] = useState('acc'); // 누적(acc), 일별(daily)
  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem); // 전 세계, 국가별
  const countryCodes = Object.keys(countryByCc);

  // useEffect(async () => {
  //   const response = await axios.get(`/generated/${selectedItem.value}`);
  //   setChartData(response.data);
  // }, [selectedItem]);

  // 국가 변경시 차트 데이터 변경
  useEffect(() => {
    const fetchDataWithCc = async (cc) => {
      const response = await axios.get(`/generated/${cc}`);
      setChartData(response.data);
    };
    fetchDataWithCc(selectedItem.value);
  }, [selectedItem]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  const chartOption = generateChartOption(chartData, dataType);
  const selectOption = [
    defaultSelectedItem,
    ...countryCodes.map((cc) => ({
      value: cc,
      label: countryByCc[cc].title_ko,
    })),
  ];

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
        <div className="d-flex justify-content-center">
          <ButtonGroup
            size="sm"
            css={css`
              padding: 0 10px;
            `}
          >
            <Button
              variant="outline-primary"
              active={dataType === 'acc'}
              onClick={() => setDataType('acc')}
            >
              누적
            </Button>
            <Button
              variant="outline-primary"
              active={dataType === 'daily'}
              onClick={() => setDataType('daily')}
            >
              일별
            </Button>
          </ButtonGroup>
          <Select
            styles={{
              container: (provided) => ({
                ...provided,
                width: '160px',
              }),
              menu: (provided) => ({
                ...provided,
                width: '160px',
              }),
            }}
            value={selectedItem}
            onChange={(selected) => setSelectedItem(selected)}
            options={selectOption}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

const generateChartOption = (data, dataType) => {
  const seriesAccList = [
    {
      name: '누적확진',
      type: 'line',
      data: data.confirmedAcc,
      color: colors.confirmed,
    },
    {
      name: '누적사망',
      type: 'line',
      data: data.deathAcc,
      color: colors.death,
    },
    {
      name: '누적격리해제',
      type: 'line',
      data: data.releasedAcc,
      color: colors.released,
    },
  ];

  const seriesDailyList = [
    {
      name: '확진',
      type: 'bar',
      data: data.confirmed,
      color: colors.confirmed,
    },
    {
      name: '사망',
      type: 'bar',
      data: data.death,
      color: colors.death,
    },
    {
      name: '격리해제',
      type: 'bar',
      data: data.released,
      color: colors.released,
    },
  ];


  let legendData;
  let series;
  let dataZoomStart;
  

};
