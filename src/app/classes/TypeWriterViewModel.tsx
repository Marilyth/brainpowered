"use client";

import React from "react";
import Delay from "./utility/Await";
import { parserCommands } from "./Commands";
import Story from "./world/base/Story";
import { makeAutoObservable } from "mobx";
import { TargetAndTransition, Transition } from "motion/react";


export interface TypeWriterProps {
  opacityAnimationDuration: number;
  
  typeSpeed: number;
  pitch: number;
  gain: number;

  characterStyle?: React.CSSProperties;
  characterInitial?: TargetAndTransition;
  characterAnimate?: TargetAndTransition;
  characterTransition?: Transition;
}

export default class TypeWriterViewModel {
  public story: Story | null = null;
  public renderedTextBlocks: [TypeWriterProps, string[]][] = [];

  private propsStack: TypeWriterProps[] = [];
  private macros = new Map<string, string>();
  private oscillator: (OscillatorNode | null) = null;
  private audioCtx: (AudioContext | null) = null;
  private gainNode: (GainNode | null) = null;
  
  constructor(props: TypeWriterProps) {
    makeAutoObservable(this);
    this.propsStack.push(props);
  }

  public setAudioContext(){
    // Add audio oscillator for synthesizing voice.
    this.audioCtx = new window.AudioContext();

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(this.audioCtx.destination);

    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.type = "triangle";

    this.oscillator.connect(this.gainNode);
    this.oscillator.frequency.setValueAtTime(0, this.audioCtx.currentTime);
    this.oscillator.start();
  }

  /**
   * Gets the properties at the top of the stack.
   * @returns The properties at the top of the stack.
   */
  public getProps(): TypeWriterProps {
    return this.propsStack[this.propsStack.length - 1];
  }

  /**
   * Parses a string stream and handles ingrained commands and typewriters.
   * @param text The text to parse.
   */
  public async startParsingAsync(text: string): Promise<void> {
    // Handle macros first.
    text = this.replaceMacros(this.extractMacros(text));

    // If we have a story, mark the nodes in the text.
    if (this.propsStack.length == 1 && this.story != null){
      text = this.story.markNodesInText(text);
    }

    let ongoingText: string = "";
    let depth: number = 0;

    for (const char of text) {
      if (char == "[") {
        if(depth == 0 && ongoingText){
          await this.typeAsync(ongoingText);
          ongoingText = "";
        }

        depth++;
      }

      ongoingText += char;
      
      if (char == "]") {
        depth--;

        if (depth < 0)
          throw new Error("Mismatched brackets < 0");
        
        // Bracket ended. Recursively parse the text inside the bracket.
        if (depth == 0){
          await this.handleCommandAsync(ongoingText);
          ongoingText = "";
        }
      }
    }

    if (depth != 0)
      throw new Error("Mismatched brackets > 0");

    await this.typeAsync(ongoingText);
  }

  /**
   * Extracts macros from the text and saves them to the map.
   * @param text The text to extract macros from.
   */
  private extractMacros(text: string): string {
    const macroRegex = /\$(\w+)\s*=\s*(.+)$/gm;

    for (const match of text.matchAll(macroRegex)) {
      this.macros.set(match[1], match[2]);
    }

    text = text.replaceAll(macroRegex, "[DELETE]").replaceAll(/\[DELETE\](?:\r\n|\r|\n)/g, "");

    return text;
  }

  private async typeAsync(text: string): Promise<void> {
    this.gainNode?.gain.setValueAtTime(this.getProps().gain, this.audioCtx?.currentTime || 0);
    const propsIndex = this.renderedTextBlocks.push([this.getProps(), []]) - 1;

    for (const char of text) {
      this.renderedTextBlocks[propsIndex][1].push(char);

      const isSentenceEnder = [".", "!", "?"].includes(char);
      const isPause = [",", ";", ":"].includes(char);
      let delay = this.getProps().typeSpeed;
      
      // Check if char is a sentence ender.
      if (isSentenceEnder)
        delay = this.getProps().typeSpeed * 25;

      // Check if the char is a pause.
      if (isPause)
        delay = this.getProps().typeSpeed * 10;
      
      // Handle audio of text.
      if (this.getProps().pitch > 0){
        const pitchChar = char.toLowerCase();

        // Play sound if alphanumeric.
        if (/[a-z0-9]/.test(pitchChar)){
          // Determine ascii value of char.
          const ascii = pitchChar.charCodeAt(0);
          const pitchShift = 1 + ((ascii % 10 + 1) / 10) / 5;
          const vowelShift = 1.2;

          // Make vowels higher pitch.
          if (/[aeiou]/.test(char)){
            this.oscillator?.frequency.setValueAtTime(this.getProps().pitch * vowelShift * pitchShift, this.audioCtx?.currentTime || 0);
          } else {
            this.oscillator?.frequency.setValueAtTime(this.getProps().pitch * pitchShift, this.audioCtx?.currentTime || 0);
          }
        } else if (char != " ") {
          this.oscillator?.frequency.setValueAtTime(0, this.audioCtx?.currentTime || 0);
        }
      }
      
      await Delay(delay);
    }

    if (this.getProps().pitch > 0) {
      this.oscillator?.frequency.setValueAtTime(0, this.audioCtx?.currentTime || 0);
      this.gainNode?.gain.setValueAtTime(0, this.audioCtx?.currentTime || 0);
    }
  }

  /**
   * Replaces all macros in the text with their values.
   * @param text The text to replace the macros in.
   */
  private replaceMacros(text: string): string {
    for (const [key, value] of this.macros) {
      text = text.replaceAll(`$\{${key}}`, value);
    }

    return text;
  }

  /**
   * Handles a command in the form of [command;arg1;arg2;...].
   * @param subString The substring to parse.
   */
  private async handleCommandAsync(subString: string): Promise<void> {
    console.log(subString);
    const cleanedString = subString.slice(1, -1);
    const args: string[] = [];

    // Split the arguments by semicolon. Ignore nested brackets.
    let currentArg = "";
    let depth = 0;
    for (const char of cleanedString) {
      if (char == "[")
        depth++;
      else if (char == "]")
        depth--;

      if (char == ";" && depth == 0) {
        args.push(currentArg);
        currentArg = "";
      }
      else
        currentArg += char;
    }

    if (currentArg || cleanedString.endsWith(";"))
      args.push(currentArg);

    if (args[0] in parserCommands){
      this.startNesting();

      try {
        const returnValue = parserCommands[args[0]](this, args.slice(1));

        if (returnValue instanceof Promise)
          await returnValue;
      }
      finally {
        this.endNesting();
      }
    }
    else
      throw new Error(`Unknown command: ${args[0]}`);
  }

  /**
   * Pushes a new set of properties onto the stack. Commands can modify these properties.
   */
  private startNesting(): void {
    const clone = JSON.parse(JSON.stringify(this.getProps()));
    this.propsStack.push(clone);
  }

  /**
   * Pops the top set of properties off the stack.
   */
  private endNesting(): void {
    this.propsStack.pop();

    if (this.propsStack.length == 0)
      throw new Error("Ended nesting more often than starting it.");
  }
}
