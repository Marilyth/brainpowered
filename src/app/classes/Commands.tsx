import StringParser from "./StringParser";
import Delay from "./Await";

export const parserCommands: { [key: string]: (parser: StringParser, args: string[]) => Promise<void>|void } = {
    "color": writeColoredAsync,
    "speed": writeSpeedAsync,
    "size": writeSizeAsync,
    "pause": pauseAsync,
    "sound": playSoundAsync,
    "voice": playVoiceAsync,
    "backgroundcolor": setBackgroundColorAsync,
    "screenshake": screenShakeAsync,
    "nowait": fireAndForgetAsync
};

/**
 * Changes the color of the top properties in the stack of the parser.
 * @param parser The parser to change the color of.
 * @param args The arguments to the command.
 * 
 * args[0] is the color to change to.
 * 
 * args[1] is the text to write.
 */
async function writeColoredAsync(parser: StringParser, args: string[]): Promise<void> {
    const color = args[0];
    const text = args[1];
    parser.getProps().typeWriterProps.color = color;

    await parser.startParsingAsync(text);
}

/**
 * Changes the speed of the top properties in the stack of the parser.
 * @param parser The parser to change the speed of.
 * @param args The arguments to the command.
 * 
 * args[0] is the speed to change to.
 * 
 * args[1] is the text to write.
 */
async function writeSpeedAsync(parser: StringParser, args: string[]): Promise<void> {
    const speed = parseInt(args[0]);
    const text = args[1];
    parser.getProps().typeWriterProps.typeSpeed = speed;

    await parser.startParsingAsync(text);
}

/**
 * Changes the size of the top properties in the stack of the parser.
 * @param parser The parser to change the size of.
 * @param args The arguments to the command.
 * 
 * args[0] is the size to change to.
 * 
 * args[1] is the text to write.
 */
async function writeSizeAsync(parser: StringParser, args: string[]): Promise<void> {
    const size = args[0];
    const text = args[1];
    parser.getProps().typeWriterProps.size = size;

    await parser.startParsingAsync(text);
}

/**
 * Plays a voice with the given pitch, gain, and text.
 * @param parser The parser to play the voice on.
 * @param args The arguments to the command.
 * 
 * args[0] is the pitch of the voice.
 * 
 * args[1] is the gain of the voice.
 * 
 * args[2] is the text to type during the voice.
 */
async function playVoiceAsync(parser: StringParser, args: string[]): Promise<void> {
    const pitch = parseInt(args[0]);
    const gain = parseInt(args[1]);
    const text = args[2];

    parser.getProps().typeWriterProps.pitch = pitch;
    parser.getProps().typeWriterProps.gain = gain / 100;

    await parser.startParsingAsync(text);
}

/**
 * Pauses the parser for a given amount of time.
 * @param parser The parser to pause.
 * @param args The arguments to the command.
 * 
 * args[0] is the time to pause in milliseconds.
 */
async function pauseAsync(parser: StringParser, args: string[]): Promise<void> {
    const time = parseInt(args[0]);
    await Delay(time);
}

/**
 * Plays a sound from the given URL.
 * @param parser The parser.
 * @param args The arguments to the command.
 * 
 * args[0] is the URL of the sound to play.
 * 
 * args[1] is the volume to play the sound at in percentage 0 - 100.
 * 
 * args[2] is a text to type during the sound. If the argument isn't given, the sound plays asynchronously.
 */
async function playSoundAsync(parser: StringParser, args: string[]): Promise<void> {
    const sound = args[0];
    const volume = parseInt(args[1]);

    const audio = new Audio(sound);
    audio.volume = volume / 100;
    
    audio.play();

    if (args.length == 3) {
        const audioPromise = new Promise<void>((resolve) => audio.onended = () => resolve());
        await parser.startParsingAsync(args[2]);
        await audioPromise;
    }
}

/**
 * Changes the background color of the page.
 * @param parser The parser.
 * @param args The arguments to the command.
 * 
 * args[0] is the color to change to.
 * 
 * args[1] the speed of the transition.
 */
async function setBackgroundColorAsync(parser: StringParser, args: string[]): Promise<void> {
    const speed = parseInt(args[1]);
    const color = args[0];

    document.body.style.transition = `background-color ${speed}ms`;
    document.body.style.backgroundColor = color;

    await Delay(speed);
}

/**
 * Shakes the screen.
 * @param parser The parser.
 * @param args The arguments to the command.
 * 
 * args[0] is the duration of the shake.
 */
async function screenShakeAsync(parser: StringParser, args: string[]): Promise<void> {
    const extend = parseInt(args[0]);
    const shakeCount = parseInt(args[1]);
    const shakeTime = parseInt(args[2]);

    const body = document.body;
    const originalPosition = body.style.transform;

    for (let i = 0; i < shakeCount; i++) {
        const x = Math.random() * extend - extend / 2;
        const y = Math.random() * extend - extend / 2;

        body.style.transform = `translate(${x}px, ${y}px)`;
        await Delay(shakeTime);
    }

    body.style.transform = originalPosition;
}

/**
 * Executes a command without waiting for it to finish.
 * @param parser The parser.
 * @param args The arguments to the command.
 */
function fireAndForgetAsync(parser: StringParser, args: string[]): void {
    parser.startParsingAsync(args[0]);
}