"use client";

import React from "react";
import { motion } from "framer-motion";
import Delay from "./Await";

interface TypeWriterProps {
  speed: number;
  color: string;
  size: string;
}

interface TypeWriterState {
  animating: string[];
  text: string;
}

export default class Typewriter extends React.Component<TypeWriterProps, TypeWriterState> {
  constructor(props: TypeWriterProps) {
    super(props);
    this.state = { animating: [], text: "" };
  }

  async type(text: string): Promise<void> {
    for (const char of text) {
      await Delay(this.props.speed);
      this.setState((prev) => ({ animating: [...prev.animating, char] }));
    }

    // Get rid of all the spans after animating.
    await new Promise((r) => setTimeout(r, 300));
    this.setState((prev) => ({ animating: [], text: prev.text + text }));
  }

  render() {
    return (
        <div style={{ color: this.props.color, fontSize: this.props.size }} className="m-8">
            {
                // Display the static text.
                <motion.span key="static-text">
                    {this.state.text}
                </motion.span>
            }
            {
                // Display the animating text.
                this.state.animating.map((text, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {text === " " ? '\u00A0' : text}
                        </motion.span>
                ))
            }
        </div>
    );
  }
}
