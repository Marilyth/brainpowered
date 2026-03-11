import { observer } from "mobx-react-lite";
import { FiTrash2 } from 'react-icons/fi';
import { Input } from "@/components/ui/input";
import { TextEditor } from "../TextEditor";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Property, PropertyType } from "../../models/base/Property";

interface AttributeSettingProps {
  property: Property;
  onDelete: () => void;
}

export const PropertySetting: React.FC<AttributeSettingProps> = observer(({ property, onDelete }) => {
    let inputComponent = null;
    const typeSelectComponent = (
        <Select value={property.propertyType} onValueChange={(v) => property.propertyType = v as PropertyType}>
            <SelectTrigger>
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.keys(PropertyType).map((key) => {
                        const value = (PropertyType as any)[key];
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

    if (property.propertyType == PropertyType.Text) {
        inputComponent = (
            <TextEditor isMultiline={false} text={property.value} onChange={(v) => property.value = v} />
        );
    }

    else if (property.propertyType == PropertyType.Number) {
        inputComponent = (
            <Input type="number" value={property.value} onChange={(v) => property.value = v.currentTarget.valueAsNumber} />
        );
    }

    else if (property.propertyType == PropertyType.Boolean) {
        inputComponent = (
            <Select value={property.value.toString()} onValueChange={(v) => property.value = v === "true"}>
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
            <Button variant="ghost" onClick={onDelete}>
                <FiTrash2 color="salmon" />
            </Button>
        </div>
        {typeSelectComponent}
        {inputComponent}
    </div>
    
  );
});
  