"use client";

import React from "react";
import Delay from "@/app/classes/utility/Await";
import { runCommand } from "@/app/classes/utility/Commands";
import Story from "@/app/classes/models/world/base/Story";
import { makeAutoObservable } from "mobx";
import { TargetAndTransition, Transition } from "motion/react";
import { SynthVoice } from "@/app/classes/utility/SynthVoice";
import { WorldNode } from "../models/world/base/WorldNode";

export let currentTypeWriter: TypeWriterViewModel;

export function setCurrentTypeWriter(viewModel: TypeWriterViewModel): void {
  currentTypeWriter = viewModel;
}

export interface TypeWriterProps {
  opacityAnimationDuration: number;
  
  typeSpeed: number;
  pitch: number;
  volumes: number[];


  characterStyle?: React.CSSProperties;
  characterInitial?: TargetAndTransition;
  characterAnimate?: TargetAndTransition;
  characterTransition?: Transition;
}

export default class TypeWriterViewModel {
  public story: Story | null = null;
  public renderedTextBlocks: [TypeWriterProps, string[]][] = [];
  public isBusy: boolean = false;

  private propsStack: TypeWriterProps[] = [];
  private macros = new Map<string, string>();
  private lastCharacter: string = "";
  
  constructor(props: TypeWriterProps) {
    makeAutoObservable(this);
    this.propsStack.push(props);
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
  public async startParsingAsync(text: string, caller: WorldNode | null = null): Promise<void> {
    // Handle macros first.
    text = this.replaceMacros(this.extractMacros(text));

    // Handle text manipulation for the first-level text.
    if (this.propsStack.length == 1) {
      this.isBusy = true;
      
      // If missing, add a space before the text if the last character was a non-space character.
      if (this.lastCharacter && !/^\s/.test(text) && !/\s$/.test(this.lastCharacter))
        text = " " + text;

      text = this.story?.markNodesInText(text) ?? text;
    }

    let ongoingText: string = "";
    let depth: number = 0;

    for (let i = 0; i < text.length; i++) {
      // Evaluate and replace script executions.
      if (text[i] == "$" && text[i + 1] == "{") {
        text = text.slice(0, i) + this.evaluateScript(text.slice(i), caller);
        i--;
        continue;
      }

      const char = text[i];

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

    if (this.propsStack.length == 1){
      this.isBusy = false;
    }
  }

  /**
   * Replaces the script in the text with the evaluated result.
   * @param text The text to evaluate.
   * @param caller The caller of the script. This is used to evaluate the script in the context of the caller.
   * @returns The text with the evaluated script.
   */
  private evaluateScript(text: string, caller: WorldNode | null): string {
    let depth: number = 1;
    let script: string = "";

    for (let i = 2; i < text.length; i++) {
      const char = text[i];

      if (char == "}") {
        depth--;

        if (depth < 0)
          throw new Error("Mismatched brackets < 0");
        else if (depth == 0) {
          text = text.slice(i + 1);
          break;
        }
      }

      script += char;
    }

    let response = (caller ?? this.story)!.evaluateVariableExpression(script);

    if (this.story != null)
      response = this.story.markNodesInText(response);

    return response + text;
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
    const currentProps = this.getProps();
    const propsIndex = this.renderedTextBlocks.push([currentProps, []]) - 1;
    const voice: SynthVoice | null = currentProps.volumes.length > 0 ? new SynthVoice(currentProps.pitch, currentProps.volumes) : null;

    for (const char of text) {
      this.renderedTextBlocks[propsIndex][1].push(char);
      this.lastCharacter = char;

      const isSentenceEnder = [".", "!", "?"].includes(char);
      const isPause = [",", ";", ":"].includes(char);
      let delay = currentProps.typeSpeed;
      
      // Check if char is a sentence ender.
      if (isSentenceEnder)
        delay = currentProps.typeSpeed * 25;

      // Check if the char is a pause.
      if (isPause)
        delay = currentProps.typeSpeed * 10;
      
      // Handle audio of text.
      voice?.voiceCharacter(char);
      await Delay(delay);
    }

    voice?.stop();
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

    this.startNesting();

    try {
      const returnValue = runCommand(args[0], args.slice(1));

      if (returnValue instanceof Promise)
        await returnValue;
    }
    finally {
      this.endNesting();
    }
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
