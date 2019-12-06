import Component from '@ember/component';
import { computed } from '@ember/object';


const TYPES = {
  BOOLEAN: 'boolean'
};

const GroupPaymentInput = Component.extend({
  tagName: '',
  label: null,
  value: null,
  type: null,
  isBoolean: computed('type', function() {
    return this.get('type') === TYPES.BOOLEAN;
  })
});

GroupPaymentInput.reopenClass({
  positionalParams: ['label', 'value', 'type']
});

export default GroupPaymentInput;
