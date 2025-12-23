import { appContext } from "@/app/context";
import { Button } from "@/components/ui/button";
import { loadStoryAsync } from "@/lib/utils";
import { redirect } from "next/navigation";
import { FiFile, FiSearch, FiUpload } from "react-icons/fi";
import { demo } from "../models/stories/Demo/Demo";

export const EmptyStoryView: React.FC = () => {
    function loadStory() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];

            if (file) {
                await loadStoryAsync(file);
            };
        };

        input.click();
    }

    function loadDemo() {
        appContext.setCurrentStory(demo);
    }

    function browseStories() {
        redirect("/browse");
    }

    return (
        <div className="p-4">
            <div className="flex flex-col space-y-4 text-center p-4 border-dashed border-2 rounded-lg">
                <h2 className="text-2xl font-bold">No Story Loaded</h2>
                <p>Please load a story to begin playing.</p>
                <div className="flex flex-row space-x-4 justify-center">
                    <Button variant="outline" onClick={loadStory}><FiUpload/> Load story</Button>
                    <Button variant="outline" onClick={browseStories}><FiSearch/> Browse stories</Button>
                    <Button variant="outline" onClick={loadDemo}><FiFile/> Load demo story</Button>
                </div>
            </div>
        </div>
    );
}