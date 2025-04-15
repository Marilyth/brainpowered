import { observer } from "mobx-react-lite";
import { Command } from "../utility/Command";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TextType } from "../models/world/base/Attribute";
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
import AttributeViewModel from "../viewmodels/AttributeViewModel";

interface AttributeSettingProps {
  attribute: AttributeViewModel;
}

export const AttributeSetting: React.FC<AttributeSettingProps> = observer(({ attribute }) => {
    let inputComponent = null;
    const typeSelectComponent = (
        <Select value={attribute.textType} onValueChange={(v) => attribute.textType = v as TextType}>
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

    if (attribute.textType == TextType.Text) {
        inputComponent = (
            <TextEditor isMultiline={false} text={attribute.value} onChange={(v) => attribute.value = v} />
        );
    }

    else if (attribute.textType == TextType.Number) {
        inputComponent = (
            <Input type="number" value={attribute.value} onChange={(v) => attribute.value = v.target.value} />
        );
    }

    else if (attribute.textType == TextType.Boolean) {
        inputComponent = (
            <Select value={attribute.value} onValueChange={(v) => attribute.value = v}>
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
        <div id="header" className="grid grid-cols-2 gap-4">
            <Input value={attribute.name} onChange={(v) => attribute.name = v.target.value} />
            {typeSelectComponent}
        </div>

        {inputComponent}
    </div>
    
  );
});
  