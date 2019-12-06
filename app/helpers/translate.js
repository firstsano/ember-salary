import Ember from 'ember';

export default Ember.Helper.extend({
  i18n: Ember.inject.service(),
  compute(value) {
    let i18n = this.get('i18n');
    return i18n.t(value);
  }
});
