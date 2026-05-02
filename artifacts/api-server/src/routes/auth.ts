import { Router, type IRouter } from "express";
import { LoginBody, LoginResponse, UpdateProfileBody, UpdateProfileResponse } from "@workspace/api-zod";
import { mutate, newId, readAll, type StoredUser } from "../lib/storage";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const username = parsed.data.username.trim();
  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const user = await mutate("users", (users) => {
    const existing = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (existing) return { next: users, result: existing };

    const created: StoredUser = {
      id: newId("u"),
      username,
      avatar: "/avatar1.png",
      skillLevel: "new", // Mặc định là 'Mới'
    };
    return { next: [...users, created], result: created };
  });

  req.log.info({ username: user.username }, "User logged in");
  res.json(LoginResponse.parse(user));
});

router.patch("/auth/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, avatar, skillLevel } = parsed.data;
  const trimmed = username.trim();
  if (!trimmed) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const users = await readAll("users");
  const existing = users.find(
    (u) => u.username.toLowerCase() === trimmed.toLowerCase(),
  );
  if (!existing) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const updated = await mutate("users", (users) => {
    const idx = users.findIndex(
      (u) => u.username.toLowerCase() === trimmed.toLowerCase(),
    );
    if (idx === -1) return { next: users, result: null as StoredUser | null };
    const next = [...users];
    next[idx] = {
      ...users[idx]!,
      avatar: avatar ?? users[idx]!.avatar,
      skillLevel: skillLevel ?? users[idx]!.skillLevel,
    };
    return { next, result: next[idx]! };
  });

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  req.log.info({ username: trimmed }, "User updated profile");
  res.json(UpdateProfileResponse.parse(updated));
});

export default router;
