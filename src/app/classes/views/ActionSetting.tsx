import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { TextEditor } from "./TextEditor";
import { FiTrash2 } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import ActionViewModel from "../viewmodels/ActionViewModel";

interface StoryEventSettingProps {
    action: ActionViewModel;
    onDelete: (action: ActionViewModel) => void;
}

export const ActionSetting: React.FC<StoryEventSettingProps> = observer(({ action, onDelete }) => {
  return (
    <div className="space-y-4 hover:bg-muted transition-colors rounded p-2">
        <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
            <Input placeholder="Names" value={action.actionNames} onChange={(v) => action.actionNames = v.target.value} />
            <Button variant="ghost" onClick={() => onDelete(action)}>
                <FiTrash2 color="salmon" />
            </Button>
        </div>
        <TextEditor text={action.response} onChange={(v) => action.response = v} placeholder="Description" />
    </div>
  );
});
  