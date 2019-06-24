
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
    cy.dwGet('div');
    cy.dwGet('div #world').should('have.text', 'World');
  });

  it('root level - custom element', () => {
    cy.dwGet('my-element');
  });

  it('native child in custom element', () => {
    cy.dwGet('my-element div#jay').dwAttach().should('have.text', 'My ID custom element').dwDetach();
  });

  it('nested custom element', () => {
    cy.dwGet('paper-button');
    cy.dwGet('paper-button', {all: true})
        .should((buttons) => {
          assert(buttons.length === 2, 'Did not find 2 paper-buttons');
        });
  });

  it('nested custom element with path', () => {
    cy.dwGet('#customContainer my-element paper-button');
  });

  it('custom element via id', () => {
    // The first found input with id 'important'
    cy.dwGet('#important').dwSetProp('This is super important');

    // The second input
    cy.dwGet('#customContainer my-element paper-input#important').dwSetProp('This is also super important');

    // The third input via nth
    cy.dwGet('#customContainer my-element paper-input:nth(3) input').dwSetProp('This is ALSO super important');
  });

  it('nth', () => {
    cy.dwGet('my-element:nth(1)');
  });

  it('class', () => {
    cy.dwGet('.input-class');
  });

  it('classes', () => {
    cy.dwGet('my-element .foo.moo');
  });

  it('direct child', () => {
    cy.dwGet('#customContainer > my-element').dwAttach().should('have.class', 'in-container').dwDetach();
    cy.dwGet('div > paper-button span').dwAttach().should('have.text', 'Click').dwDetach();
    cy.dwGet('div > paper-button span').dwAttach().should('have.class', 'label').dwDetach();
    cy.dwGet('div > paper-button').dispatch('click');
  });

  it('call function', () => {
    cy.dwGet('paper-input').dwCall('focus');
  });

  it('set properties', () => {
    cy.dwGet('paper-input').dwSetProp('World');
    cy.dwGet('paper-input').dwSetProp('Hello', 'label');
  });
});
