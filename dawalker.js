const Q = require('./daywalker-store-query');


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

    _queryStore(selector) {
        if (selector.indexOf(' > ') > -1) {
            return this.queryByDirectParent(selector);
        }

        if (this._isByPath(selector)) {
            return this.queryByPath(selector);
        }

        if (selector.indexOf('#') > - 1 && selector.indexOf(' ') === - 1) {
            return this.queryById(selector);
        }

        if (selector.indexOf('[') > - 1) {
            return this.queryByAttr(selector);
        }

        if (selector.split('.').length > 2) {
            return this.queryByClasses(selector);
        }
        
        if (selector.indexOf('.') > - 1) {
            return this.queryByClass(selector);
        }
        return this.queryByTag(selector)
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
        return Q.byTag(this.store, selector);
    }

    // .foo.moo
    queryByClasses(selector) {
        return Q.byClass(this.store, selector);
    }

    // .foo
    queryByClass(selector) {
        return Q.byClass(this.store, selector);
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
        const result = this._queryStore(selector);
        if (!Array.isArray(result)) {
            return [result];
        }
        return result;
    }

    querySelector(selector) {
        const result = this._queryStore(selector);
        if (Array.isArray(result)) {
            return result[0];
        }
        return result;
    }

}

module.exports = Daywalker;