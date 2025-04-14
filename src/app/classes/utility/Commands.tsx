import { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
import Delay from "./Await";
import { events } from "./Events";
import { Command } from "./Command";
import { CommandParameter } from "./CommandParameter";

export const commands: Command[] = []

const writeColoredCommand = new Command(writeColoredAsync);
commands.push(writeColoredCommand);
writeColoredCommand.name = "color";
writeColoredCommand.description = "Changes the color of the text.";
writeColoredCommand.parameters.push(new CommandParameter("color", "The color to change to."));
writeColoredCommand.parameters.push(new CommandParameter("text", "The text to write."));
async function writeColoredAsync(args: string[]): Promise<void> {
    const color = args[0];
    const text = args[1];
    
    currentTypeWriter.getProps().characterInitial!.color = "#FFFFFF";
    currentTypeWriter.getProps().characterAnimate!.color = color;

    (currentTypeWriter.getProps().characterTransition as any).color = { duration: 0.3, ease: "easeIn" };

    await currentTypeWriter.startParsingAsync(text);
}

const writeGlowingCommand = new Command(writeGlowingAsync);
commands.push(writeGlowingCommand);
writeGlowingCommand.name = "glow";
writeGlowingCommand.description = "Adds a glowing effect to the text.";
writeGlowingCommand.parameters.push(new CommandParameter("text", "The text to write."));
async function writeGlowingAsync(args: string[]): Promise<void> {
    const text = args[0];
    
    currentTypeWriter.getProps().characterInitial!.textShadow = "0em 0em 0em";
    currentTypeWriter.getProps().characterAnimate!.textShadow = "0em 0em 0.5em";

    await currentTypeWriter.startParsingAsync(text);
}

const writeSpeedCommand = new Command(writeSpeedAsync);
commands.push(writeSpeedCommand);
writeSpeedCommand.name = "speed";
writeSpeedCommand.description = "Changes the speed of the text.";
writeSpeedCommand.parameters.push(new CommandParameter("speed", "The speed to change to."));
writeSpeedCommand.parameters.push(new CommandParameter("text", "The text to write."));
async function writeSpeedAsync(args: string[]): Promise<void> {
    const speed = parseInt(args[0]);
    const text = args[1];
    currentTypeWriter.getProps().typeSpeed = speed;

    await currentTypeWriter.startParsingAsync(text);
}

const writeSizeCommand = new Command(writeSizeAsync);
commands.push(writeSizeCommand);
writeSizeCommand.name = "size";
writeSizeCommand.description = "Changes the size of the text.";
writeSizeCommand.parameters.push(new CommandParameter("size", "The size to change to."));
writeSizeCommand.parameters.push(new CommandParameter("text", "The text to write."));
async function writeSizeAsync(args: string[]): Promise<void> {
    const size = args[0];
    const text = args[1];
    currentTypeWriter.getProps().characterStyle!.fontSize = size;

    await currentTypeWriter.startParsingAsync(text);
}

const writeVoiceCommand = new Command(playVoiceAsync);
commands.push(writeVoiceCommand);
writeVoiceCommand.name = "voice";
writeVoiceCommand.description = "Plays a voice with the given pitch and gain.";
writeVoiceCommand.parameters.push(new CommandParameter("pitch", "The pitch of the voice."));
writeVoiceCommand.parameters.push(new CommandParameter("gain", "The gain of the voice."));
writeVoiceCommand.parameters.push(new CommandParameter("text", "The text to write."));
async function playVoiceAsync(args: string[]): Promise<void> {
    const pitch = parseInt(args[0]);
    const gain = parseInt(args[1]);
    const text = args[2];

    const overtones: number[] = [];

    for (let i = 0; i < 5; i++) {
        overtones.push(gain / (100 * (i + 1)));
    }

    currentTypeWriter.getProps().pitch = pitch;
    currentTypeWriter.getProps().volumes = overtones;

    await currentTypeWriter.startParsingAsync(text);
}

const writePauseCommand = new Command(pauseAsync);
commands.push(writePauseCommand);
writePauseCommand.name = "pause";
writePauseCommand.description = "Pauses for a given amount of time.";
writePauseCommand.parameters.push(new CommandParameter("time", "The time to pause for."));
async function pauseAsync(args: string[]): Promise<void> {
    const time = parseInt(args[0]);
    await Delay(time);
}

const playSoundCommand = new Command(playSoundAsync);
commands.push(playSoundCommand);
playSoundCommand.name = "sound";
playSoundCommand.description = "Plays a sound from the given URL.";
playSoundCommand.parameters.push(new CommandParameter("url", "The URL of the sound to play."));
playSoundCommand.parameters.push(new CommandParameter("volume", "The volume to play the sound at in percentage 0 - 100."));
playSoundCommand.parameters.push(new CommandParameter("text", "The text to type during the sound."));
async function playSoundAsync(args: string[]): Promise<void> {
    const sound = args[0];
    const volume = parseInt(args[1]);

    const audio = new Audio(sound);
    audio.volume = volume / 100;
    
    audio.play();

    if (args.length == 3) {
        const audioPromise = new Promise<void>((resolve) => audio.onended = () => resolve());
        await currentTypeWriter.startParsingAsync(args[2]);
        await audioPromise;
    }
}

const setBackgroundColorCommand = new Command(setBackgroundColorAsync);
commands.push(setBackgroundColorCommand);
setBackgroundColorCommand.name = "backgroundcolor";
setBackgroundColorCommand.description = "Changes the background color of the page.";
setBackgroundColorCommand.parameters.push(new CommandParameter("color", "The color to change to."));
setBackgroundColorCommand.parameters.push(new CommandParameter("speed", "The speed of the transition."));
async function setBackgroundColorAsync(args: string[]): Promise<void> {
    const speed = parseInt(args[1]);
    const color = args[0];

    document.body.style.transition = `background-color ${speed}ms`;
    document.body.style.backgroundColor = color;

    await Delay(speed);
}

const screenShakeCommand = new Command(screenShakeAsync);
commands.push(screenShakeCommand);
screenShakeCommand.name = "screenshake";
screenShakeCommand.description = "Shakes the screen.";
screenShakeCommand.parameters.push(new CommandParameter("extend", "The distance to shake the screen."));
screenShakeCommand.parameters.push(new CommandParameter("shakeCount", "The number of shakes."));
screenShakeCommand.parameters.push(new CommandParameter("shakeTime", "The time to shake for."));
async function screenShakeAsync(args: string[]): Promise<void> {
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

const fireAndForgetCommand = new Command(fireAndForgetAsync);
commands.push(fireAndForgetCommand);
fireAndForgetCommand.name = "async";
fireAndForgetCommand.description = "Executes a command without waiting for it to finish.";
fireAndForgetCommand.parameters.push(new CommandParameter("text", "The text to write."));
function fireAndForgetAsync(args: string[]): void {
    currentTypeWriter.startParsingAsync(args[0]);
}

const emitEventCommand = new Command(emitEventAsync);
commands.push(emitEventCommand);
emitEventCommand.name = "event";
emitEventCommand.description = "Emits an event with the given arguments.";
emitEventCommand.parameters.push(new CommandParameter("eventName", "The name of the event to emit."));
emitEventCommand.parameters.push(new CommandParameter("args", "The arguments to the event."));
function emitEventAsync(args: string[]): Promise<void> {
    const eventName = args[0];
    const eventArgs = args.slice(1);
    events.emit(`event_triggered:${eventName}`, eventArgs);

    return Promise.resolve();
}

const executeCodeCommand = new Command(executeCodeAsync);
commands.push(executeCodeCommand);
executeCodeCommand.name = "script";
executeCodeCommand.description = "Executes a script with the given arguments.";
executeCodeCommand.parameters.push(new CommandParameter("args", "The arguments to the script."));
async function executeCodeAsync(args: string[]): Promise<void> {
    const code = args.join(";");

    const func = new Function("context", `"use strict"; return (async function() { ${code} }).call(context);`);
    await func.call(null, { currentTypeWriter, events });
}

export async function runCommand(command: string, args: string[]): Promise<void> {
    const normalCommand = command.toLowerCase();
    const commandObj = commands.find((c) => c.name.toLowerCase() === normalCommand);

    if (commandObj) {
        await commandObj.InvokeAsync(args);
    }
    else {
        console.warn(`Command "${command}" not found.`);
    }
}