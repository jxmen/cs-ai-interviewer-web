"use client";

import { Button, Divider, Toolbar } from "@mui/material";
import { useAuth } from "@/src/context/AuthContext";
import { GoogleLoginButton } from "@/src/component/GoogleLoginButton";
import { LogoutButton } from "@/src/component/LogoutButton";
import Box from "@mui/material/Box";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React from "react";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const FEEDBACK_LINK_URL = process.env.NEXT_PUBLIC_FEEDBACK_LINK_URL;

export default function RootLayOutToolBar() {
  const { isLoggedIn } = useAuth()

  return <Toolbar sx={{ padding: 0, alignItems: 'center', justifyContent: 'flex-end' }}>
    {
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <FeedBackLink/>
        <Divider orientation="vertical" flexItem sx={{ height: '48px', borderColor: 'grey.400' }}/>
        {isLoggedIn ? <LogoutButton/> : <GoogleLoginButton/>}
      </Box>
    }
  </Toolbar>;
}

const FeedbackButton = ({ children, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flexEnd' }}>
      <Button
        sx={{
          textTransform: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'grey.400',
          backgroundColor: 'grey.100',
          boxShadow: 1,
          '&:hover': {
            backgroundColor: 'grey.200',
            borderColor: 'grey.500',
          },
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        {...props}
      >
        {children}
        <OpenInNewIcon/>
      </Button>
    </Box>
  );
};

const FeedBackLink = () => {
  return (
    <FeedbackButton
      component="a"
      href={FEEDBACK_LINK_URL}
      target="_blank"
      rel="noreferrer"
    >
      피드백 보내기
    </FeedbackButton>
  );
};
