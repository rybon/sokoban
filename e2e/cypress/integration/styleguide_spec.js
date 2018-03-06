describe('Styleguide', () => {
  it('should display the styleguide', () => {
    cy.visit('styleguide')

    cy.contains('Sokoban Style Guide').should('exist')
  })
})
