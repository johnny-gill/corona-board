import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export const Echart = ({ wrapperCss, option }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    console.log('useEffect');
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);

    return () => {
      console.log('dispose');
      chartInstance.dispose();
    };
  }, [option]);

  return <div css={wrapperCss} ref={chartRef} />;
};