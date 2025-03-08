"use client";

import React, { JSX } from "react";
import { motion, TargetAndTransition, Transition } from "framer-motion";
import Delay from "./utility/Await";

export interface TypeWriterProps {
  opacityAnimationDuration: number;
  typeSpeed: number;
  text: string;
  pitch: number;
  gain: number;

  characterWrappers: ((element: JSX.Element) => JSX.Element)[];
  blockWrappers: ((element: JSX.Element) => JSX.Element)[];
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

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.value = this.props.gain / 3;
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
      
      const isSentenceEnder = [".", "!", "?"].includes(char);
      const isPause = [",", ";", ":"].includes(char);
      let delay = this.props.typeSpeed;
      
      // Check if char is a sentence ender.
      if (isSentenceEnder)
        delay = this.props.typeSpeed * 25;

      // Check if the char is a pause.
      if (isPause)
        delay = this.props.typeSpeed * 10;
      
      // Handle audio of text.
      if(this.props.pitch > 0){
        const pitchChar = char.toLowerCase();

        // Play sound if alphanumeric.
        if (/[a-z0-9]/.test(pitchChar)){
          // Determine ascii value of char.
          const ascii = pitchChar.charCodeAt(0);
          const pitchShift = 1 + ((ascii % 10 + 1) / 10) / 5;
          const vowelShift = 1.2;

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
   * Takes the first character from the animating list and adds it to the static text.
   */
  private async makeStatic(): Promise<void> {
    const character = this.state.animating.shift();
    this.setState((prev) => ({ animating: [... prev.animating], text: prev.text + character }));
  }

  render(): JSX.Element {
    const block =
    <span key="typewriter-span" style={{ whiteSpace: "pre-wrap" }}>
    {
        // Display the static text.
        <span key="static-text" style={{display: "inline-block" }}>
            {(this.state.text)}
        </span>
    }
    {
        // Display the animating text.
        this.state.animating.map((text, i) => (
                <motion.div
                    onAnimationComplete={() => this.makeStatic()}
                    style={{display: "inline-block", ...this.props.characterStyle}}
                    key={this.state.text.length + i}
                    initial={{ opacity: 0, ...this.props.characterInitial }}
                    animate={{ opacity: 1, ...this.props.characterAnimate }}
                    transition={{
                      duration: 0.3, ease: "easeOut",
                      ...this.props.characterTransition
                    }}
                >
                    {text}
                </motion.div>
        ))
    }
    </span>;

    for (const wrapper of this.props.blockWrappers)
      block = wrapper(block);
  }
}
