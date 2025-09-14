// app/api/health/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}