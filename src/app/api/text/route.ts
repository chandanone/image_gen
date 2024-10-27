import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: "No user found",
      },
      {
        status: 401,
      }
    );
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100000) + 1;
  }

  const randomSeed = generateRandomNumber();
  const tetxtUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}`;

  await fetch(tetxtUrl);

  await prisma.post.create({
    data: {
      prompt: prompt,
      url: tetxtUrl,
      seed: randomSeed,
      userId: user.id,
    },
  });

  return NextResponse.json({ url: tetxtUrl });
}

export async function GET() {}
