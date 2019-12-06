import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';


const GroupSelect = Component.extend({
  settings: service('db-settings'),
  i18n: service(),
  value: null,
  selectedOption: null,
  defaultOption: computed(function() {
    const i18n = this.get('i18n');
    return {
      id: null,
      name: i18n.t('common.allGroups')
    };
  }),
  settingsOptions: computed(function() {
    const groups = this.get('settings').groups;
    return groups.sortBy('name').map(group => ({
      id: get(group, 'id'),
      name: get(group, 'name')
    }));
  }),
  options: computed(function() {
    return [this.get('defaultOption'), ...this.get('settingsOptions')];
  }),

  init() {
    this._super(...arguments);
    let selectedOption = this.get('options').findBy('id', this.get('value'));
    if (!selectedOption) {
      selectedOption = this.get('defaultOptions');
    }
    this.set('selectedOption', selectedOption);
  },

  actions: {
    sendOnChange(group) {
      const onChange = this.get('onChange'),
            selectedId = get(group, 'id')
      ;
      this.set('selectedOption', group);
      if (onChange) {
        onChange(selectedId);
      }
    }
  }
});

GroupSelect.reopenClass({
  positionalParams: ['value']
});

export default GroupSelect;
