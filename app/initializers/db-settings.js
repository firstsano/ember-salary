export function initialize(application) {
  application.inject('route', 'settings', 'service:db-settings');
}

export default {
  name: 'db-settings',
  initialize
};
