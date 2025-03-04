import StringParser from "./StringParser";

export const parserCommands: { [key: string]: (parser: StringParser, args: string[]) => Promise<void>|void } = {
    "color": writeColoredAsync,
    "speed": writeSpeedAsync
};

/**
 * Changes the color of the top properties in the stack of the parser.
 * @param parser The parser to change the color of.
 * @param args The arguments to the command.
 */
async function writeColoredAsync(parser: StringParser, args: string[]): Promise<void> {
    let color = args[0];
    let text = args[1];
    parser.getProps().typeWriterProps.color = color;

    await parser.parseAsync(text);
}

async function writeSpeedAsync(parser: StringParser, args: string[]): Promise<void> {
    let speed = parseInt(args[0]);
    let text = args[1];
    parser.getProps().typeWriterProps.typeSpeed = speed;

    await parser.parseAsync(text);
}