"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import Delay from "./Await";

export interface TypeWriterProps {
  characterAnimationDuration: number;
  typeSpeed: number;
  color: string;
  size: string;
  text: string;
  pitch: number;
  gain: number;
  onFinished?: () => void;
}

interface TypeWriterState {
  animating: string[];
  text: string;
}

export default class Typewriter extends React.Component<TypeWriterProps, TypeWriterState> {
  private oscillator: (OscillatorNode | null) = null;
  private audioCtx: (AudioContext | null) = null;
  private isRunning: boolean = false;

  constructor(props: TypeWriterProps) {
    super(props);
    this.state = { animating: [], text: "" };
    
    if (this.props.pitch > 0) {
      this.audioCtx = new window.AudioContext();

      let gainNode = this.audioCtx.createGain();
      gainNode.gain.value = this.props.gain;
      gainNode.connect(this.audioCtx.destination);

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = "triangle";

      this.oscillator.connect(gainNode);
      this.oscillator.frequency.setValueAtTime(0, this.audioCtx.currentTime);
      this.oscillator.start();
    }

    if(!this.isRunning){
      this.isRunning = true;
      this.typeAsync(this.props.text);
    }
  }

  /**
   * Starts typing the text. Each character is added to the animating list and then added to the static text after the animation duration.
   * @param text The text to type.
   */
  private async typeAsync(text: string): Promise<void> {
    for (const char of text) {
      this.state.animating.push(char);
      this.setState((prev) => ({ animating: [...prev.animating] }));
      this.makeStatic();
      
      let isSentenceEnder = [".", "!", "?"].includes(char);
      let isPause = [",", ";", ":"].includes(char);
      let delay = this.props.typeSpeed;
      
      // Check if char is a sentence ender.
      if (isSentenceEnder)
        delay = this.props.typeSpeed * 25;

      // Check if the char is a pause.
      if (isPause)
        delay = this.props.typeSpeed * 10;
      
      // Handle audio of text.
      if(this.props.pitch > 0){
        let pitchChar = char.toLowerCase();

        // Play sound if alphanumeric.
        if (/[a-z0-9]/.test(pitchChar)){
          // Determine ascii value of char.
          let ascii = pitchChar.charCodeAt(0);
          let pitchShift = 1 + ((ascii % 10 + 1) / 10) / 5;
          let vowelShift = 1.2;

          // Make vowels higher pitch.
          if (/[aeiou]/.test(char)){
            this.oscillator?.frequency.setValueAtTime(this.props.pitch * vowelShift * pitchShift, this.audioCtx?.currentTime || 0);
          } else {
            this.oscillator?.frequency.setValueAtTime(this.props.pitch * pitchShift, this.audioCtx?.currentTime || 0);
          }
        } else if (char != " ") {
          this.oscillator?.frequency.setValueAtTime(0, this.audioCtx?.currentTime || 0);
        }
      }
      
      await Delay(delay);
    }

    if (this.props.pitch > 0) {
      this.oscillator!.stop();
      this.audioCtx!.close();
    }

    this.props.onFinished?.call(this);
  }

  /**
   * Takes the first character from the animating list and adds it to the static text after the animation duration.
   */
  private async makeStatic(): Promise<void> {
    await Delay(this.props.characterAnimationDuration);

    let character = this.state.animating.shift();
    this.setState((prev) => ({ animating: [... prev.animating], text: prev.text + character }));
  }

  render(): JSX.Element {
    let animationDuration: number = this.props.characterAnimationDuration / 1000;

    return (
        <span key="typewriter-span" style={{ color: this.props.color, fontSize: this.props.size, whiteSpace: "pre-wrap" }}>
            {
                // Display the static text.
                <motion.span key="static-text">
                    {(this.state.text)}
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
                            {text}
                        </motion.span>
                ))
            }
        </span>
    );
  }
}
