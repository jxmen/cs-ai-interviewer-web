import { Inter } from "next/font/google";
import { AppBar, Toolbar } from "@mui/material";
import GoogleLoginButton from "@/src/component/GoogleLoginButton";
import LogoutButton from "@/src/component/LogoutButton";
import Container from "@mui/material/Container";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CS 면접 대비 - AI 면접관",
  description: "AI 면접관과 함께 CS 면접을 준비해보세요!",
};

export default function RootLayout({ children }) {
  const isLoggedIn = !!cookies().get('next-auth.access-token');

  return (
    <html lang="ko">
      <body className={inter.className}>
        <>
          <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
            <Toolbar sx={{ padding: 0, justifyContent: 'flex-end' }}>
              {isLoggedIn ? <LogoutButton/> : <GoogleLoginButton/>}
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
            {children}
          </Container>
        </>
      </body>
    </html>
  );
}
