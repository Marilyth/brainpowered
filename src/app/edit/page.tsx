"use client";

import React from "react";
import { EditInterface } from "./EditInterface";
import { useTheme } from "next-themes";

export default function Home() {
  return (
    <div className="w-screen h-100dvh">
      <EditInterface/>
    </div>
  );
}
