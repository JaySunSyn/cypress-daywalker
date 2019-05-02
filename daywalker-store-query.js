class DaywalkerStoreQuery {
  constructor(store) {
    this.store = store;
  }

  queryStore(selector) {
    if (selector.indexOf(' > ') > -1) {
      return this.byDirectParent(selector);
    }

    if (this.__isByPath(selector)) {
      return this.byPath(selector);
    }

    if (selector.indexOf('#') > - 1 && selector.indexOf(' ') === - 1) {
      return this.byId(selector);
    }

    if (selector.indexOf('[') > - 1) {
      return this.byAttr(selector);
    }

    if (selector.indexOf('.') > - 1) {
      return this.byClass(selector);
    }
    return this.byTag(selector);
  }

  byTag(selector) {
    return this.store.data.tags[selector];
  }

  byClass(selector) {
    // .foo.moo => ["", "foo", "moo"]
    const classList = selector.split('.');
    classList.shift();

    const firstClassInstances = this.store.classes[classList.shift()];
    return classList.map((cls) => {
      const instances = this.store.classes[cls];
      return firstClassInstances.filter((instance) => instances.includes(instance));
    });
  }

  byPath(selector) {

  }

  __isByPath(selector) {
    if (selector.indexOf(' ') === -1) {
      return false;
    }
    if (selector.indexOf('[') > -1 && !this._attrSelectorContainsSpaces(selector)) {
      return true;
    }
    return selector.split('[')[0].indexOf(' ') > -1;
  }
}

module.exports = {
  DaywalkerStoreQuery,
};
