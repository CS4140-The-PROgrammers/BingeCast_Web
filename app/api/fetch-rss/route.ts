import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: "RSS feed URL is required" }, { status: 400 });
  }

  try {
    // Fetch the RSS feed server-side
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed. HTTP Status: ${response.status}`);
    }

    const data = await response.text();

    // Return the RSS feed data
    return new NextResponse(data, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    // Check if 'error' is an instance of Error and handle it safely
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching RSS feed:", errorMessage);

    return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 });
  }
}
