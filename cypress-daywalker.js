((global) => {
  if (!global.Cypress) {
    return;
  }

  class DaywalkerStore {
    constructor() {
      this.data = {
        tags: {},
        classes: {},
        ids: {},
      };
    }

    addInstance(tagName, instance) {
      this.data.tags[tagName.toLowerCase()] = this.data.tags[tagName] || [];
      this._push(this.data.tags[tagName], instance);

      if (instance.id) {
        this.data.ids[instance.id] = this.data.ids[instance.id] || [];
        this._push(this.data.ids[instance.id], instance);
      }

      const classes = Array.from(instance.classList);
      classes.forEach(function(c) {
        this.data.classes[c] = this.data.classes[c] || [];
        this._push(this.data.classes[c], instance);
      }, this);
    }

    _push(arr, instance) {
      if (arr.find((node) => node == instance)) {
        return;
      }
      arr.push(instance);
    }
  }

  const daywalker = {
    store: new DaywalkerStore(),
  };

  const oldDefine = customElements.define;
  customElements.define = function define(...args) {
    if (args && args.length > 0) {
      const name = args[0];
      args[1] = class b extends args[1] {
        constructor(...args) {
          super(...args);
          daywalker.store.addInstance(name, this);
        }
      };
    }
    return oldDefine.apply(this, args);
  };

  global.Daywalker = daywalker;
})(window);
