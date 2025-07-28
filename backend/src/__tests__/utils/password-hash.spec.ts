import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../utils/password-hash";

describe("password-hash utils", () => {
  it("hashPassword doit retourner un hash différent du mot de passe en clair", async () => {
    const password = "SuperSecret123!";
    const hash = await hashPassword(password);
    expect(hash).toBeTypeOf("string");
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it("verifyPassword doit retourner true si le mot de passe correspond au hash", async () => {
    const password = "SuperSecret123!";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(hash, password);
    expect(isValid).toBe(true);
  });

  it("verifyPassword doit retourner false si le mot de passe ne correspond pas au hash", async () => {
    const password = "SuperSecret123!";
    const wrongPassword = "WrongPassword!";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(hash, wrongPassword);
    expect(isValid).toBe(false);
  });
});
