import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { assertTeamsExist } from "../../../../src/controllers/userControllers";
import prisma from "../../../utils/prisma";
import { Response } from "express";

describe("assertTeamsExist (integration)", async () => {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  const creator = await prisma.user.create({
    data: {
      email: "MOCK@EMAIL.COM",
      username: "MOCK_USERNAME",
      password: "MOCK_PASSWORD",
    },
  });

  beforeEach(async () => {
    // Nettoyer la base avant chaque test
    await prisma.team.deleteMany({});
    res.status.mockClear();
    res.json.mockClear();
  });

  afterAll(async () => {
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("retourne true si toutes les équipes existent", async () => {
    // Créer l'équipe en base
    await prisma.team.create({
      data: {
        slug: "dev",
        name: "Dev",
        creator: { connect: { uuid: creator.uuid } },
      },
    });
    await prisma.team.create({
      data: {
        slug: "design",
        name: "Design",
        creator: { connect: { uuid: creator.uuid } },
      },
    });
    const result = await assertTeamsExist(
      ["dev", "design"],
      res as unknown as Response
    );
    expect(result).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retourne false et envoie une 400 si une équipe n'existe pas", async () => {
    await prisma.team.create({
      data: {
        slug: "dev",
        name: "Dev",
        creator: { connect: { uuid: creator.uuid } },
      },
    });
    await prisma.team.create({
      data: {
        slug: "design",
        name: "Design",
        creator: { connect: { uuid: creator.uuid } },
      },
    });

    const result = await assertTeamsExist(
      ["notfound"],
      res as unknown as Response
    );
    expect(result).toBe(false);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringContaining("notfound"),
    });
  });
});
