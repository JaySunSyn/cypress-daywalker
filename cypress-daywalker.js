((global) => {
  if (!global.Cypress) {
    return;
  }

  function Store(fn, ln) {
    this.data = {};

    const push = (arr, instance) => {
      if (arr.find((node) => node == instance)) {
        return;
      }
      arr.push(instance);
    };

    this.add = function(tagName, instance) {
      this.data.tags = this.data.tags || {};
      this.data.tags[tagName.toLowerCase()] = this.data.tags[tagName] || [];
      push(this.data.tags[tagName], instance);

      if (instance.id) {
        this.data.ids = this.data.ids || {};
        this.data.ids[instance.id] = this.data.ids[instance.id] || [];
        push(this.data.ids[instance.id], instance);
      }

      this.data.classes = this.data.classes || {};
      const classes = Array.from(instance.classList);
      classes.forEach(function(c) {
        this.data.classes[c] = this.data.classes[c] || [];
        push(this.data.classes[c], instance);
      }, this);
    };
  }

  const daywalker = {
    store: new Store(),
  };

  const old = customElements.define;
  customElements.define = function define(...args) {
    if (args && args.length > 0) {
      const name = args[0];
      args[1] = class b extends args[1] {
        constructor(...args) {
          super(...args);
          daywalker.store.add(name, this);
        }
      };
    }
    return old.apply(this, args);
  };

  global.Daywalker = daywalker;
})(window);
