import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// POST - Vote for an idea (requires auth)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user || !(session.user as any).twitchId) {
      return NextResponse.json(
        { error: 'Du skal logge ind med Twitch for at stemme' },
        { status: 401 }
      );
    }

    const { ideaId } = await request.json();

    if (!ideaId) {
      return NextResponse.json(
        { error: 'Missing ideaId' },
        { status: 400 }
      );
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { twitchId: (session.user as any).twitchId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Bruger ikke fundet' },
        { status: 404 }
      );
    }

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        ideaId_userId: { ideaId, userId: user.id },
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
      data: { ideaId, userId: user.id },
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
