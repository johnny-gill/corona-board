import { format, parseISO } from 'date-fns';

const numberFormatter = new Intl.NumberFormat('ko-KR');

export const numberWithCommas = (x) => numberFormatter.format(x);

export const formatDiff = (cur, prev) => {
  const diff = cur - prev;
  if (diff === undefined || isNaN(diff) || diff === 0) {
    return '(-)';
  }

  return diff > 0
    ? `(+${numberWithCommas(diff)})`
    : `(${numberWithCommas(diff)})`;
};

export const formatDiffForTable = (cur, prevOptional) => {
  const prev = prevOptional || 0;
  const diff = cur - prev;

  return diff === 0 ? '' : formatDiff(cur, prev);
};

export const convertToMonthDay = (dateString) =>
  format(parseISO(dateString), 'M.d');

export const numberWithUnitFormatter = (value) => {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(1) + '억';
  } else if (value >= 10000) {
    return (value / 10000).toFixed(0) + '만';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(0) + '천';
  } else if (value >= 100) {
    return (value / 100).toFixed(0) + '백';
  } else {
    return value;
  }
};
