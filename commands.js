const Daywalker = require('./dawalker');

function ensureAttached(w, node) {
  if (node == null || w.document.body.contains(node)) {
    return;
  }
  const attached = node.cloneNode(true);
  document.body.appendChild(attached);
  return attached;
}

Cypress.Commands.add('dwGet', {prevSubject: false}, (selector, options = {}) => {
  Cypress.log({
    displayName: 'DAYWALKER GET',
    message: `&nbsp;=> ${selector}`,
  });

  return cy.window({log: false}).then((w) => {
    const walker = new Daywalker(w);
    const maxRetries = options.maxRetries || 3;
    const retryDelayBase = options.retryDelayBase || 500;

    return new Cypress.Promise((resolve) => {
      let tries = 0;
      let result;

      function tryQuery() {
        result = options.all
          ? walker.querySelectorAll(selector)
          : walker.querySelector(selector, (options.nth) || 1);

        if (result == null && tries <= maxRetries) {
          setTimeout(() => {
            result = tryQuery();
          }, retryDelayBase * tries);
          tries += 1;
          return;
        }
        resolve(result);
      }

      tryQuery();
    })
        .then((result) => {
          if (result == null) {
            return cy.get(selector, options);
          }
          return result;
        });
  });
});

Cypress.Commands.add('dwAttach', {prevSubject: true}, (subject) => {
  Cypress.log({
    displayName: 'DAYWALKER ATTACH (CLONE)',
    message: `&nbsp; ${subject[0].tagName}`,
  });
  return cy.window({log: false}).then((w) => new Cypress.Promise((resolve, reject) => {
    const attachedNode = ensureAttached(w, subject[0]);
    if (attachedNode) {
      attachedNode.__proto__.dwDetach = attachedNode.remove;
    }
    resolve(attachedNode || subject[0]);
  }));
});

Cypress.Commands.add('dwDetach', {prevSubject: true}, (subject) => {
  Cypress.log({
    displayName: 'DAYWALKER DETACH',
    message: `&nbsp; ${subject[0].tagName}`,
  });
  return cy.window({log: false}).then((w) => new Cypress.Promise((resolve, reject) => {
    const node = subject[0];
    if (node.detach) {
      debugger;
      node.dwDetach();
    }
    resolve(subject[0]);
  }));
});

Cypress.Commands.add('dwSetProp', {prevSubject: true}, (subject, value, prop = 'value') => {
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

Cypress.Commands.add('dwCall', {prevSubject: true}, (subject, fnName, args = []) => {
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

Cypress.Commands.add('dwDispatch', {prevSubject: true}, (subject, event, options) => {
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
