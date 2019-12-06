import DS from 'ember-data';


export default DS.Model.extend({
  nosmoking: DS.attr('boolean'),
  overwork_1_5: DS.attr('number'),
  overwork_2: DS.attr('number'),
  overworkMinus: DS.attr('number'),
  overworkHourRateMin: DS.attr('number'),
  overworkHourRateMax: DS.attr('number'),
  businessTripAlone: DS.attr('number'),
  vacationDays: DS.attr('number'),
  bonusOnce: DS.attr('number'),
  penalty: DS.attr('number'),
  note: DS.attr('string'),
  aliasAttributes: DS.attr(),
  salaryAttributes: DS.attr()
});
