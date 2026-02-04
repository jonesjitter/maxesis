import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

// Hash IP for privacy
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.TWITCH_CLIENT_SECRET).digest('hex');
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

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
    });

    // Get user's votes to show which they've voted for
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    const userVotes = await prisma.vote.findMany({
      where: { ipHash },
      select: { ideaId: true },
    });

    const votedIds = new Set(userVotes.map(v => v.ideaId));

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

// POST - Create new idea
export async function POST(request: NextRequest) {
  try {
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

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    // Rate limiting: Check if user submitted in last 5 minutes
    const recentIdea = await prisma.streamIdea.findFirst({
      where: {
        ipHash,
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
        ipHash,
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
