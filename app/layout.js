"use client"

import { Inter } from "next/font/google";
import dynamic from 'next/dynamic'

import { AppBar } from "@mui/material";
import Container from "@mui/material/Container";
import { AuthProvider } from "@/src/context/AuthContext";
import TokenHandler from "@/src/utils/TokenHandler";

const inter = Inter({ subsets: ["latin"] });

const RootLayOutToolBar = dynamic(() => import('../src/component/RootLayoutToolBar'), { ssr: false })

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <TokenHandler/>
          <RootLayOutToolBar/>
          <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
          </AppBar>
          <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
            {children}
          </Container>
        </AuthProvider>
      </body>
    </html>
  );
}
