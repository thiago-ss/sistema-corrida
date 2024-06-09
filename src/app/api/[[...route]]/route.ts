import { env } from "hono/adapter";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { Participant, Race, Team } from "@/lib/types";
import { Redis } from "@upstash/redis/cloudflare";
export const runtime = "edge";

export const app = new Hono().basePath("/api");

type EnvConfig = {
  REDIS_URL: string;
  REDIS_TOKEN: string;
};

// Middleware
app.use("*", cors());
app.use("*", async (c, next) => {
  try {
    await next();
  } catch (err: any) {
    return c.json(
      { message: "Internal Server Error", error: err.message },
      500
    );
  }
});

// GET /api/teams
app.get("/teams", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const teams = ((await redis.get("teams")) as Team[]) || [];
  if (teams.length === 0) {
    return c.json({ message: "Nenhuma equipe cadastrada" });
  }
  return c.json({ data: teams });
});

// GET /api/teams/:id
app.get("/teams/:id", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const teams = ((await redis.get("teams")) as Team[]) || [];
  const team = teams.find((team) => team.id === c.req.param("id"));
  if (!team) {
    return c.json({ message: "Equipe não encontrada" });
  }
  return c.json({ data: team });
});

// GET /api/races
app.get("/races", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const races = ((await redis.get("races")) as Race[]) || [];
  if (races.length === 0) {
    return c.json({ message: "Nenhuma corrida cadastrada" });
  }
  return c.json({ data: races });
});

// POST /api/teams
app.post("/teams", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const body: Team = await c.req.json();
  const teams = ((await redis.get("teams")) as Team[]) || [];
  teams.push(body);
  await redis.set("teams", teams);
  return c.json({ success: "Equipe cadastrada com sucesso!", data: teams });
});

// POST /api/races
app.post("/races", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const body: Race = await c.req.json();
  const races = ((await redis.get("races")) as Race[]) || [];
  races.push(body);
  await redis.set("races", races);
  return c.json({ success: "Corrida cadastrada com sucesso!", data: races });
});

// GET /api/participants
app.get("/participants", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const participants =
    ((await redis.get("participants")) as Participant[]) || [];
  if (participants.length === 0) {
    return c.json({ message: "Nenhum aluno cadastrado" });
  }
  return c.json({ data: participants });
});

// POST /api/participants
app.post("/participants", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const body = await c.req.json();
  const participants =
    ((await redis.get("participants")) as Participant[]) || [];
  participants.push(body);
  await redis.set("participants", participants);
  return c.json({
    success: "Aluno cadastrado com sucesso!",
    data: participants,
  });
});

// PUT /api/teams/:id/races
app.put("/teams/:id/races", async (c) => {
  const { REDIS_URL, REDIS_TOKEN } = env<EnvConfig>(c);
  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });
  const body: Race = await c.req.json();
  const teams = ((await redis.get("teams")) as Team[]) || [];
  const team = teams.find((team) => team.id === c.req.param("id"));
  if (!team) {
    return c.json({ message: "Equipe não encontrada" });
  }
  team?.races?.push(body);
  await redis.set("teams", teams);
  return c.json({
    success: "Informação cadastrada com sucesso!",
    data: team,
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);

export default app;
