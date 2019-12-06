export const PAYMENT_DATA_ATTRIBUTES = [
  { name: 'nosmoking', type: "check" },
  { name: 'overwork_1_5', type: "float" },
  { name: 'overwork_2', type: "float" },
  { name: 'overworkMinus', type: "float" },
  { name: 'overworkHourRateMin', type: "float" },
  { name: 'overworkHourRateMax', type: "float" },
  { name: 'businessTripAlone', type: "float" },
  { name: 'vacationDays', type: "int" },
  { name: 'bonusOnce', type: "float" },
  { name: 'penalty', type: "float" },
  { name: 'note', type: "string" }
];

export const TYPE_TRANSFORMATIONS = {
  'integer': 'int',
  'int': 'int',
  'float': 'float',
  'string': 'text',
  'boolean': 'check',
  'check': 'check'
};

export const STYLES = {
  DISABLED: 'background-color: #d1d1d1',
  INVALID: 'color: red',
  EXPRESSION: 'color: green'
};
