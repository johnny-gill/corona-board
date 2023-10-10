import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { Echart } from '../echart';
import { css } from '@emotion/react';
import Select from 'react-select';
import { colors } from '../../config';
import {
  convertToMonthDay,
  numberWithUnitFormatter,
} from '../../utils/formatter';

export const GlobalTrendChart = ({ countryByCc }) => {
  const defaultSelectedItem = {
    value: 'global',
    label: '전세계',
  };

  const [chartData, setChartData] = useState(null); // 차트 데이터
  const [dataType, setDataType] = useState('acc'); // 누적(acc), 일별(daily)
  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem); // 전 세계, 국가별
  const countryCodes = Object.keys(countryByCc);

  // 국가 변경시 차트 데이터 변경
  useEffect(() => {
    console.log('useEffect');
    const fetchDataWithCc = async (cc) => {
      const response = await axios.get(`/generated/${cc}.json`);
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

  // legend : 범례
  // series : 차트의 실제 데이터
  let legendData;
  let series;
  let dataZoomStart;

  if (dataType === 'acc') {
    legendData = seriesAccList.map((x) => x.name);
    series = seriesAccList;
    dataZoomStart = 30;
  } else if (dataType === 'daily') {
    legendData = seriesDailyList.map((x) => x.name);
    series = seriesDailyList;
    dataZoomStart = 30;
  } else {
    throw new Error(`Not Supported dataType : ${dataType}`);
  }

  return {
    animation: false,
    title: {
      text: '전세계 코로나(COVID-19) 추이',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: legendData,
      bottom: 50,
    },
    grid: {
      top: 70,
      left: 40,
      right: 10,
      bottom: 100,
    },
    dataZoom: {
      type: 'slider',
      show: true,
      start: dataZoomStart,
      end: 100,
    },
    xAxis: {
      data: data.date.map(convertToMonthDay),
    },
    yAxis: {
      axisLabel: {
        rotate: 50,
        formatter: numberWithUnitFormatter,
      },
    },
    series,
  };
};
