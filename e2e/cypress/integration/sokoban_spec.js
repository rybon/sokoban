describe('Sokoban', () => {
  it('should display a title', () => {
    cy.visit('/')

    cy
      .get('title')
      .contains('Sokoban')
      .should('exist')
  })
})
