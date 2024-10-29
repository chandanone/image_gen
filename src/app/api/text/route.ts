import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are unauthorized!" },
      { status: 401 }
    );
  }

  const { prompt }: { prompt: string } = await request.json();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100000) + 1;
  }

  const randomSeed = generateRandomNumber();
  const textUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}`;

  const response = await fetch(textUrl);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  let streamedText = "";

  while (!done) {
    const { value, done: doneReading } = (await reader?.read()) || {};
    done = doneReading || false;
    streamedText += decoder.decode(value);
  }

  return NextResponse.json({ url: textUrl, streamedText });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
