const Daywalker = require('./dawalker');

function ensureAttached(w, node) {
  if (node == null || w.document.body.contains(node)) {
    return;
  }
  const attached = node.cloneNode(true);
  document.body.appendChild(attached);
  return attached;
}

function attachAndReturnOriginalFn(...args) {
  return cy.window({log: false})
      .then((w) => new Cypress.Promise((resolve, reject) => {
        const originalFn = args.shift();
        const jq = args[0];
        const node = jq[0];
        const attached = ensureAttached(w, node);

        if (attached) {
          jq[0] = attached;
          args[0] = jq;
        }

        originalFn(...args)
            .then((result) => {
              if (attached) {
                attached.remove();
              }
              return result;
            })
            .then(resolve)
            .catch(reject);
      }));
}

Cypress.Commands.overwrite('get', (originalFn, selector, options) => {
  Cypress.log({
    displayName: 'DAYWALKER GET',
    message: `&nbsp;=> ${selector}`,
  });

  return cy.window({log: false}).then((w) => new Cypress.Promise((resolve, reject) => {
    const walker = new Daywalker(w);
    const result = options && options.all
            ? walker.querySelectorAll(selector)
            : walker.querySelector(selector, (options && options.nth) || 0);
    if (result != null) {
      resolve(result);
      return true;
    }
    originalFn(selector, options)
        .then(resolve)
        .catch(reject);
  }));
});

Cypress.Commands.overwrite('should', (...args) => {
  Cypress.log({
    displayName: 'DAYWALKER SHOULD',
    message: `&nbsp;=> ${args[2]} => ${args[3]}`,
  });
  return attachAndReturnOriginalFn(...args);
});

Cypress.Commands.add('setProp', {prevSubject: true}, (subject, value, prop = 'value') => {
  const element = subject[0];
  Cypress.log({
    displayName: 'DAYWALKER SET PROP',
    message: `${element.tagName} => ${value}`,
  });
  if (element.set != null) {
    element.set(prop, value);
    return subject;
  }
  element[prop] = value;
  return subject;
});

Cypress.Commands.add('call', {prevSubject: true}, (subject, fnName, args = []) => {
  const element = subject[0];
  Cypress.log({
    displayName: 'DAYWALKER CALL',
    message: `${element.tagName} => ${fnName}`,
  });

  if (element) {
    element[fnName](...args);
  };
  return subject;
});

Cypress.Commands.add('dispatch', {prevSubject: true}, (subject, event, options) => {
  const element = subject[0];
  const eventStr = typeof event === 'string' ? event : event.toString();
  const e = typeof event === 'string' ? new Event(event) : event;

  Cypress.log({
    displayName: 'DAYWALKER DISPATCH',
    message: `${element.tagName} => ${eventStr}`,
  });

  if (element) {
    element.dispatchEvent(e, options);
  };
  return subject;
});
