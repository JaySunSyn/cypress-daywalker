import '../../node_modules/cypress-daywalker/commands';

Cypress.Commands.add('_click', { prevSubject: true }, (subject) => {
  const element = subject.get(0);
  if (element) element.dispatchEvent(new MouseEvent('click'));
  Cypress.log({
    displayName: '_click',
    message: element.nodeName,
  });
  return subject;
});
