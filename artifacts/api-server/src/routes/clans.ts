import { Router, type IRouter } from "express";
import {
  CreateClanBody,
  GetClanParams,
  GetClanResponse,
  JoinClanBody,
  JoinClanParams,
  JoinClanResponse,
  ListClansResponse,
} from "@workspace/api-zod";
import { mutate, newId, readAll, type StoredClan } from "../lib/storage";

const router: IRouter = Router();

router.get("/clans", async (_req, res): Promise<void> => {
  const clans = await readAll("clans");
  res.json(ListClansResponse.parse(clans));
});

router.post("/clans", async (req, res): Promise<void> => {
  const parsed = CreateClanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const body = parsed.data;
  const clan = await mutate("clans", (clans) => {
    const created: StoredClan = {
      id: newId("c"),
      name: body.name,
      members: 1,
      location: body.location,
      level: body.level,
      description: body.description,
      image: body.image,
      tags: body.tags,
      memberNames: [],
    };
    return { next: [...clans, created], result: created };
  });
  res.status(201).json(GetClanResponse.parse(clan));
});

router.get("/clans/:id", async (req, res): Promise<void> => {
  const params = GetClanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const clans = await readAll("clans");
  const clan = clans.find((c) => c.id === params.data.id);
  if (!clan) {
    res.status(404).json({ error: "Clan not found" });
    return;
  }
  res.json(GetClanResponse.parse(clan));
});

router.post("/clans/:id/join", async (req, res): Promise<void> => {
  const params = JoinClanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = JoinClanBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const clanId = params.data.id;
  const username = body.data.username.trim();

  const updated = await mutate("clans", (clans) => {
    const idx = clans.findIndex((c) => c.id === clanId);
    if (idx === -1) return { next: clans, result: null as StoredClan | null };
    const clan = clans[idx]!;
    if (clan.memberNames.includes(username)) {
      return { next: clans, result: clan };
    }
    const next = [...clans];
    next[idx] = {
      ...clan,
      members: clan.members + 1,
      memberNames: [...clan.memberNames, username],
    };
    return { next, result: next[idx] };
  });

  if (!updated) {
    res.status(404).json({ error: "Clan not found" });
    return;
  }

  req.log.info({ clanId, username }, "Player joined clan");
  res.json(JoinClanResponse.parse(updated));
});

export default router;
