import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_USER_LOGIN = 'maxesis09';

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedClips: { data: any; fetchedAt: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getAppAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Twitch access token');
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return cachedToken.token;
}

async function getBroadcasterId(token: string): Promise<string> {
  const response = await fetch(
    `https://api.twitch.tv/helix/users?login=${TWITCH_USER_LOGIN}`,
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const data = await response.json();
  return data.data[0]?.id;
}

async function getClips(token: string, broadcasterId: string) {
  const response = await fetch(
    `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&first=12`,
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch clips');
  }

  const data = await response.json();
  return data.data.map((clip: any) => ({
    id: clip.id,
    title: clip.title,
    url: clip.url,
    embedUrl: clip.embed_url,
    thumbnailUrl: clip.thumbnail_url,
    viewCount: clip.view_count,
    creatorName: clip.creator_name,
    gameName: clip.game_id,
    createdAt: clip.created_at,
    duration: clip.duration,
  }));
}

export async function GET() {
  try {
    if (cachedClips && Date.now() - cachedClips.fetchedAt < CACHE_DURATION) {
      return NextResponse.json(cachedClips.data);
    }

    const token = await getAppAccessToken();
    const broadcasterId = await getBroadcasterId(token);

    if (!broadcasterId) {
      return NextResponse.json({ clips: [], error: 'User not found' });
    }

    const clips = await getClips(token, broadcasterId);

    cachedClips = { data: { clips }, fetchedAt: Date.now() };

    return NextResponse.json({ clips });
  } catch (error) {
    console.error('Twitch clips API error:', error);
    return NextResponse.json(
      { clips: [], error: 'Failed to fetch clips' },
      { status: 500 }
    );
  }
}
