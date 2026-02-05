import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_USER_LOGIN = 'maxesis09';

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedVideos: { data: any; fetchedAt: number } | null = null;
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

async function getUserId(token: string): Promise<string> {
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

async function getVideos(token: string, userId: string, type: string = 'highlight') {
  const response = await fetch(
    `https://api.twitch.tv/helix/videos?user_id=${userId}&type=${type}&first=12`,
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  const data = await response.json();
  return data.data.map((video: any) => ({
    id: video.id,
    title: video.title,
    url: video.url,
    thumbnailUrl: video.thumbnail_url
      .replace('%{width}', '640')
      .replace('%{height}', '360'),
    viewCount: video.view_count,
    duration: video.duration,
    createdAt: video.created_at,
    type: video.type,
    description: video.description,
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'highlight';

    if (cachedVideos && Date.now() - cachedVideos.fetchedAt < CACHE_DURATION) {
      return NextResponse.json(cachedVideos.data);
    }

    const token = await getAppAccessToken();
    const userId = await getUserId(token);

    if (!userId) {
      return NextResponse.json({ videos: [], error: 'User not found' });
    }

    const videos = await getVideos(token, userId, type);

    cachedVideos = { data: { videos }, fetchedAt: Date.now() };

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Twitch videos API error:', error);
    return NextResponse.json(
      { videos: [], error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
