"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import LocalStorage from "@/src/utils/LocalStorage";

function removeUrlParameters() {
  const url = new URL(window.location.href);
  url.searchParams.delete('accessToken');
  url.searchParams.delete('refreshToken');
  window.history.replaceState({}, document.title, url.pathname + url.search);
}

export function LogoutButton() {
  const { setIsLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <Button
      variant="contained"
      onClick={() => {
        LocalStorage.logout()
        setIsLoggedIn(false)
        removeUrlParameters()
        router.refresh()
      }}
      sx={{
        backgroundColor: '#fff',
        color: '#4285F4',
        '&:hover': {
          backgroundColor: '#f1f1f1',
        },
        textTransform: 'none',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '5px',
        border: '1px solid transparent',
      }}
    >
      로그아웃
    </Button>
  );
}
