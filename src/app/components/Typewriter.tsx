"use client";

import React from "react";
import { motion, TargetAndTransition, Transition } from "framer-motion";
import Delay from "../classes/utility/Await";

export interface TypeWriterProps {
  opacityAnimationDuration?: number;
  typeSpeed?: number;
  text: string;
  pitch?: number;
  gain?: number;

  characterStyle?: React.CSSProperties;
  characterInitial?: TargetAndTransition;
  characterAnimate?: TargetAndTransition;
  characterTransition?: Transition;

  blockStyle?: React.CSSProperties;
  onFinished?: () => void;
}

export const Typewriter: React.FC<TypeWriterProps> = ({
  opacityAnimationDuration = 0.3,
  typeSpeed = 50,
  text = "",
  pitch = 0,
  gain = 1,

  characterStyle = {},
  characterInitial = {},
  characterAnimate = {},
  characterTransition = {},

  blockStyle,
  onFinished
}) => {
    const [animating, setAnimating] = React.useState<string[]>([]);
    const [staticText, setText] = React.useState<string>("");

    let oscillator: (OscillatorNode | null) = null;
    let audioCtx: (AudioContext | null) = null;
    let isRunning: boolean = false;

    if (pitch > 0) {
      audioCtx = new window.AudioContext();

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = gain / 3;
      gainNode.connect(audioCtx.destination);

      oscillator = audioCtx.createOscillator();
      oscillator.type = "triangle";

      oscillator.connect(gainNode);
      oscillator.frequency.setValueAtTime(0, audioCtx.currentTime);
      oscillator.start();
    }

    React.useEffect(() => {
      typeAsync(text);
    }, []);

    async function typeAsync(text: string): Promise<void> {
      if (isRunning) return;
      isRunning = true;

      for (const char of text) {
        animating.push(char);
        setAnimating([...animating]);
        
        const isSentenceEnder = [".", "!", "?"].includes(char);
        const isPause = [",", ";", ":"].includes(char);
        let delay = typeSpeed;
        
        // Check if char is a sentence ender.
        if (isSentenceEnder)
          delay = typeSpeed * 25;
  
        // Check if the char is a pause.
        if (isPause)
          delay = typeSpeed * 10;
        
        // Handle audio of text.
        if(pitch > 0){
          const pitchChar = char.toLowerCase();
  
          // Play sound if alphanumeric.
          if (/[a-z0-9]/.test(pitchChar)){
            // Determine ascii value of char.
            const ascii = pitchChar.charCodeAt(0);
            const pitchShift = 1 + ((ascii % 10 + 1) / 10) / 5;
            const vowelShift = 1.2;
  
            // Make vowels higher pitch.
            if (/[aeiou]/.test(char)){
              oscillator?.frequency.setValueAtTime(pitch * vowelShift * pitchShift, audioCtx?.currentTime || 0);
            } else {
              oscillator?.frequency.setValueAtTime(pitch * pitchShift, audioCtx?.currentTime || 0);
            }
          } else if (char != " ") {
            oscillator?.frequency.setValueAtTime(0, audioCtx?.currentTime || 0);
          }
        }
        
        await Delay(delay);
      }
  
      if (pitch > 0) {
        oscillator!.stop();
        audioCtx!.close();
      }
  
      onFinished?.();
    }
    
    /**
     * Takes the first character from the animating list and adds it to the static text.
     */
    async function makeStatic(): Promise<void> {
      //const character = animating.shift();
      //setAnimating([...animating]);
      //setText(staticText + character);
    }

    return (
      <span key="typewriter-span" style={{ whiteSpace: "pre-wrap", ...blockStyle }}>
        {
            // Display the static text.
            <span key="static-text" style={{display: "inline-block" }}>
                {(staticText)}
            </span>
        }
        {
            // Display the animating text.
            animating.map((text, i) => (
                    <motion.div
                        onAnimationComplete={() => makeStatic()}
                        style={{display: "inline-block", ...characterStyle}}
                        key={text.length + i}
                        initial={{ opacity: 0, ...characterInitial }}
                        animate={{ opacity: 1, ...characterAnimate }}
                        transition={{
                          duration: 0.3, ease: "easeOut",
                          ...characterTransition
                        }}
                    >
                        {text}
                    </motion.div>
            ))
        }
      </span>
    );
};
