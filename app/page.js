import React from "react";
import HomeComponent from "@/src/component/HomeComponent";
import { cookies } from "next/headers";

export default function Home() {
  const isLoggedIn = cookies().has('SESSION');

  return (
    <HomeComponent isLoggedIn={isLoggedIn}/>
  )
}
