"use client";

import { useEffect } from "react";
import LocalStorage from "@/src/utils/LocalStorage";
import { useAuth } from "@/src/context/AuthContext";

export default function TokenHandler() {
  const { setIsLoggedIn } = useAuth()

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    const refreshToken = url.searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      LocalStorage.setItem('accessToken', accessToken);
      LocalStorage.setItem('refreshToken', refreshToken);

      url.searchParams.delete('accessToken');
      url.searchParams.delete('refreshToken');

      setIsLoggedIn(true)
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  });

  return null;
}
