import React from 'react';
import { GlobalGeoChart } from './global-geo-chart';
import { GlobalTable } from './global-table';
import { Slide } from './slide';

export const GlobalSlide = ({ id, dataSource }) => {
  const { countryByCc, globalStats } = dataSource;
  return (
    <Slide id={id} title="국가별 현황">
      <GlobalGeoChart countryByCc={countryByCc} globalStats={globalStats} />
      <GlobalTable countryByCc={countryByCc} globalStats={globalStats} />
    </Slide>
  );
};
