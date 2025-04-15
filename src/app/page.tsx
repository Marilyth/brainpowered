"use client";

import React from "react";
import PlayerInterface from "./classes/views/PlayerInterface";
import { useTheme } from "next-themes";
import 'reflect-metadata';

export default function Home() {
  const { setTheme } = useTheme();
  setTheme("dark");

  return (
    <div className="w-screen h-100dvh">
      <PlayerInterface/>
    </div>
  );
}
