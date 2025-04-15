import { observer } from "mobx-react-lite";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Command } from "../utility/Command";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CommandDialogProps {
  command: Command;
  onInsert: (command: Command) => void;
}

export const CommandDialog: React.FC<CommandDialogProps> = observer(({ command, onInsert }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{command.name}</DialogTitle>
        <DialogDescription>
          {command.description}
        </DialogDescription>
      </DialogHeader>
        <div className="space-y-4">
            {command.parameters.map((parameter, index) => (
                <div key={index}>
                    <Label>{parameter.name}</Label>
                    <div className="text-muted-foreground text-sm">
                        {parameter.description}
                    </div>
                    <Input
                        value={parameter.value}
                        onChange={(e) => parameter.value = e.target.value} />
                </div>
            ))}
        </div>
      <DialogFooter>
        <Button
            onClick={() => {
                onInsert(command);
            }}
            variant="outline">
            Insert
        </Button>
      </DialogFooter>
    </DialogContent>
  );
});
  