import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";

export const runtime = "nodejs"; // REQUIRED for next-auth

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You are unauthorized! Login before generating result" },
      { status: 401 }
    );
  }

  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return new NextResponse("Invalid prompt", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 401 });
  }

  const seed = Math.floor(Math.random() * 100000) + 1;

  const pollinationsUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${seed}`;

  const aiResponse = await fetch(pollinationsUrl);

  if (!aiResponse.ok) {
    return new NextResponse("AI service error", { status: 502 });
  }

  if (!aiResponse.body) {
    return new NextResponse("AI stream failed", { status: 500 });
  }

  // STREAM PASSTHROUGH
  return new NextResponse(aiResponse.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
