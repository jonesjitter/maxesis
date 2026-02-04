import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all ideas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const sort = searchParams.get('sort') || 'votes';

    const ideas = await prisma.streamIdea.findMany({
      where: status === 'all' ? {} : { status },
      orderBy: sort === 'votes'
        ? { votes: 'desc' }
        : { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    // Get session to check user's votes
    const session = await getServerSession();
    let votedIds = new Set<string>();

    if (session?.user && (session.user as any).twitchId) {
      const dbUser = await prisma.user.findUnique({
        where: { twitchId: (session.user as any).twitchId },
      });

      if (dbUser) {
        const userVotes = await prisma.vote.findMany({
          where: { userId: dbUser.id },
          select: { ideaId: true },
        });
        votedIds = new Set(userVotes.map(v => v.ideaId));
      }
    }

    const ideasWithVoteStatus = ideas.map(idea => ({
      ...idea,
      hasVoted: votedIds.has(idea.id),
    }));

    return NextResponse.json({ ideas: ideasWithVoteStatus });
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

// POST - Create new idea (requires auth)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user || !(session.user as any).twitchId) {
      return NextResponse.json(
        { error: 'Du skal logge ind med Twitch for at sende en idé' },
        { status: 401 }
      );
    }

    const { title, category } = await request.json();

    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Idé skal være mindst 3 tegn' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Idé må max være 200 tegn' },
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

    // Rate limiting: Check if user submitted in last 5 minutes
    const recentIdea = await prisma.streamIdea.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    if (recentIdea) {
      return NextResponse.json(
        { error: 'Vent 5 minutter mellem hver idé' },
        { status: 429 }
      );
    }

    const idea = await prisma.streamIdea.create({
      data: {
        title: title.trim(),
        category: category || 'general',
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    return NextResponse.json({ idea });
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}
