import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.url;
  request.headers.set('Referer', url)

  return NextResponse.rewrite(url)
}
