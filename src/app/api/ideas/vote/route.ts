import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.TWITCH_CLIENT_SECRET).digest('hex');
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

// POST - Vote for an idea
export async function POST(request: NextRequest) {
  try {
    const { ideaId } = await request.json();

    if (!ideaId) {
      return NextResponse.json(
        { error: 'Missing ideaId' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        ideaId_ipHash: { ideaId, ipHash },
      },
    });

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.vote.delete({
        where: { id: existingVote.id },
      });

      await prisma.streamIdea.update({
        where: { id: ideaId },
        data: { votes: { decrement: 1 } },
      });

      return NextResponse.json({ voted: false, message: 'Vote removed' });
    }

    // Add vote
    await prisma.vote.create({
      data: { ideaId, ipHash },
    });

    const updatedIdea = await prisma.streamIdea.update({
      where: { id: ideaId },
      data: { votes: { increment: 1 } },
    });

    return NextResponse.json({ voted: true, votes: updatedIdea.votes });
  } catch (error) {
    console.error('Failed to vote:', error);
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    );
  }
}
