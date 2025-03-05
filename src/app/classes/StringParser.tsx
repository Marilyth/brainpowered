"use client";

import React, { JSX, useRef } from "react";
import Delay from "./Await";
import Typewriter from "./Typewriter";
import { TypeWriterProps } from "./Typewriter";
import { parserCommands } from "./Commands";

interface StringParserProps {
  typeWriterProps: TypeWriterProps;
}

interface StringParserState {
  writers: JSX.Element[];
}

export default class StringParser extends React.Component<StringParserProps, StringParserState> {
  private propsStack: StringParserProps[] = [];
  
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
   * Adds a typewriter to the list of typewriters and types the text.
   * @param text The text to add to the typewriter.
   * @param props The properties of the typewriter.
   */
  public async addTypewriterAsync(text: string, props: TypeWriterProps): Promise<void> {
    if (!text)
      return;

    let isParsing = true;

    let typewriterNode: JSX.Element = <Typewriter key={this.state.writers.length} {...props} text={text} onFinished={async () => isParsing = false} />;
    this.state.writers.push(typewriterNode);

    this.setState((prev) => ({writers: [... prev.writers]}));

    // Wait until the typewriter is done typing.
    while (isParsing)
      await Delay(10);
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
   * Parses a string stream and handles ingrained commands and typewriters.
   * @param text The text to parse.
   */
  public async startParsingAsync(text: string): Promise<void> {
    let ongoingText: string = "";
    let depth: number = 0;

    for (const char of text) {
      if (char == "[") {
        if(depth == 0 && ongoingText){
          await this.addDefaultTypewriterAsync(ongoingText);
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

    await this.addDefaultTypewriterAsync(ongoingText);
  }

  /**
   * Handles a command in the form of [command;arg1;arg2;...].
   * @param subString The substring to parse.
   */
  private async handleCommandAsync(subString: string): Promise<void> {
    let cleanedString = subString.slice(1, -1);
    let args: string[] = [];

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
        let returnValue = parserCommands[args[0]](this, args.slice(1));

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
    let clone = JSON.parse(JSON.stringify(this.getProps()));
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
