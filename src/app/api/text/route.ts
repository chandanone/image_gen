import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";

export const runtime = "nodejs"; // REQUIRED for next-auth

const MAX_PROMPT_LENGTH = 500;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please login." },
      { status: 401 }
    );
  }

  // ✅ Guard against invalid JSON
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt } = body as { prompt?: unknown };

  if (
    typeof prompt !== "string" ||
    !prompt.trim() ||
    prompt.length > MAX_PROMPT_LENGTH
  ) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const seed = Math.floor(Math.random() * 100000) + 1;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

  let aiResponse: Response;

  try {
    const pollinationsUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?seed=${seed}`;

    aiResponse = await fetch(pollinationsUrl, {
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!aiResponse.ok || !aiResponse.body) {
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 502 }
    );
  }

  // ✅ Stream passthrough (user-specific → no-store)
  return new NextResponse(aiResponse.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
