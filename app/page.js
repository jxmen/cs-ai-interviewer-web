import React from "react";
import HomeComponent from "@/src/component/HomeComponent";
import { fetchIsLoggedIn } from "@/app/api/local-apis";

export default async function Home() {
  const isLoggedIn = await fetchIsLoggedIn().isLoggedIn;

  return (
    <HomeComponent isLoggedIn={isLoggedIn}/>
  )
}
