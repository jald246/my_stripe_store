import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // This is where secure, server-side logic (e.g., DB calls) will go.
  return NextResponse.json({ message: 'Success! Your API route is working.' });
};
