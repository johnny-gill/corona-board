import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Select from 'react-select';

const options = [
  { value: 'KR', label: '한국' },
  { value: 'JP', label: '일본' },
  { value: 'US', label: '미국' },
  { value: 'CN', label: '중국' },
];

const SelectPage = () => {
  const [selectedOptionSingle, setSelectedOptionSingle] = useState();
  const [selectedOptionMulti, setSelectedOptionMulti] = useState();

  return (
    <Container className="pt-3">
      <h5>단일 선택 상자</h5>
      <Select
        value={selectedOptionSingle}
        onChange={(selectedOption) => {
          console.log('Single options selected', selectedOption);
          setSelectedOptionSingle(selectedOption);
        }}
        options={options}
      />
      <hr />
      <h5>다중 선택 상자</h5>
      <Select
        isMulti={true}
        isSearchable={true}
        placeholder="국가 선택..."
        value={selectedOptionMulti}
        onChange={(selectedOption) => {
          console.log('Multiple options selected', selectedOption);
          setSelectedOptionMulti(selectedOption);
        }}
        options={options}
      />
    </Container>
  );
};

export default SelectPage;
