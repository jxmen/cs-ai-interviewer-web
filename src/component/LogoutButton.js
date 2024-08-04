"use client"

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('next-auth.access-token');
    router.refresh();
  };

  return (
    <Button
      variant="contained"
      onClick={handleLogout}
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
