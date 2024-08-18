import { Button } from "@mui/material";
import Image from "next/image";
import googleIconImage from "@/public/google.png";
import Link from "next/link";

import { SERVER_BASE_URL } from "@/src/constant/urls";

export default function GoogleLoginButton() {
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
