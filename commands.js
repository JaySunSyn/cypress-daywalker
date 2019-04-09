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

    function isNativeElement(element){
        if(element.tagName.indexOf('-') === -1) {
            return true;
        }
        return false;
    }

    function getCustomElements(w, selector, options) {

        // cy.get('.main_value ing-uic-amount$span#ingUicAmountFormatted')
        const byNestedNativeTag = selector.indexOf('$') > -1;
        if (byNestedNativeTag) {
            const customElementSelector = selector.split('$')[0];
            const nativeElementSelector = selector.split('$')[1];
            const customElement = getCustomElements(w, customElementSelector)
            if (!customElement) {
                return customElement
            }
            if (nativeElementSelector.indexOf(':nth') > -1) {
                const nth = parseInt(nativeElementSelector.match(/\d+/)[0]);
                return customElement.shadowRoot.querySelectorAll(nativeElementSelector)[nth];
            }
            return customElement.shadowRoot.querySelector(nativeElementSelector);
        }

        const byId = selector.indexOf('#') > - 1;
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

        const byParent = selector.indexOf(' ') > - 1;
        if (byParent) {
            return w.Daywalker.store.byParent(selector.split(' ')[1], selector.split(' ')[0].replace('.', ''));
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
        let result = getCustomElements(w, selector, options);

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
