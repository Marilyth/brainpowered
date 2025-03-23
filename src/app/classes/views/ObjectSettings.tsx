"use client";

import { WorldNode } from "@/app/classes/models/world/base/WorldNode";
import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorldNodeViewModel from "../viewmodels/WorldNodeViewModel";

interface ObjectSettingsProps {
  viewModel: WorldNodeViewModel;
}

export const ObjectSettings: React.FC<ObjectSettingsProps> = observer(({ viewModel }) => {
    return (
        <Tabs defaultValue="details" className="h-full">
            <TabsList className="w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="sounds">Sounds</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        <Label>Name</Label>
                        <Input placeholder="Table" value={viewModel.name} onChange={(v) => viewModel.name = v.target.value} />
                        <Label>Description</Label>
                        <Input placeholder="You see a wooden table. It's surface showing the marks of time." value={viewModel.description} onChange={(v) => viewModel.description = v.target.value} />
                        <Label>Context</Label>
                        <Input placeholder="A wooden table can be seen in the corner of the room." value={viewModel.context} onChange={(v) => viewModel.context = v.target.value} />
                        <Label>Dimensions (m)</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" min={0} placeholder="Width" value={viewModel.dimensions.width} onChange={(v) => viewModel.dimensions.width = v.target.valueAsNumber} />
                            <Input type="number" min={0} placeholder="Depth" value={viewModel.dimensions.depth} onChange={(v) => viewModel.dimensions.depth = v.target.valueAsNumber} />
                            <Input type="number" min={0} placeholder="Height" value={viewModel.dimensions.height} onChange={(v) => viewModel.dimensions.height = v.target.valueAsNumber} />
                        </div>
                        <Label>Location</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" placeholder="X" value={viewModel.coordinates.x} onChange={(v) => viewModel.coordinates.x = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Y" value={viewModel.coordinates.y} onChange={(v) => viewModel.coordinates.y = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Z" value={viewModel.coordinates.z} onChange={(v) => viewModel.coordinates.z = v.target.valueAsNumber} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
});
  