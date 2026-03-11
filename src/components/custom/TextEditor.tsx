import { observer } from "mobx-react-lite";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { commands } from "../../classes/utility/Commands";
import { CommandDialog } from "./CommandDialog";
import { Command } from "../../classes/utility/Command";
import { Dialog } from "@/components/ui/dialog";

type TextEditorProps = {
  text: string;
  placeholder?: string;
  label?: string;
  isMultiline?: boolean;
  onChange?: (text: string) => void;
};

export const TextEditor = observer(
  ({ text, placeholder, label, isMultiline = true, onChange }: TextEditorProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState<Command>(commands[0]);
    const [selectionRange, setSelectionRange] = useState<[number, number]>([0, 0]);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    function textChanged(nextText: string) {
      onChange?.(nextText);
    }

    function insertCommand(command: Command) {
      const textBefore = text.substring(0, selectionRange[0]);
      const textAfter = text.substring(selectionRange[1]);
      textChanged(textBefore + command.toString() + textAfter);
      setIsDialogOpen(false);
    }

    function openCommand(command: Command) {
      const commandClone = command.clone();
      commandClone.parameters[commandClone.parameters.length - 1].value = text.substring(
        selectionRange[0],
        selectionRange[1]
      );

      setSelectedCommand(commandClone);
      setIsDialogOpen(true);
      setContextMenu(null);
      setMenuPosition(null);
    }

    function handleSelect(
      e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
      const start = e.currentTarget.selectionStart ?? 0;
      const end = e.currentTarget.selectionEnd ?? 0;
      setSelectionRange([start, end]);
    }

    function handleContextMenu(
      e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
      e.preventDefault();

      const start = e.currentTarget.selectionStart ?? 0;
      const end = e.currentTarget.selectionEnd ?? 0;
      setSelectionRange([start, end]);

      setContextMenu({ x: e.clientX, y: e.clientY });
      setMenuPosition({ x: e.clientX, y: e.clientY });
    }

    useLayoutEffect(() => {
      if (!contextMenu || !menuRef.current) return;

      const padding = 8;
      const rect = menuRef.current.getBoundingClientRect();

      let x = contextMenu.x;
      let y = contextMenu.y;

      if (x + rect.width > window.innerWidth - padding) {
        x = window.innerWidth - rect.width - padding;
      }

      if (y + rect.height > window.innerHeight - padding) {
        y = window.innerHeight - rect.height - padding;
      }

      if (x < padding) x = padding;
      if (y < padding) y = padding;

      if (x !== menuPosition?.x || y !== menuPosition?.y) {
        setMenuPosition({ x, y });
      }
    }, [contextMenu, menuPosition]);

    useEffect(() => {
      if (!contextMenu) return;

      const close = () => {
        setContextMenu(null);
        setMenuPosition(null);
      };

      window.addEventListener("click", close);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("click", close);
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [contextMenu]);

    return (
      <div className="relative">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <CommandDialog
            inputValues={[]}
            command={selectedCommand}
            onInsert={(c) => insertCommand(c)}
          />
        </Dialog>

        {label ? <Label className="mb-2">{label}</Label> : null}

        {isMultiline ? (
          <Textarea
            id="textfield"
            placeholder={placeholder}
            value={text}
            onChange={(e) => textChanged(e.target.value)}
            onSelectCapture={handleSelect}
            onContextMenu={handleContextMenu}
          />
        ) : (
          <Input
            placeholder={placeholder}
            value={text}
            onChange={(e) => textChanged(e.target.value)}
            onSelectCapture={handleSelect}
            onContextMenu={handleContextMenu}
          />
        )}

        {contextMenu && menuPosition ? (
          <div
            ref={menuRef}
            className="fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            style={{ left: menuPosition.x, top: menuPosition.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {commands.map((command) => (
              <button
                key={command.name}
                type="button"
                className="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => openCommand(command)}
              >
                {command.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);