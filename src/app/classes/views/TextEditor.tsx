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
import { Dialog } from "@/components/ui/dialog";
  

interface TextEditorProps {
  text: string;
  placeholder?: string;
  label?: string;
  isMultiline?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = observer(({ text, placeholder, label, isMultiline = true }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  return (
    <div onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)} >
        {/* Command dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <CommandDialog command={commands[selectedCommandIndex]} />
        </Dialog>

        {/* Label */}
        {label != null && label.length > 0 ? 
            <Label>{label}</Label>
            : 
            null
        }
        
        {/* Textarea */}
        {isMultiline ?
            <Textarea  placeholder={placeholder} value={text} onChange={(v) => text = v.target.value} />
            :
            <Input placeholder={placeholder} value={text} onChange={(v) => text = v.target.value} />
        }

        {/* Command bar */}
        {isFocused ?
            <Menubar className="bg-[#33333311]">
                <MenubarMenu>
                    <MenubarTrigger>
                        Commands
                    </MenubarTrigger>
                    <MenubarContent>
                        {commands.map((command, i) => (
                            <MenubarItem key={command.name} className="cursor-pointer" onClick={() => {
                                setSelectedCommandIndex(i);
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
  