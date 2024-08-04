import GoogleProvider from 'next-auth/providers/google';
import { cookies } from "next/headers";

const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET');
  }

  return { clientId, clientSecret };
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const oneHour = 60 * 60 * 1000;
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;

        // 액세스 토큰은 추후 API 호출을 위해 쿠키에 저장
        cookies().set('next-auth.access-token', token.accessToken, {
          expires: new Date(Date.now() + oneHour),
        });
      }
      cookies().set('next-auth.provider', token.provider, {
        expires: new Date(Date.now() + oneHour),
      });

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.provider = token.provider;

      return session;
    },
  }
};
