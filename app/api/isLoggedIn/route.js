import { NextResponse } from "next/server";

export async function GET(request) {
  const isLoggedIn = request.cookies.get('SESSION') !== undefined;
  console.log(isLoggedIn)

  return NextResponse.json({
    isLoggedIn
  });
}
