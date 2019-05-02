
context('Example', () => {
  beforeEach(() => {
    cy.on('window:before:load', (w) => {
      const script = w.document.createElement('script');
      script.src = '/node_modules/cypress-daywalker/cypress-daywalker.js';
      w.document.querySelector('head').appendChild(script);
    });

    cy.visit('http://localhost:8080/');
  });

  it('root level - native', () => {
    cy.get('div');
    cy.get('div #world').should('have.text', 'World');
  });

  it('root level - custom element', () => {
    cy.get('my-element');
  });

  it('native child in custom element', () => {
    cy.get('my-element div#jay').should('have.text', 'My ID custom element');
  });

  it('nested custom element', () => {
    cy.get('paper-button');
    cy.get('paper-button', {multi: true})
        .should((buttons) => {
          assert(buttons.length === 2, 'Did not find 2 paper-buttons');
        });
  });

  it('nested custom element with path', () => {
    cy.get('#customContainer my-element paper-button');
  });

  it('custom element via id', () => {
    // The first found input with id 'important'
    cy.get('#important').setProp('This is super important');

    // The second input
    cy.get('#customContainer my-element paper-input#important').setProp('This is also super important');
  });

  it('nth', () => {
    cy.get('my-element:nth(1)');
  });

  it('class', () => {
    cy.get('.input-class');
  });

  it('classes', () => {
    cy.get('my-element .foo.moo');
  });

  it('direct child', () => {
    cy.get('#customContainer > my-element').should('have.class', 'in-container');
    cy.get('div > paper-button span').should('have.text', 'Click');
    cy.get('div > paper-button span').should('have.class', 'label');
    cy.get('div > paper-button').dispatch('click');
  });

  it('call function', () => {
    cy.get('paper-input').call('focus');
  });

  it('set properties', () => {
    cy.get('paper-input').setProp('World');
    cy.get('paper-input').setProp('Hello', 'label');
  });
});
