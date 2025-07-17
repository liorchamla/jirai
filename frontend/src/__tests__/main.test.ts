import { describe, it, expect } from "vitest";

describe("Fonctionnalités du frontend", () => {
  it("devrait retourner vrai pour 1 + 1 égal à 2", () => {
    expect(1 + 1).toBe(2);
  });

  it("devrait retourner faux pour 1 + 1 différent de 3", () => {
    expect(1 + 1).not.toBe(3);
  });
});
