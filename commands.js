class Daywalker {
    constructor(w = window) {
        this.global = w;
    }

    get store() {
        return this.global.Daywalker.store;
    }

    _attrSelectorContainsSpaces(selector) {
        // 'my-element a[title=Hans runs] a[title=Piip poop]'
        let parts = selector.split('[');
        // ["my-element a", "title=Hans runs] a", "title=Piip poop]"]
        parts.shift()
        // ["title=Hans runs] a", "title=Piip poop]"]
        parts = parts.map(e => e.split(']')).map(e => e[0]);
        // ["title=Hans runs", "title=Piip poop"]
        return parts.some(part => part.indexOf(' ') > -1);
    }

    _isByPath(selector) {
        if (selector.indexOf(' ') === -1) {
            return false;
        }
        if (selector.indexOf('[') > -1 && !this._attrSelectorContainsSpaces(selector)) {
            return true;
        }
        return selector.split('[')[0].indexOf(' ') > -1;
    }

    _getSelectorFn(selector) {
        if (selector.indexOf(' > ') > -1) {
            return selector => this.queryByDirectParent.call(this, selector);
        }

        if (this._isByPath(selector)) {
            return selector => this.queryByPath.call(this, selector);
        }

        if (selector.indexOf('#') > - 1 && selector.indexOf(' ') === - 1) {
            return selector => this.queryById.call(this, selector);
        }

        if (selector.indexOf('[') > - 1) {
            return selector => this.queryByAttr.call(this, selector);
        }

        if (selector.split('.').length > 2) {
            return selector => this.queryByClasses.call(this, selector);
        }
        
        if (selector.indexOf('.') > - 1) {
            return selector => this.queryByClass.call(this, selector);
        }

        return selector => this.queryByTag.call(this, selector);
    }

    _query(element, sel) {
        if (element == null) {
            return;
        }
        let result;
        let selector = sel;
        let nth;
        if (selector.indexOf(':nth') > -1) {
            nth = parseInt(sel.split(':')[1].match(/\d+/)[0]);
            selector = sel.split(':')[0];
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

    _isCustomElement(selector) {
        // TODO: a[href=my-page.html] would match as a custom element
        return selector && selector.indexOf('-') > -1;
    }
    // paper-button
    queryByTag(selector) {
        return this.store.byTag(selector);
    }

    // .foo.moo
    queryByClasses(selector) {
        return this.store.byClass(selector.split('.'));
    }

    // .foo
    queryByClass(selector) {
        return this.store.byClass(selector.split('.')[0], selector.split('.')[1]);
    }

    // #container
    queryById(selector) {
        return this.store.byId(selector.split('#')[0], selector.split('#')[1]);
    }

    // .main paper-button
    queryByPath(selector, root) {
        const path = selector.split(' ');
        let element;
        let base;

        if (root != null) {
            base = root;
        } else if (this._isCustomElement(path[0])) {
            const basePath = path.shift();
            base = this.querySelector(basePath);
        } else {
            base = this.global.document;
        }

        path.forEach(pathKey => {
            if (element != null) {
                base = element.shadowRoot ? element.shadowRoot : element;
            }
            element = this._query(base, pathKey);
            element = Array.isArray(element) ? element[0] : element;
        });
        return element;
    }

    // .main > paper-button
    queryByDirectParent(selector) {
        let parentSelector = selector.split(' > ')[0];
        const childSelector = selector.split(' > ')[1];

        // TODO: Don't duplicate
        let sel = parentSelector;
        let nth;
        if (sel.indexOf(':nth') > -1) {
            nth = parseInt(sel.split(':')[1].match(/\d+/)[0]);
            parentSelector = sel.split(':')[0];
        }

        // TODO: Make it more generic
        if (childSelector.indexOf(' ') > -1) {
            let child = this.store.byDirectParent(parentSelector, childSelector.split(' ')[0]);
            if (Array.isArray(child)) {
                child = child[(nth && nth - 1) || 0];
            }
            return this.queryByPath(childSelector.split(' ').slice(1).join(' '), child);
        }
        return this.store.byDirectParent(parentSelector, childSelector);
    }

    // paper-button[title=Hello you]
    queryByAttr(selector) {
        const tag = selector.split('[')[0];
        const fullAttr = selector.split('[')[1].replace(']', '');
        const value = fullAttr.split('=')[1];
        const attr = fullAttr.split('=')[0];
        return this.store.byAttr(tag, attr, value);
    }

    querySelectorAll(selector) {
        const fn = this._getSelectorFn(selector);
        const result = fn(selector);
        if (!Array.isArray(result)) {
            return [result];
        }
        return result;
    }

    querySelector(selector) {
        const fn = this._getSelectorFn(selector);
        const result = fn(selector);
        if (Array.isArray(result)) {
            return result[0];
        }
        return result;
    }

}

Cypress.Commands.overwrite('get', (originalFn, selector, options) => {
    Cypress.log({
        displayName: 'DAYWALKER GET',
        message: `&nbsp;=> ${selector}`,
    });

    return cy.window({ log: false }).then(w => new Cypress.Promise((resolve, reject) => {
        const walker = new Daywalker(w);
        const result = options && options.multi
            ? walker.querySelectorAll(selector)
            : walker.querySelector(selector);
        if (result != null) {
            resolve(result);
            return true;
        }
        originalFn(selector, options)
            .then(resolve)
            .catch(reject);
    }));
});


Cypress.Commands.overwrite('should', (originalFn, jq, action, value, o) => {
    Cypress.log({
        displayName: 'DAYWALKER SHOULD',
        message: `&nbsp;=> ${action} => ${value}`,
    });

    return cy.window({ log: false })
        .then(w => new Cypress.Promise((resolve, reject) => {
            const node = jq[0];
            if (node == null || w.document.body.contains(node)) {
                originalFn(jq, action, value)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            const attached = node.cloneNode(true);
            document.body.appendChild(attached);
            jq[0] = attached;

            originalFn(jq, action, value)
                .then((result) => attached.remove())
                .then(resolve)
                .catch(reject);
        }));
});

Cypress.Commands.add('dispatch', { prevSubject: true }, (subject, event, options) => {
    const element = subject[0];
    const eventStr = typeof event === 'string' ? event : event.toString();
    const e = typeof event === 'string' ? new Event(event) : event;

    Cypress.log({
        displayName: 'DAYWALKER DISPATCH',
        message: `${element.tagName} => ${eventStr}`,
    });

    if (element) {
        element.dispatchEvent(e, options)
    };
    return subject;
});