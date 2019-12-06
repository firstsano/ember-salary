import Ember from 'ember';

export function eql([comparable, comparison]) {
  return comparable === comparison;
}

export default Ember.Helper.helper(eql);
