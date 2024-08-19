"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import googleIconImage from "@/public/google.png";
import Link from "next/link";

import { SERVER_BASE_URL } from "@/src/constant/urls";
import { useEffect } from "react";

export default function GoogleLoginButton() {
  useEffect(() => {
    // session값을 쿠키에 저장하기 위해 API를 호출한다.
    fetch(`${SERVER_BASE_URL}/api/v1/session-id`);
  }, []);

  return (
    <Link href={`${SERVER_BASE_URL}/oauth2/authorization/google`}>
      <Button
        variant="contained"
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
    </Link>
  );
}
