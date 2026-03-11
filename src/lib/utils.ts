import { Interaction } from "@/app/classes/models/base/Interaction";
import { Story } from "@/app/classes/models/Story";
import { deserialize, serialize } from "@/app/classes/utility/JsonHelper";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { appContext } from "@/app/context";

const ids = new WeakMap();

export function getReferenceId(obj: WeakKey) {
  if (!ids.has(obj))
    ids.set(obj, crypto.randomUUID());

  return ids.get(obj);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function loadStoryAsync(file: File) : Promise<void>
{
  const jsonString = await file.text();
  const loadedStory: Story = deserialize(jsonString) as Story;
  loadedStory.fillDictionary();

  appContext.currentStory = loadedStory;
}

export function saveStory(){
  const storyJson = serialize(appContext.currentStory);
  const blob = new Blob([storyJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${appContext.currentStory!.name}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Returns the best match of an action for the user input.
 * @param actions The possible actions.
 * @param input The user input.
 */
export function parseUserInput(actions: Interaction[], input: string): Interaction | null {
    const normalizedInput: string = input.toLowerCase().replaceAll(/[^a-z0-9 ]/g, "");
    const tokens: string[] = normalizedInput.split(" ");

    for (const action of actions) {
        if (action.matches(tokens)) {
            return action;
        }
    }

    return null;
}