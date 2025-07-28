import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { isEmailTaken } from "../../../../src/controllers/userControllers";
import prisma from "../../../utils/prisma";

describe("isEmailTaken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    // Nettoyer la base avant chaque test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
  });

  it("retourne true si l'email existe (sans excludeUuid)", async () => {
    // Given we have a user with a specific email
    await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "MOCK_USERNAME",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if that email is taken
    const result = await isEmailTaken("MOCK@MAIL.COM");

    // Then it should return true
    expect(result).toBe(true);
  });

  it("retourne false si l'email n'existe pas (sans excludeUuid)", async () => {
    // Given we have a user with a different email
    await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "MOCK_USERNAME",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if a non-existing email is taken
    const result = await isEmailTaken("notfound@test.com");

    // Then it should return false
    expect(result).toBe(false);
  });

  it("retourne true si l'email existe (avec excludeUuid)", async () => {
    // Given we have a user with a specific email
    await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "MOCK_USERNAME",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if that email is taken with a different UUID
    const result = await isEmailTaken("MOCK@MAIL.COM", "an-other-uuid");

    // Then it should return true
    expect(result).toBe(true);
  });

  it("retourne false si l'email n'existe pas (avec excludeUuid)", async () => {
    const existingUser = await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "MOCK_USERNAME",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if that email is taken with a different UUID
    const result = await isEmailTaken("MOCK@MAIL.COM", existingUser.uuid);

    // Then it should return true
    expect(result).toBe(false);
  });
});
