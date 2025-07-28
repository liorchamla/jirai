import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { isUsernameTaken } from "../../../../src/controllers/userControllers";
import prisma from "../../../utils/prisma";

describe("isUsernameTaken", () => {
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

  it("retourne true si le username existe (sans excludeUuid)", async () => {
    // Given we have a user with a specific username
    await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "MOCK_USERNAME",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if that username is taken
    const result = await isUsernameTaken("MOCK_USERNAME");

    // Then it should return true
    expect(result).toBe(true);
  });

  it("retourne false si le username n'existe pas (sans excludeUuid)", async () => {
    // Given we have no user named "notfound"
    // When we ask if that username is taken
    const result = await isUsernameTaken("notfound");

    // Then it should return false
    expect(result).toBe(false);
  });

  it("retourne true si le username existe (avec excludeUuid)", async () => {
    // Given we have a user with a specific username
    await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "john",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if that username is taken with a different UUID
    const result = await isUsernameTaken("john", "other-uuid");

    // Then it should return true
    expect(result).toBe(true);
  });

  it("retourne false si le username n'existe pas (avec excludeUuid)", async () => {
    // Given we have a user with a specific username
    const existingUser = await prisma.user.create({
      data: {
        email: "MOCK@MAIL.COM",
        username: "john",
        password: "MOCK_PASSWORD",
      },
    });

    // When we ask if that username is taken with a different UUID
    const result = await isUsernameTaken("john", existingUser.uuid);

    // Then it should return false
    expect(result).toBe(false);
  });
});
