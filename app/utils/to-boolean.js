import { includes } from 'lodash';


export default function toBoolean(value) {
  const trueValues = [true, 't', 'true', 1, '1'];
  return includes(trueValues, value);
}
