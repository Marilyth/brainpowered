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
}

export const CommandDialog: React.FC<CommandDialogProps> = observer(({ command }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{command.name}</DialogTitle>
        <DialogDescription>
          {command.description}
        </DialogDescription>
      </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
            {command.parameters.map((parameter, index) => (
                <div key={index} className="flex flex-col">
                    <Label>{parameter.name}</Label>
                    {parameter.description}
                    <Input
                        value={parameter.value}
                        onChange={(e) => parameter.value = e.target.value} />
                </div>
            ))}
        </div>
      <DialogFooter>
        <Button
            variant="outline"
            className="mt-4">
            Insert
        </Button>
      </DialogFooter>
    </DialogContent>
  );
});
  