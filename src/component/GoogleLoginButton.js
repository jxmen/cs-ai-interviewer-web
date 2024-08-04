"use client"

import { Button } from "@mui/material";
import Image from "next/image";
import googleIconImage from "@/public/google.png";
import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  return (
    <Button
      variant="contained"
      onClick={() => signIn('google')}
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
      <Image src={googleIconImage} alt="Google Icon" width={20} height={20} style={{ marginRight: '10px' }}/>
      구글 로그인
    </Button>
  );
}
