import Route from '@ember/routing/route';
import { hash } from 'rsvp';


export default Route.extend({
  queryParams: {
    group: { refreshModel: true },
    date: { refreshModel: true }
  },

  model(params) {
    const store = this.get('store'),
          queryParams = { date: params.date, group: params.group }
    ;
    return hash({
      payments: store.query('payment', queryParams),
      groupPayments: store.query('group-payment', queryParams)
    });
  },

  setupController(controller, model) {
    controller.set('payments', model.payments);
    controller.set('groupPayments', model.groupPayments);
  },

  actions: {
    saveGroupPayment(groupPayment) {
      groupPayment.save().then(() => {
        this.refresh();
      }, (errorObject) => {
        groupPayment.rollbackAttributes();
        let errorMessage = errorObject.errors.map((item) => item.detail).join(", ");
        throw new Error(errorMessage);
      });
    },
  }
});
