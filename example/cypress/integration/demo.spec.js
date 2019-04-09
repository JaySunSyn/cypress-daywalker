
context('Misc', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/');
    });

    it('div', () => {
        cy.get('div')._click();
    });
});
