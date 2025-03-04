"use client";
import Image from "next/image";
import TypeWriter from "./classes/Typewriter";
import { useEffect, useRef } from "react";

export default function Home() {
  // Write "Hello world" in the type writer once loaded.
  const tw = useRef<TypeWriter>(null);

  useEffect(() => {
    tw.current?.type("Hello world! How are you feeling today?");
  }, []);

  return (
    <TypeWriter ref={tw} speed={50} color="#AAAAAA" size="32px" />
  );
}
