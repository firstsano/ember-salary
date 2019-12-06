import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import moment from 'moment';


const FORMATS = {
  SHORT: 'MMMM Y',
  FULL: 'Y-MM-DD'
};

export default Component.extend({
  startOn: null,
  displayDate: computed('date', function() {
    return this.get('date').format(FORMATS.SHORT);
  }),
  dateChanged: observer('date', function() {
    const value = this.get('date').format(FORMATS.FULL),
          action = this.get('onChange')
    ;
    if (action) {
      action(value);
    }
  }),

  init() {
    this._super(...arguments);
    let initialDate = moment(this.get('startOn'), FORMATS.FULL);
    if (!initialDate.isValid()) {
      initialDate = moment().startOf('month');
    }
    this.set('date', initialDate);
  },

  actions: {
    nextMonth() {
      const nextDate = this.get('date').add(1, 'M');
      this.set('date', moment(nextDate));
    },

    prevMonth() {
      const nextDate = this.get('date').subtract(1, 'M');
      this.set('date', moment(nextDate));
    }
  }
});
