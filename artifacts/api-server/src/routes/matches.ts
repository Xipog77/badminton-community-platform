import { Router, type IRouter } from "express";
import {
  ConfirmMatchBody,
  ConfirmMatchParams,
  ConfirmMatchResponse,
  GetMatchParams,
  GetMatchResponse,
  ListMatchesResponse,
} from "@workspace/api-zod";
import { mutate, readAll, type StoredMatch } from "../lib/storage";

const router: IRouter = Router();

router.get("/matches", async (_req, res): Promise<void> => {
  const matches = await readAll("matches");
  res.json(ListMatchesResponse.parse(matches));
});

router.get("/matches/:id", async (req, res): Promise<void> => {
  const params = GetMatchParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const matches = await readAll("matches");
  const match = matches.find((m) => m.id === params.data.id);
  if (!match) {
    res.status(404).json({ error: "Match not found" });
    return;
  }
  res.json(GetMatchResponse.parse(match));
});

router.post("/matches/:id/confirm", async (req, res): Promise<void> => {
  const params = ConfirmMatchParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = ConfirmMatchBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const matchId = params.data.id;
  const username = body.data.username.trim();

  const updated = await mutate("matches", (matches) => {
    const idx = matches.findIndex((m) => m.id === matchId);
    if (idx === -1) return { next: matches, result: null as StoredMatch | null };
    const match = matches[idx]!;

    const players = match.players.map((p) =>
      p.name === username ? { ...p, confirmed: true } : p,
    );
    const allConfirmed =
      players.length > 0 && players.every((p) => p.confirmed === true);
    const next = [...matches];
    next[idx] = {
      ...match,
      players,
      status: allConfirmed ? "Completed" : match.status,
    };
    return { next, result: next[idx] };
  });

  if (!updated) {
    res.status(404).json({ error: "Match not found" });
    return;
  }

  req.log.info({ matchId, username }, "Match confirmed by player");
  res.json(ConfirmMatchResponse.parse(updated));
});

export default router;
