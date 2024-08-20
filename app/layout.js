"use client"

import { Inter } from "next/font/google";
import { AppBar } from "@mui/material";
import Container from "@mui/material/Container";
import TokenHandler from "@/src/utils/TokenHandler";
import RootLayOutToolBar from "@/src/component/RootLayoutToolBar";
import { AuthProvider } from "@/src/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <TokenHandler/>
          <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
            <RootLayOutToolBar/>
          </AppBar>
          <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
            {children}
          </Container>
        </AuthProvider>
      </body>
    </html>
  );
}
