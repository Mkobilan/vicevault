import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const siteUrl = `${protocol}://${host}`;
    const key = process.env.INDEXNOW_API_KEY;

    if (!key) {
      return NextResponse.json({ error: 'IndexNow API key not configured' }, { status: 500 });
    }

    const payload = {
      host: host,
      key: key,
      keyLocation: `${siteUrl}/${key}.txt`,
      urlList: [
        siteUrl,
        `${siteUrl}/hype`,
        `${siteUrl}/feed`,
        `${siteUrl}/vault`
      ]
    };

    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: 'URL submitted successfully' });
    } else {
      const text = await res.text();
      return NextResponse.json({ error: 'Failed to submit', details: text }, { status: res.status });
    }
  } catch (error) {
    console.error('IndexNow API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
