describe("Mon premier test", () => {
  it("should show homepage", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Salut les devs");
  });
  it("should increment counter", () => {
    cy.visit("http://localhost:5173");
    cy.get("button[data-cy=increment-button]")
      .contains("count is 0")
      .click()
      .contains("count is 1");
  });
});
