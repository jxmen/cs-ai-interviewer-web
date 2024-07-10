"use client"

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

export default function BackIconButton() {
  const router = useRouter()
  const moveHome = () => router.push("/")

  return (
    <IconButton aria-label="back" onClick={moveHome}>
      <ArrowBackIcon/>
    </IconButton>
  )

}
