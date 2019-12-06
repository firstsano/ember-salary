import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';


export default Service.extend({
  store: service(),
  users: null,
  groups: null,

  load() {
    const store = this.get('store');
    return hash({
      users: store.findAll('user'),
      groups: store.findAll('group')
    }).then(() => {
      this.set('users', store.peekAll('user'));
      this.set('groups', store.peekAll('group'));
    })
  }
});
