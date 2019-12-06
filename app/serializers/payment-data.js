import {ActiveModelSerializer} from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  modelNameFromPayloadKey(key) {
    let predefinedNames = ["payment_data"];
    if (predefinedNames.includes(key)) {
      return key;
    }
    return this._super(key);
  }
});
