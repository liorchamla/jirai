import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateSchema } from "../../../../src/controllers/userControllers";
import { z } from "zod";
import { Response } from "express";

const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

const schema = z.object({ foo: z.string() });

describe("validateSchema", () => {
  beforeEach(() => {
    res.status.mockClear();
    res.json.mockClear();
  });

  it("retourne les données validées si succès", () => {
    const data = { foo: "bar" };
    const result = validateSchema(schema, data, res as unknown as Response);
    expect(result).toEqual(data);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("retourne undefined et envoie une 422 si erreur de validation", () => {
    const data = { foo: 123 };
    const result = validateSchema(schema, data, res as unknown as Response);
    expect(result).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(Array) });
  });
});
