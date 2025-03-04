"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import Delay from "./Await";

export interface TypeWriterProps {
  characterAnimationDuration: number;
  typeSpeed: number;
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

  componentDidMount(): void {
      console.log("mounted");
  }

  async typeAsync(text: string): Promise<void> {
    for (const char of text) {
      await Delay(this.props.typeSpeed);
      this.state.animating.push(char);
      this.setState((prev) => this.state);
    }

    this.makeStatic();
  }

  async makeStatic(): Promise<void> {
    await Delay(this.props.characterAnimationDuration);
    this.state = { animating: [], text: this.state.text + this.state.animating.join("") };
    this.setState(this.state);
  }

  render(): JSX.Element {
    let animationDuration: number = this.props.characterAnimationDuration / 1000;

    return (
        <span key="typewriter-span" style={{ color: this.props.color, fontSize: this.props.size }}>
          test
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
                            transition={{ duration: animationDuration }}
                        >
                            {(text === " " ? '\u00A0' : text)}
                        </motion.span>
                ))
            }
        </span>
    );
  }
}
