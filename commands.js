import { Daywalker } from './daywalker';

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