import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select/dist/declarations/src/Select';

const option = [
  { value: 'KR', label: '한국' },
  { value: 'JP', label: '일본' },
  { value: 'US', label: '미국' },
  { value: 'CN', label: '중국' },
];

const SelectPage = () => {
  const [selectedOptionSingle, setSelectedOptionSingle] = useState();
  const [selectedOptionMulti, setSelectedOptionMulti] = useState();
};

export default SelectPage;
