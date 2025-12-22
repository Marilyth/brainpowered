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
import { Button } from "@/components/ui/button";
import { InputComponent } from "./InputComponent";

interface CommandDialogProps {
  inputValues: any[];
  command: Command;
  onInsert: (command: Command) => void;
}

export const CommandDialog: React.FC<CommandDialogProps> = observer(({ inputValues, command, onInsert }) => {
  if (inputValues.length <= command.parameters.length) {
    for (let i = 0; i < inputValues.length; i++) {
      command.parameters[i].value = inputValues[i] || "";
    }
  }

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
                    <InputComponent
                        type={parameter.valueType}
                        value={parameter.value}
                        onChange={(value) => {
                            parameter.value = value;
                        }}
                    />
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
  