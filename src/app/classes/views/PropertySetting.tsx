import { observer } from "mobx-react-lite";
import { Command } from "../utility/Command";
import { Label } from "@/components/ui/label";
import { FiTrash2 } from 'react-icons/fi';
import { Input } from "@/components/ui/input";
import { TextEditor } from "./TextEditor";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { PropertyViewModel, TextType } from "../viewmodels/PropertyViewModel";
import { Button } from "@/components/ui/button";

interface AttributeSettingProps {
  property: PropertyViewModel;
  onDelete: (property: PropertyViewModel) => void;
}

export const PropertySetting: React.FC<AttributeSettingProps> = observer(({ property, onDelete }) => {
    let inputComponent = null;
    const typeSelectComponent = (
        <Select value={property.textType} onValueChange={(v) => property.textType = v as TextType}>
            <SelectTrigger>
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.keys(TextType).map((key) => {
                        const value = (TextType as any)[key];
                        return (
                            <SelectItem key={value} value={value}>
                                {key}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );

    if (property.textType == TextType.Text) {
        inputComponent = (
            <TextEditor isMultiline={false} text={property.value} onChange={(v) => property.value = v} />
        );
    }

    else if (property.textType == TextType.Number) {
        inputComponent = (
            <Input type="number" value={property.value} onChange={(v) => property.value = v.currentTarget.valueAsNumber} />
        );
    }

    else if (property.textType == TextType.Boolean) {
        inputComponent = (
            <Select value={property.value} onValueChange={(v) => property.value = v === "true"}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    }

  return (
    <div className="space-y-4 hover:bg-muted transition-colors rounded p-2">
        <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
            <Input value={property.name} onChange={(v) => property.name = v.target.value} />
            <Button variant="ghost" onClick={() => onDelete(property)}>
                <FiTrash2 color="salmon" />
            </Button>
        </div>
        {typeSelectComponent}
        {inputComponent}
    </div>
    
  );
});
  