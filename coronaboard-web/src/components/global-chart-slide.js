import React from 'react';
import { Slide } from './slide';
import { css } from '@emotion/react';
import { GlobalTrendChart } from './chart/global-trend-chart';

export const GlobalChartSlide = ({ id, dataSource }) => {
  const { countryByCc } = dataSource;

  return (
    <Slide id={id} title="글로벌 차트">
      <div
        css={css`
          .card {
            margin-top: 20px;
          }
        `}
      >
        <GlobalTrendChart countryByCc={countryByCc} />
      </div>
    </Slide>
  );
};
