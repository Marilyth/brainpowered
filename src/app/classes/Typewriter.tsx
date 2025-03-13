"use client";

import React from "react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import TypeWriterViewModel from "./TypeWriterViewModel";

interface TypeWriterViewProps {
  viewModel: TypeWriterViewModel;
}

export const Typewriter: React.FC<TypeWriterViewProps> = observer(({ viewModel }) => {
    /**
     * Takes the first character from the animating list and adds it to the static text.
     */
    async function makeStatic(): Promise<void> {
      // Make the HTML less verbose after animations are done.
    }

    return (
      <div key="typewriter-span" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {
            // Display the animating text.
            viewModel.renderedTextBlocks.map((span, i) => (
              <span key={i} style={{ display: "inline", ...span[0].characterStyle }}>
                {span[1].map((char, j) => (
                  <motion.span
                    key={`${i}-${j}-${char}`} // Unique key to track new characters
                    onAnimationEnd={makeStatic}
                    initial={{ opacity: 0, ...span[0].characterInitial }}
                    animate={{ opacity: 1, ...span[0].characterAnimate }}
                    transition={{
                      duration: span[0].opacityAnimationDuration, ease: "easeOut",
                      ...span[0].characterTransition
                    }}
                    style={{ display: "inline" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))
        }
      </div>
    );
});
