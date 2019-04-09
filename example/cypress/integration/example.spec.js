
context('Misc', () => {
    beforeEach(() => {
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
        cy.get('my-element div#jay');
    });

    it('nested custom element', () => {
        cy.get('paper-button');
    });

    it('nested custom element with path', () => {
        cy.get('#customContainer my-element paper-button');
    });

    it('direct child', () => {
        cy.get('#customContainer > my-element').should('have.class', 'in-container');
        cy.get('div > paper-button').should('have.class', 'click');
        cy.get('div > paper-button').dispatch('click');
    });
});
