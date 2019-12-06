import Component from '@ember/component';
import { computed, get, observer } from '@ember/object';
import { uniqueId } from 'lodash';
import $ from 'jquery';


const W2uiGrid = Component.extend({
  name: null,
  columns: null,
  data: null,
  toolbar: null,
  defaultValues: computed(() => ({
    name: uniqueId(),
    toolbar: {
      show: {
        toolbar: true,
        footer: true,
        toolbarColumns: true
      },
    },
    events: {}
  })),

  settingsChanged: observer('data', 'columns', function() {
    const name = this.get('name'),
          grid = w2ui[name]
    ;
    grid.destroy();
    this.generateGrid();
  }),

  init() {
    this._super(...arguments);
    this.setupDefaultValues('name', 'toolbar', 'events');
  },

  didInsertElement() {
    this.generateGrid();
  },

  willDestroyElement() {
    const name = this.get('name'),
          grid = w2ui[name]
    ;
    grid.destroy();
  },

  setupDefaultValues(...attributes) {
    const defaultValues = this.get('defaultValues');
    for(let attribute of attributes) {
      if (!this.get(attribute)) {
        this.set(attribute, get(defaultValues, attribute));
      }
    }
  },

  generatedEvents: computed(function() {
    const events = this.get('events'),
          eventsList = Object.keys(events),
          columns = this.get('columns'),
          generatedEvents = {}
    ;
    const gridData = { columns };
    for(let eventName of eventsList) {
      generatedEvents[eventName] = (target, event) => {
        return events[eventName](target, event, gridData);
      };
    }
    return generatedEvents;
  }),

  settings: computed(function() {
    const name = this.get('name'),
          columns = this.get('columns'),
          toolbar = this.get('toolbar'),
          events = this.get('generatedEvents'),
          records = this.get('data')
    ;
    return Object.assign({},
      { name, columns },
      events,
      toolbar,
      { records }
    );
  }),

  generateGrid() {
    const name = this.get('name'),
          settings = this.get('settings')
    ;
    const grid = w2ui[name] || $().w2grid(settings);
    this.$().find(`[data-grid="${name}"]`).w2render(name);
    grid.refresh();
  }
});

W2uiGrid.reopenClass({
  positionalParams: ['name']
});

export default W2uiGrid;
