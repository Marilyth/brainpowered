import { observer } from "mobx-react-lite";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar";
import { CommandIcon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { commands } from "../utility/Commands";
import { CommandDialog } from "./CommandDialog";
import { Command } from "../utility/Command";
import { Dialog } from "@/components/ui/dialog";
  

interface TextEditorProps {
  text: string;
  placeholder?: string;
  label?: string;
  isMultiline?: boolean;
  onChange?: (text: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = observer(({ text, placeholder, label, isMultiline = true, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<Command>(commands[0]);
  const [selectionRange, setSelectionRange] = useState([0, 0]);

  function textChanged(text: string) {
    if (onChange) {
      onChange(text);
    }
  }

  function insertCommand(command: Command) {
    const textBefore = text.substring(0, selectionRange[0]);
    const textAfter = text.substring(selectionRange[1]);
    textChanged(textBefore + command.toString() + textAfter);

    setIsDialogOpen(false);
  }

  return (
    <div onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)} >
        {/* Command dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <CommandDialog command={selectedCommand!} onInsert={(c) => insertCommand(c)} />
        </Dialog>

        {/* Label */}
        {label != null && label.length > 0 ? 
            <Label className="mb-2">{label}</Label>
            : 
            null
        }
        
        {/* Textarea */}
        {isMultiline ?
            <Textarea onSelectCapture={(v) => setSelectionRange([v.currentTarget.selectionStart, v.currentTarget.selectionEnd])} id="textfield" placeholder={placeholder} value={text} onChange={(v) => textChanged(v.target.value)} />
            :
            <Input onSelectCapture={(v) => setSelectionRange([v.currentTarget.selectionStart!, v.currentTarget.selectionEnd!])} placeholder={placeholder} value={text} onChange={(v) => textChanged(v.target.value)} />
        }

        {/* Command bar */}
        {isFocused ?
            <Menubar className="bg-[#00000000]">
                <MenubarMenu>
                    <MenubarTrigger>
                        Add command
                    </MenubarTrigger>
                    <MenubarContent>
                        {commands.map((command, i) => (
                            <MenubarItem key={command.name} className="cursor-pointer" onClick={() => {
                                // Clone the command and fill the last parameter with the selected text.
                                const commandClone = command.clone();
                                commandClone.parameters[commandClone.parameters.length - 1].value = text.substring(selectionRange[0], selectionRange[1]);

                                setSelectedCommand(commandClone);
                                setIsDialogOpen(true);
                            }}>
                                {command.name}
                            </MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            :
            null
        }

    </div>
  );
});
  