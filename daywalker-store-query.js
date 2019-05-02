class DaywalkerStoreQuery {
  constructor(store, w) {
    this.store = store;
    this.global = w;
  }

  querySelectorAll(selector) {
    const result = this.queryStore(selector);
    if (!Array.isArray(result)) {
      return result == null ? [] : [result];
    }
    return result;
  }

  querySelector(selector, nth = 0) {
    const result = this.queryStore(selector);
    if (Array.isArray(result)) {
      return result.length > nth ? result[nth] : null;
    }
    return result;
  }

  queryStore(selector) {
    if (this.__selectorIsDirectParent(selector)) {
      return this._byDirectParent(selector);
    }

    if (this.__selectorIsPath(selector)) {
      return this._byPath(selector);
    }

    if (this.__selectorIsId(selector)) {
      return this._byId(selector);
    }

    if (this.__selectorIsAttr(selector)) {
      return this._byAttr(selector);
    }

    if (this.__selectorIsClass(selector)) {
      return this._byClass(selector);
    }
    return this._byTag(selector);
  }

  _byId(selector) {
    const tagName = selector.split('#')[0];
    const id = selector.split('#')[1];

    if (tagName && this.store.data.tags[tagName] == null) {
      return [];
    }
    if (tagName) {
      return this.store.data.tags[tagName].find((node) => node.id === id);
    }
    return this.store.data.ids[id];
  }

  _byTag(selector) {
    return this.store.data.tags[selector];
  }

  _byClass(selector) {
    const classList = this.__getClassArrayFromSelector(selector);

    const firstClassInstances = this.store.classes[classList.shift()];
    return classList.map((cls) => {
      const instances = this.store.classes[cls];
      return firstClassInstances.filter((instance) => instances.includes(instance));
    });
  }
  /**
   * paper-button[title=Hello you]
   * @param {String} selector CSS selector
   * @return {Array}
   */
  _byAttr(selector) {
    const tag = selector.split('[')[0];
    const fullAttr = selector.split('[')[1].replace(']', '');
    const value = fullAttr.split('=')[1];
    const attr = fullAttr.split('=')[0];
    if (this.store.data.tags[tagName] == null) {
      return;
    }
    return this._byTag(tag).find((node) => node.getAttribute(attr) === value);
  }

  _byPath(selector, root) {
    const path = selector.split(' ');
    let element;
    let base;

    if (root != null) {
      base = root;
    } else if (this.__isCustomElement(path[0])) {
      const basePath = path.shift();
      base = this.querySelector(basePath);
    } else {
      base = this.global.document;
    }

    path.forEach((pathKey) => {
      if (element != null) {
        base = element.shadowRoot ? element.shadowRoot : element;
      }
      element = this.__queryInElement(base, pathKey);
      element = Array.isArray(element) ? element[0] : element;
    });
    return element;
  }
  /**
   * .main > paper-button
   * @param {String} selector CSS selector
   * @return {Array}
   */
  _byDirectParent(selector) {
    let parentSelector = selector.split(' > ')[0];
    let nth;
    const childSelector = selector.split(' > ')[1];

    const nthParse = this.__parseNth(parentSelector);
    if (nthParse != null) {
      nth = nthParse.nth;
      parentSelector = nthParse.selector;
    }

    if (this.__selectorIsPath(childSelector)) {
      const firstPathKeyOfChild = childSelector.split(' ')[0];
      const remainingPathKeysOfChild = childSelector.split(' ').slice(1).join(' ');

      const child = this.querySelector(firstPathKeyOfChild, nth);

      return this._byPath(remainingPathKeysOfChild, child);
    }
    return this._byParent(childSelector, parentSelector);
  }

  _byParent(childSelector, parentSelector) {
    // Get all possible (child) elements and filter by analyzing their parent
    return this.querySelectorAll(childSelector)
        .filter((element) => {
          const parent = element.parentNode;

          const parentClasses = (parent.classList && Array.from(parent.classList)) || [];

          const selId = this.__selectorIsId(parentSelector);
          if (selId) {
            return parent.id === selId;
          }
          if (this.__selectorIsClass(parentSelector)) {
            const expectedParentClasses = this.__getClassArrayFromSelector(parentSelector);
            return expectedParentClasses.every((cls) => parentClasses.includes(cls));
          }
          return parent && parent.tagName.toLowerCase() === parentSelector;
        });
  }

  __selectorIsId(selector) {
    if (selector.indexOf('#') > - 1 && selector.indexOf(' ') === - 1) {
      return selector.split('#')[1];
    }
    return null;
  }

  __selectorIsDirectParent(selector) {
    return selector.indexOf(' > ') > -1;
  }

  __selectorIsAttr(selector) {
    return selector.indexOf('[') > - 1;
  }

  __selectorIsClass(selector) {
    return selector.indexOf('.') > - 1;
  }

  __selectorIsPath(selector) {
    if (selector.indexOf(' ') === -1) {
      return false;
    }
    if (selector.indexOf('[') > -1 && !this.__attrSelectorContainsSpaces(selector)) {
      return true;
    }
    return selector.split('[')[0].indexOf(' ') > -1;
  }

  __parseNth(selector) {
    if (selector.indexOf(':nth') === -1) {
      return null;
    }
    return {
      nth: parseInt(selector.split(':')[1].match(/\d+/)[0]),
      selector: selector.split(':')[0],
    };
  }

  __queryInElement(element, sel) {
    if (element == null) {
      return;
    }
    let result;
    let selector = sel;
    let nth;

    const nthParse = this.__parseNth(sel);
    if (nthParse != null) {
      nth = nthParse.nth;
      selector = nthParse.selector;
    }

    if (element.shadowRoot) {
      result = element.shadowRoot.querySelectorAll(selector);
    }
    if (result == null || result.length === 0) {
      result = element.querySelectorAll(selector);
    }
    try {
      if (nth != null) {
        return Array.from(result)[nth - 1];
      }
      return Array.from(result);
    } catch (error) {
      return result;
    }
  }

  __isCustomElement(tagSelector) {
    if (this.__selectorIsAttr(tagSelector)) {
      // otherwise, a[href=my-page.html] would match as a custom element
      const elementSelector = tagSelector.split('[')[0];
      return elementSelector.indexOf('-') > -1;
    }
    return tagSelector && tagSelector.indexOf('-') > -1;
  }

  __getClassArrayFromSelector(selector) {
    const classes = selector.split('.');
    classes.shift();
    return classes;
  }

  __attrSelectorContainsSpaces(selector) {
    // 'my-element a[title=Hans runs] a[title=Piip poop]'
    let parts = selector.split('[');
    // ["my-element a", "title=Hans runs] a", "title=Piip poop]"]
    parts.shift();
    // ["title=Hans runs] a", "title=Piip poop]"]
    parts = parts.map((e) => e.split(']')).map((e) => e[0]);
    // ["title=Hans runs", "title=Piip poop"]
    return parts.some((part) => part.indexOf(' ') > -1);
  }
};

module.exports = DaywalkerStoreQuery;
