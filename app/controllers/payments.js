import Controller from '@ember/controller';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { round, size, isEmpty } from 'lodash';
import $ from 'jquery';

import toBoolean from 'salaries/utils/to-boolean';
import {
  PAYMENT_DATA_ATTRIBUTES,
  TYPE_TRANSFORMATIONS,
  STYLES
} from "./payments/constants";


export default Controller.extend({
  i18n: service(),
  queryParams: ['date', 'group'],
  date: null,
  group: null,

  events: computed(function() {
    return {
      onChange: (target, event, gridData) => {
        const columns = gridData.columns,
              id = event.recid,
              columnName = event.column,
              grid = w2ui[target],
              model = grid.get(id).source,
              field = grid.columns[event.column].field,
              value = event.value_new
        ;
        if (columns[columnName].editable.edit === false ||
          grid.get(id).editable[columnName] === false) {
          event.preventDefault();
        }
        event.onComplete = () => {
          model.set(field, value);
          const modelSalaryAttributes = model.get('salaryAttributes');
          const changedAttribute = modelSalaryAttributes.findBy('name', field);
          if (changedAttribute) {
            changedAttribute.value = value;
            model.set('salaryAttributes', [changedAttribute]);
          }
          if (model.get(`salaryAttributes.${field}`)) {
            model.set(`salaryAttributes.${field}.value`, value);
          }
          model.save().then(() => {
            model.reload().then(() => {
              delete grid.get(id).changes;
              grid.set(id, this._modelToJSON(model));
            });
          }, (data) => {
            model.rollbackAttributes();
            delete grid.get(id).changes;
            grid.refreshRow(id);
            this._overlayInfo(event, data.errors);
          });
        };
      }
    }
  }),

  gridData: computed('payments', function() {
    return this.get('payments').map((item) => {
      return this._modelToJSON(item);
    });
  }),

  dataExists: computed('payments', function() {
    const payments = this.get('payments').toArray();
    return !isEmpty(payments);
  }),

  columns: computed('payments', function() {
    const readonlyColumns = this.get('_readonlyColumns'),
          paymentDataColumns = this.get('_paymentDataColumns'),
          salaryColumns = this.get('_salaryColumns')
    ;
    return [
      ...readonlyColumns,
      ...paymentDataColumns,
      ...salaryColumns
    ];
  }),

  _modelToJSON(model) {
    const json = model.toJSON(),
          aliasAttributes = model.get('aliasAttributes'),
          salaryAttributes = model.get('salaryAttributes').sortBy('name')
    ;
    const salaryOffset = size(aliasAttributes) + size(PAYMENT_DATA_ATTRIBUTES);
    json.recid = model.id;
    aliasAttributes.forEach((attribute, i) => {
      json[attribute.name] = attribute.value;
      json.editable = json.editable || {};
      json.editable[i] = false;
    });
    salaryAttributes.forEach((attribute, i) => {
      const { name, type, value } = attribute,
            { style, editable } = json,
            offset = salaryOffset + i
      ;
      json[name] = (TYPE_TRANSFORMATIONS[type] === 'check') ? toBoolean(value) : value;
      json.style = this._setStyleForRecord(style, offset, attribute);
      json.editable = this._setEditableForRecord(editable, offset, attribute);
    });
    json['source'] = model;
    return json;
  },

  _setStyleForRecord(recordSettings = {}, offset, attribute) {
    const style = Object.assign({}, recordSettings);
    switch (true) {
      case (attribute.isValid === false):
        style[offset] = STYLES.INVALID;
        break;
      case (attribute.value === null):
        style[offset] = STYLES.DISABLED;
        break;
      case (attribute.isExpression === true):
        style[offset] = STYLES.EXPRESSION;
        break;
      default:
        delete style[offset];
    }
    return style;
  },

  _setEditableForRecord(recordSettings = {}, offset, attribute) {
    const editable = Object.assign({}, recordSettings);
    if (attribute.value === null || attribute.editable === false) {
      editable[offset] = false;
    }
    return editable;
  },

  _paymentDataColumns: computed(function() {
    const i18n = this.get('i18n');
    return PAYMENT_DATA_ATTRIBUTES.map((attribute) => {
      attribute.label = i18n.t(`model.payment.attributes.${attribute.name}`);
      return this._generateColumn(attribute);
    });
  }),

  _readonlyColumns: computed('payments', function() {
    const payments = this.get('payments'),
          readonlyAttributes = get(payments, 'firstObject.aliasAttributes') || []
    ;
    return readonlyAttributes.map((attribute) => {
      attribute.editable = false;
      return this._generateColumn(attribute);
    });
  }),

  _salaryColumns: computed('payments', function() {
    const payments = this.get('payments');
    let salaryAttributes = get(payments, 'firstObject.salaryAttributes') || [];
    salaryAttributes = salaryAttributes.sortBy('name');
    return salaryAttributes.map((attribute) => this._generateColumn(attribute));
  }),

  _generateColumn(attribute) {
    const { name, label, type } = attribute,
          columnSettings = {
            field: name,
            caption: label,
            size: '100px',
            sortable: true,
            resizable: true,
            hideable: true,
            render: this._tranformRender(type, name),
            style: 'text-align: right;',
            editable: { type: TYPE_TRANSFORMATIONS[type] }
          }
    ;
    if (attribute.editable === false) {
      columnSettings.editable.edit = false;
    }
    return columnSettings;
  },

  _overlayInfo({recid, column}, errors) {
    const info = errors.map((item) => item.detail).join("<br />");
    const overlay = `<div class='overlay overlay_error'>${info}</div>`;
    $(`#grid_payments-grid_rec_${recid} td[col=${column}]`).w2overlay(overlay);
  },

  _tranformRender(type, field) {
    let conditionalRound = function(record) {
      if (record[field] === null) {
        return null;
      }
      const number = Number.parseFloat(record[field]);
      return round(number, 2);
    };
    let transformations = {
      'integer': 'int',
      'int': 'int',
      'float': conditionalRound,
      'expression': conditionalRound,
      'string': null,
      'boolean': null,
      'check': null
    };
    return transformations[type];
  }
});
