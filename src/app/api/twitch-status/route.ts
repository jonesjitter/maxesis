import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_USER_LOGIN = 'maxesis09';

// Cache token in memory
let cachedToken: { token: string; expiresAt: number } | null = null;

// Cache stream status
let cachedStatus: { data: any; fetchedAt: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

async function getAppAccessToken(): Promise<string> {
  // Return cached token if valid
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
    expiresAt: Date.now() + (data.expires_in - 300) * 1000, // Refresh 5 min early
  };

  return cachedToken.token;
}

async function getStreamStatus() {
  const token = await getAppAccessToken();

  const response = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${TWITCH_USER_LOGIN}`,
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch stream status');
  }

  const data = await response.json();
  const stream = data.data[0];

  if (stream) {
    return {
      isLive: true,
      viewerCount: stream.viewer_count,
      title: stream.title,
      gameName: stream.game_name,
      startedAt: stream.started_at,
      thumbnailUrl: stream.thumbnail_url,
    };
  }

  return { isLive: false };
}

export async function GET() {
  try {
    // Return cached status if fresh
    if (cachedStatus && Date.now() - cachedStatus.fetchedAt < CACHE_DURATION) {
      return NextResponse.json(cachedStatus.data);
    }

    const status = await getStreamStatus();

    // Update cache
    cachedStatus = { data: status, fetchedAt: Date.now() };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Twitch API error:', error);
    return NextResponse.json(
      { isLive: false, error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
