import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_USER_LOGIN = 'maxesis09';

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedSchedule: { data: any; fetchedAt: number } | null = null;
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

async function getSchedule(token: string, broadcasterId: string) {
  const response = await fetch(
    `https://api.twitch.tv/helix/schedule?broadcaster_id=${broadcasterId}&first=10`,
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  // Schedule might not exist - that's okay
  if (response.status === 404) {
    return { segments: [], vacation: null };
  }

  if (!response.ok) {
    throw new Error('Failed to fetch schedule');
  }

  const data = await response.json();

  return {
    segments: data.data?.segments?.map((segment: any) => ({
      id: segment.id,
      title: segment.title,
      category: segment.category?.name,
      startTime: segment.start_time,
      endTime: segment.end_time,
      isRecurring: segment.is_recurring,
      isCanceled: segment.canceled_until !== null,
    })) || [],
    vacation: data.data?.vacation,
  };
}

export async function GET() {
  try {
    if (cachedSchedule && Date.now() - cachedSchedule.fetchedAt < CACHE_DURATION) {
      return NextResponse.json(cachedSchedule.data);
    }

    const token = await getAppAccessToken();
    const broadcasterId = await getBroadcasterId(token);

    if (!broadcasterId) {
      return NextResponse.json({ segments: [], error: 'User not found' });
    }

    const schedule = await getSchedule(token, broadcasterId);

    cachedSchedule = { data: schedule, fetchedAt: Date.now() };

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Twitch schedule API error:', error);
    return NextResponse.json(
      { segments: [], error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}
