describe("Mon premier test", () => {
  it("should show homepage", () => {
    cy.visit("http://localhost:5173");
    cy.contains("JirAI");
  });
  it("should have a list to click on users", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Users").click();
    cy.url().should("eq", "http://localhost:5173/users");
    cy.contains("Liste des utilisateurs");
  });
});
