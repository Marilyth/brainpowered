"use client";

import React from "react";
import EditInterface from "./EditInterface";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  setTheme("dark");

  return (
    <div className="w-screen h-100dvh">
      <EditInterface/>
    </div>
  );
}
