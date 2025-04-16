import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { TextEditor } from "./TextEditor";
import { FiTrash2 } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import StoryEventViewModel from "../viewmodels/StoryEventViewModel";

interface StoryEventSettingProps {
    storyEvent: StoryEventViewModel;
    onDelete: (storyEvent: StoryEventViewModel) => void;
}

export const StoryEventSetting: React.FC<StoryEventSettingProps> = observer(({ storyEvent, onDelete }) => {
  return (
    <div className="space-y-4 hover:bg-muted transition-colors rounded p-2">
        <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
            <Input value={storyEvent.eventName} onChange={(v) => storyEvent.eventName = v.target.value} />
            <Button variant="ghost" onClick={() => onDelete(storyEvent)}>
                <FiTrash2 color="salmon" />
            </Button>
        </div>
        <TextEditor text={storyEvent.response} onChange={(v) => storyEvent.response = v} placeholder="Description" />
    </div>
  );
});
  