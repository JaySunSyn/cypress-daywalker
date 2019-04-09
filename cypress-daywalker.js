((global) => {
	if (!global.Cypress) {
		return;
	}
  function Store(fn, ln) {
		this.data = {};

    this.add = function(tagName, instance) {
      this.data[tagName] = this.data[tagName] || [];
			this.data[tagName].push(instance);
			if (instance.id) {
				this.data.ids = this.data.ids || {};
				this.data.ids[instance.id] = this.data.ids[instance.id] || [];
				this.data.ids[instance.id].push(instance)
			}

			this.data.classes = this.data.classes || {};
			const classes = Array.from(instance.classList);
			classes.forEach(function(c) {
				this.data.classes[c] =  this.data.classes[c] || [];
				this.data.classes[c].push(instance);
			}, this)

			this.data.multiClasses =  this.data.multiClasses || {};
			const multiClassKey = classes.join('$');
			this.data.multiClasses[multiClassKey] = this.data.multiClasses[multiClassKey] || [];
			this.data.multiClasses[multiClassKey].push(instance);
    };
    this.byTag = function(tagName) {
      return this.data[tagName];
    };
    // cy.get('paper-button[title=Already have an account? Sign in]')
    this.byAttr = function(tagName, key, value) {
      if (this.data[tagName] == null) {
        return;
      }
      return this.byTag(tagName).find(node => node.getAttribute(key) === value);
    };
    this.byProp = function(tagName, key, value) {
      if (this.data[tagName] == null) {
        return;
      }
      return this.byTag(tagName).find(node => node[key] === value);
    };
    this.byId = function(tagName, id) {
      if (tagName && this.data[tagName] == null) {
        return;
			}
			if (tagName) {
				return this.data[tagName].find(node => node.id === id);
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
      if (tagName && this.data[tagName] == null) {
        return;
			}
			if (tagName) {
				return this.data[tagName].filter(node => Array.from(node.classList).indexOf(cls) > -1);
			}
			if (!this.data.classes[cls]) {
				return;
			}
      return this.data.classes[cls];
    };
    // cy.get('.btn--signin paper-button');
    this.byParent = function(tagName, parentClass) {
      if (this.data[tagName] == null) {
        return;
      }
      if (parentClass.indexOf(':nth(') > -1) {
        const nth = parseInt(parentClass.match(/\d+/)[0]) - 1;
        const cls = parentClass.split(':')[0];
        let result;
        try {
          result = this.data[tagName].filter(node => {
            if (node.parentNode == null || !node.parentNode.classList) {
              return;
            }
            return Array.from(node.parentNode.classList).indexOf(cls) > -1;
          })[nth]
        } catch (error) {
          result = null;
        }
        return result;
      }
      return this.data[tagName].find(node => {
        if (node.parentNode == null || !node.parentNode.classList) {
          return;
        }
        return Array.from(node.parentNode.classList).indexOf(parentClass) > -1;
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
