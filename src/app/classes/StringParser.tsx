"use client";

import React, { JSX, useRef } from "react";
import { motion } from "framer-motion";
import Delay from "./Await";
import Typewriter from "./Typewriter";
import { TypeWriterProps } from "./Typewriter";
import { parserCommands } from "./Commands";
import { Children } from "react";

interface StringParserProps {
  typeWriterProps: TypeWriterProps;
}

interface StringParserState {
  writers: JSX.Element[];
}

export default class StringParser extends React.Component<StringParserProps, StringParserState> {
  private propsStack: StringParserProps[] = [];
  private isParsing: boolean = false;
  
  constructor(props: StringParserProps) {
    super(props);
    this.state = { writers: [] };
    this.propsStack.push(props);
  }

  render(): JSX.Element {
    return (
      <div className="m-8">
        {this.state.writers}
      </div>
    );
  }

  /**
   * Gets the properties at the top of the stack.
   * @returns The properties at the top of the stack.
   */
  public getProps(): StringParserProps {
    return this.propsStack[this.propsStack.length - 1];
  }

  /**
   * Parses a string and handles ingrained commands and typewriters.
   * @param text The text to parse.
   */
  public async parseAsync(text: string): Promise<void> {
    let ongoingText: string = "";
    let depth: number = 0;

    for (const char of text) {
      if (char == "[") {
        if(depth == 0)
          await this.addDefaultTypewriterAsync(ongoingText);

        ongoingText = "";
        depth++;
      }

      ongoingText += char;
      if (char == "]") {
        depth--;

        console.log(`Depth: ${depth}`);
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

    await this.addDefaultTypewriterAsync(ongoingText);
  }

  /**
   * Adds a typewriter to the list of typewriters and types the text.
   * @param text The text to add to the typewriter.
   * @param props The properties of the typewriter.
   */
  public async addTypewriterAsync(text: string, props: TypeWriterProps): Promise<void> {
    if (!text)
      return;

    this.isParsing = true;

    let typewriterNode: JSX.Element = <Typewriter key={this.state.writers.length} {...props} text={text} onFinished={() => this.isParsing = false} />;
    this.setState((prev) => ({writers: [... prev.writers, typewriterNode]}));

    while (this.isParsing)
      await Delay(50);
  }

  /**
   * Adds a typewriter to the list of typewriters and types the text.
   * This uses the default properties of the parser.
   * @param text The text to add to the typewriter.
   */
  public async addDefaultTypewriterAsync(text: string): Promise<void> {
    return this.addTypewriterAsync(text, this.getProps().typeWriterProps);
  }

  /**
   * Handles a command in the form of [command;arg1;arg2;...].
   * @param subString The substring to parse.
   */
  private async handleCommandAsync(subString: string): Promise<void> {
    console.log(`Handling command: ${subString}`);
    let cleanedString = subString.slice(1, -1);
    let components = cleanedString.split(";");
    let command = components[0].toLowerCase();
    let args = components.slice(1);
    this.startNesting();

    if (command in parserCommands){
      let returnValue = parserCommands[command](this, args);

      if (returnValue instanceof Promise)
        await returnValue;
    }
    else
      throw new Error(`Unknown command: ${command}`);

    this.endNesting();
  }

  /**
   * Pushes a new set of properties onto the stack.
   */
  private startNesting(): void {
    let clone = { ...this.propsStack[this.propsStack.length - 1] };
    console.log(this.propsStack.length);
    this.propsStack.push(clone);
    clone.typeWriterProps.color = this.getProps().typeWriterProps.color;
    console.log(this.propsStack.length);
  }

  /**
   * Pops the top set of properties off the stack.
   */
  private endNesting(): void {
    this.propsStack.pop();
  }
}
