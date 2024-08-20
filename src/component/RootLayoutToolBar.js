"use client";

import { Toolbar } from "@mui/material";
import { useAuth } from "@/src/context/AuthContext";
import { GoogleLoginButton } from "@/src/component/GoogleLoginButton";
import { LogoutButton } from "@/src/component/LogoutButton";

export default function RootLayOutToolBar() {
  const { isLoggedIn } = useAuth()

  return <Toolbar sx={{ padding: 0, justifyContent: 'flex-end' }}>
    {isLoggedIn ? <LogoutButton/> : <GoogleLoginButton/>}
  </Toolbar>;
}


