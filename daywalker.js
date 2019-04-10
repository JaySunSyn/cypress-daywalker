
export class Daywalker {
    constructor(w = window) {
        this.global = w;
    }

    get store() {
        return this.global.Daywalker.store;
    }

    _getSelectorFn(selector) {
        if (selector.indexOf(' > ') > -1) {
            return selector => this.queryByDirectParent.call(this, selector);
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

        if (selector.indexOf(' ') > - 1) {
            return selector => this.queryByPath.call(this, selector);
        }

        return selector => this.queryByTag.call(this, selector);
    }

    _query(element, selector) {
        let result;
        if (element.shadowRoot) {
            result = element.shadowRoot.querySelectorAll(selector);
        }
        if (result == null || result.length === 0) {
            result = element.querySelectorAll(selector);
        }
        try {
            return Array.from(result);
        } catch (error) {
            return result;
        }
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
        path.forEach(pathKey => {
            let base;
            if (element == null) {
                base = root || this.global.document;
            } else {
                base = element.shadowRoot ? element.shadowRoot : element;
            }
            
            element = this._query(base, pathKey);
            element = Array.isArray(element) ? element[0] : element;
        });
        return element;
    }

    // .main > paper-button
    queryByDirectParent(selector) {
        const parentSelector = selector.split(' > ')[0];
        const childSelector = selector.split(' > ')[1];
        if (childSelector.indexOf(' ') > -1) {
            let child = this.store.byDirectParent(parentSelector, childSelector.split(' ')[0]);
            if (Array.isArray(child)) {
                child = child[0];
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
