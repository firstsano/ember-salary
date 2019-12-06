import DS from 'ember-data';


export default DS.Model.extend({
  label: DS.attr('string'),
  cast: DS.attr('string'),
  units: DS.attr('string'),
  initialValue: DS.attr('string'),

  didLoad() {
    this._super(...arguments);
    this.initializeValue();
  },

  initializeValue() {
    let [cast, initialValue] = [this.get('cast'), this.get('initialValue')];
    if (cast === 'boolean' && typeof initialValue === 'string') {
      this.set('initialValue', (initialValue === 'true'));
    }
  }
});
