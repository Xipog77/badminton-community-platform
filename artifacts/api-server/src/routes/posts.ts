import { Router, type IRouter } from "express";
import {
  CreatePostBody,
  GetPostParams,
  GetPostResponse,
  JoinPostBody,
  JoinPostParams,
  JoinPostResponse,
  AcceptJoinRequestBody,
  AcceptJoinRequestParams,
  AcceptJoinRequestResponse,
  ListPostsResponse,
} from "@workspace/api-zod";
import {
  mutate,
  newId,
  readAll,
  type StoredJoinRequest,
  type StoredMatch,
  type StoredPlayer,
} from "../lib/storage";

const router: IRouter = Router();

function paramId(raw: string | string[] | undefined): string | null {
  if (raw == null) return null;
  return Array.isArray(raw) ? (raw[0] ?? null) : raw;
}

async function maybePromoteToMatch(post: StoredMatch): Promise<void> {
  if (post.status !== "Full") return;
  await mutate("matches", (matches) => {
    if (matches.find((m) => m.id === post.id)) {
      return { next: matches, result: undefined };
    }
    const promoted: StoredMatch = {
      ...post,
      players: post.players.map((p) => ({ ...p, confirmed: false })),
    };
    return { next: [...matches, promoted], result: undefined };
  });
}

router.get("/posts", async (_req, res): Promise<void> => {
  const posts = await readAll("posts");
  res.json(ListPostsResponse.parse(posts));
});

router.post("/posts", async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const body = parsed.data;
  const allUsers = await readAll("users");
  const hostUser = allUsers.find((u) => u.username.toLowerCase() === body.hostName.toLowerCase());
  const hostAvatar = hostUser?.avatar ?? "/avatar1.png";

  const post = await mutate("posts", (posts) => {
    const created: StoredMatch = {
      id: newId("m"),
      title: body.title,
      hostName: body.hostName,
      hostAvatar,
      date: body.date,
      time: body.time,
      location: body.location,
      court: body.court,
      skillLevel: body.skillLevel,
      playersJoined: 1,
      playersNeeded: body.playersNeeded,
      fee: body.fee,
      status: body.playersNeeded <= 1 ? "Full" : "Open",
      description: body.description,
      players: [
        { name: body.hostName, avatar: hostAvatar, level: body.skillLevel },
      ],
    };
    return { next: [...posts, created], result: created };
  });

  req.log.info({ id: post.id }, "Post created");
  res.status(201).json(GetPostResponse.parse(post));
});

router.get("/posts/:id", async (req, res): Promise<void> => {
  const params = GetPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const posts = await readAll("posts");
  const post = posts.find((p) => p.id === params.data.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(GetPostResponse.parse(post));
});

/**
 * Join a post. Creates a join request and (in this demo) auto-accepts it,
 * adding the user to the post. When the post fills up it transitions to "Full"
 * and is mirrored into the matches collection.
 */
router.post("/posts/:id/join", async (req, res): Promise<void> => {
  const params = JoinPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = JoinPostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const postId = params.data.id;
  const username = body.data.username.trim();
  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const joinUsers = await readAll("users");
  const joinUser = joinUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
  const joinAvatar = joinUser?.avatar ?? "/avatar1.png";

  const updated = await mutate("posts", (posts) => {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return { next: posts, result: null as StoredMatch | null };

    const post = posts[idx]!;
    if (post.status !== "Open") {
      return { next: posts, result: post };
    }
    if (post.players.some((p) => p.name === username)) {
      return { next: posts, result: post };
    }

    const newPlayer: StoredPlayer = {
      name: username,
      avatar: joinAvatar,
      level: post.skillLevel,
    };
    const playersJoined = post.playersJoined + 1;
    const status = playersJoined >= post.playersNeeded ? "Full" : "Open";
    const next = [...posts];
    next[idx] = {
      ...post,
      players: [...post.players, newPlayer],
      playersJoined,
      status,
    };
    return { next, result: next[idx] };
  });

  if (!updated) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  await mutate("joinRequests", (requests) => {
    const created: StoredJoinRequest = {
      id: newId("jr"),
      postId,
      username,
      status: "accepted",
      createdAt: new Date().toISOString(),
    };
    return { next: [...requests, created], result: created };
  });

  await maybePromoteToMatch(updated);

  req.log.info({ postId, username }, "Player joined post");
  res.json(JoinPostResponse.parse(updated));
});

/**
 * Explicit accept endpoint. Idempotently marks any pending request as accepted
 * and ensures the player is on the post.
 */
router.post("/posts/:id/accept", async (req, res): Promise<void> => {
  const params = AcceptJoinRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = AcceptJoinRequestBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const postId = params.data.id;
  const username = body.data.username.trim();

  const acceptUsers = await readAll("users");
  const acceptUser = acceptUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
  const acceptAvatar = acceptUser?.avatar ?? "/avatar1.png";

  await mutate("joinRequests", (requests) => {
    const next = requests.map((r) =>
      r.postId === postId && r.username === username && r.status === "pending"
        ? { ...r, status: "accepted" as const }
        : r,
    );
    return { next, result: undefined };
  });

  const updated = await mutate("posts", (posts) => {
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return { next: posts, result: null as StoredMatch | null };

    const post = posts[idx]!;
    if (post.players.some((p) => p.name === username)) {
      return { next: posts, result: post };
    }
    if (post.playersJoined >= post.playersNeeded) {
      return { next: posts, result: post };
    }
    const newPlayer: StoredPlayer = {
      name: username,
      avatar: acceptAvatar,
      level: post.skillLevel,
    };
    const playersJoined = post.playersJoined + 1;
    const status = playersJoined >= post.playersNeeded ? "Full" : "Open";
    const next = [...posts];
    next[idx] = {
      ...post,
      players: [...post.players, newPlayer],
      playersJoined,
      status,
    };
    return { next, result: next[idx] };
  });

  if (!updated) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  await maybePromoteToMatch(updated);
  res.json(AcceptJoinRequestResponse.parse(updated));
});

export default router;
