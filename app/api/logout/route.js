import { NextResponse } from "next/server";

export async function POST(_) {
  const res = NextResponse.json({})
  res.cookies.set('SESSION', '', {
    httpOnly: true,
    maxAge: 0, // 0 second hours in seconds
  })

  return res;
}
