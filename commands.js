/**
 * Supported selectors:
 *
 * #emailInput
 * paper-button#emailInput
 * paper-button[title=Already have an account? Sign in]
 * .btn--signin paper-button
 * paper-button.button
 * .button
 */
Cypress.Commands.overwrite('get', (originalFn, selector, options) => {
    Cypress.log({
        displayName: 'DAYWALKER GET',
        message: `&nbsp;=> ${selector}`,
    });

    function queryCustomElement(element, selector) {
        if (element.shadowRoot) {
            return element.shadowRoot.querySelectorAll(selector);
        }
        return element.querySelectorAll(selector);
    }

    function getCustomElements(w, selector, options, originalFn) {
        const byDirectParent = selector.indexOf(' > ') > -1;
        if (byDirectParent) {
            const parentSelector = selector.split(' > ')[0];
            const childSelector = selector.split(' > ')[1];
            return w.Daywalker.store.byDirectParent(parentSelector, childSelector);
        }

        const byId = selector.indexOf('#') > - 1 && selector.indexOf(' ') === - 1;
        if (byId) {
            return w.Daywalker.store.byId(selector.split('#')[0], selector.split('#')[1]);
        }

        const byAttr = selector.indexOf('[') > - 1;
        if (byAttr) {
            const tag = selector.split('[')[0];
            const fullAttr = selector.split('[')[1].replace(']', '');
            const value = fullAttr.split('=')[1];
            const attr = fullAttr.split('=')[0];
            return w.Daywalker.store.byAttr(tag, attr, value);
        }

        const byPath = selector.indexOf(' ') > - 1;
        if (byPath) {
            const path = selector.split(' ');
            let element;
            path.forEach(pathKey => {
                let root;
                if (element == null) {
                    root = w.document;
                } else {
                    root = element.shadowRoot ? element.shadowRoot : element;
                }
                element = root.querySelector(pathKey);
            });
            return element;
        }

        const byClasses = selector.split('.').length > 2;
        if (byClasses) {
            return w.Daywalker.store.byClass(selector.split('.'));
        }

        const byClass = selector.indexOf('.') > - 1;
        if (byClass) {
            return w.Daywalker.store.byClass(selector.split('.')[0], selector.split('.')[1]);
        }
        return w.Daywalker.store.byTag(selector);
    }

    return cy.window({ log: false }).then(w => new Cypress.Promise((resolve) => {
        let result = getCustomElements(w, selector, options, originalFn);

        if ((options == null || options.multi == null) && Array.isArray(result)) {
            result = result[0];
        }

        if (result != null) {
            resolve(result);
            return true;
        }
        originalFn(selector, options).then(result => resolve(result));
    }));
});


Cypress.Commands.overwrite('should', (originalFn, jq, action, value) => {
    Cypress.log({
        displayName: 'DAYWALKER SHOULD',
        message: `&nbsp;=> ${action} => ${value}`,
    });
    return cy.window({ log: false }).then(w => new Cypress.Promise((resolve) => {
        const node = jq[0];
        let attached;
        if (!w.document.body.contains(node)) {
            // Attach node to dom in order to avoid 'not attached' error from cypress
            attached = node.cloneNode();
            document.body.appendChild(attached);
            jq[0] = attached;
        }
        originalFn(jq, action, value)
            .then((result) => {
                if (attached) {
                    attached.remove();
                }
                resolve(result)
            });
    }));
});

Cypress.Commands.add('dispatch', { prevSubject: true }, (subject, eventName, options) => {
    const element = subject[0];
    Cypress.log({
        displayName: 'DAYWALKER DISPATCH',
        message: `${element.tagName} => ${eventName}`,
    });
    
    if (element) {
        element.dispatchEvent(new Event(eventName), options)
    };
    return subject;
});