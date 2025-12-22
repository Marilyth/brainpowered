"use client";

import React from "react";
import { useTheme } from "next-themes";
import PlayInterface from "../play/PlayInterface";

export default function Home() {
  const { setTheme } = useTheme();
  setTheme("dark");

  return (
    <div className="w-screen h-100dvh">
      <PlayInterface/>
    </div>
  );
}
