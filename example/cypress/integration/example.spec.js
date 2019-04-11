
context('Example', () => {
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
        cy.get('my-element div#jay').should('have.text', 'My ID custom element');
    });

    it('nested custom element', () => {
        cy.get('paper-button');
        cy.get('paper-button', {multi: true})
            .should(buttons => {
                assert(buttons.length === 2, 'Did not find 2 paper-buttons')
            });
    });

    it('nested custom element with path', () => {
        cy.get('#customContainer my-element paper-button');
    });

    it('nth', () => {
        cy.get('my-element:nth(1)');
    });

    it('direct child', () => {
        cy.get('#customContainer > my-element').should('have.class', 'in-container');
        cy.get('div > paper-button span').should('have.text', 'Click');
        cy.get('div > paper-button span').should('have.class', 'label');
        cy.get('div > paper-button').dispatch('click');
    });
});
