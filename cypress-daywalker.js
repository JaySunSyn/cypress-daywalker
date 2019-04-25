((global) => {
	if (!global.Cypress) {
		return;
  }
  
  function getSelectorType(selector) {
    const types = {
      classes: false,
      class: false,
      id: false,
    };
    if (selector.indexOf('#') > -1) {
      types.id = selector.split('#')[1];
    }
    if (selector.indexOf('.') > -1 && selector.split('.').length > 2) {
      const multiClassKey = selector.split('.').slice(1).join('$');
      types.classes = multiClassKey;
    }
    if (selector.indexOf('.') > -1 && selector.split('.').length <= 2) {
      types.class = selector.split('.')[1];
    }
    return types;
  }

  function Store(fn, ln) {
    this.data = {};
    
    const push = (arr, instance) => {
      if (arr.find(node => node == instance)) {
        return;
      }
      arr.push(instance);
    }

    this.add = function(tagName, instance) {
      this.data.tags = this.data.tags || {};
      this.data.tags[tagName.toLowerCase()] = this.data.tags[tagName] || [];
      push(this.data.tags[tagName], instance);

			if (instance.id) {
				this.data.ids = this.data.ids || {};
				this.data.ids[instance.id] = this.data.ids[instance.id] || [];
				push(this.data.ids[instance.id], instance)
			}

			this.data.classes = this.data.classes || {};
			const classes = Array.from(instance.classList);
			classes.forEach(function(c) {
				this.data.classes[c] =  this.data.classes[c] || [];
				push(this.data.classes[c], instance);
			}, this)

			this.data.multiClasses =  this.data.multiClasses || {};
			const multiClassKey = classes.join('$');
			this.data.multiClasses[multiClassKey] = this.data.multiClasses[multiClassKey] || [];
			push(this.data.multiClasses[multiClassKey], instance);
    };
    this.byTag = function(tagName) {
      return this.data.tags[tagName];
    };
    // cy.get('paper-button[title=Already have an account? Sign in]')
    this.byAttr = function(tagName, key, value) {
      if (this.data.tags[tagName] == null) {
        return;
      }
      return this.byTag(tagName).find(node => node.getAttribute(key) === value);
    };
    this.byProp = function(tagName, key, value) {
      if (this.data.tags[tagName] == null) {
        return;
      }
      return this.byTag(tagName).find(node => node[key] === value);
    };
    this.byId = function(tagName, id) {
      if (tagName && this.data.tags[tagName] == null) {
        return;
			}
			if (tagName) {
				return this.data.tags[tagName].find(node => node.id === id);
			}
			if (!this.data.ids[id]) {
				return;
      }
      return this.data.ids[id][0];
		};
		// cy.get('.green.red');
		this.byClasses = function(tagName, classList) {
			const multiClassKey = classList.join('$');
			return this.data.multiClasses[multiClassKey];
		};
    this.byClass = function(tagName, cls) {
      if (tagName && this.data.tags[tagName] == null) {
        return;
			}
			if (tagName) {
				return this.data.tags[tagName].filter(node => Array.from(node.classList).indexOf(cls) > -1);
			}
			if (!this.data.classes[cls]) {
				return;
			}
      return this.data.classes[cls];
    };
    // cy.get('.btn--signin paper-button');
    this.byDirectParent = function(parentSelector, childSelector) {
      const getPossibleElements = (selector) => {
        const types = getSelectorType(selector)
        if (types.id) {
          return this.data.ids[types.id];
        }
        if (types.classes) {
          return this.data.multiClasses[types.classes];
        }
        if (types.class) {
          return this.data.classes[types.class];
        }
        return this.data.tags[selector]
      }

      const parentSelectorType = getSelectorType(parentSelector);

      return getPossibleElements(childSelector)
        .filter(element => {
          const parent = element.parentNode;
          const classList = (parent.classList && Array.from(parent.classList)) || [];
          if (parentSelectorType.id) {
            return parent.id === parentSelectorType.id;
          }
          if (parentSelectorType.class) {
            return classList.indexOf(parentSelectorType.class) > -1;
          }
          if (parentSelectorType.classes) {
            return parentSelectorType.classes.split('$')
              .every(c => classList.indexOf(c) > -1);
          }
          return parent && parent.tagName.toLowerCase() === parentSelector;
        });
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
