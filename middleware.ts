import { getIronSession } from "iron-session/edge";
import type { NextFetchEvent, NextRequest } from "next/server";
import { userAgent, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // 사용자가 봇인 경우에 주는 에러 화면을 만들고 그쪽으로 rewrite 처리
  if (userAgent(req).isBot) {
    return new Response("plz don't be a bot. Be human", { status: 403 });
  }

  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  if (!session.user && !req.url.includes("/enter")) {
    req.nextUrl.searchParams.set("from", req.nextUrl.pathname);
    req.nextUrl.pathname = "/enter";
    return NextResponse.redirect(req.nextUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
