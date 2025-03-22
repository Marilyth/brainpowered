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
                        <Input placeholder="Table..." value={viewModel.model.name} onChange={(v) => viewModel.model.name = v.target.value} />
                        <Label>Description</Label>
                        <Input placeholder="A wooden table..." value={viewModel.model.description} onChange={(v) => viewModel.model.description = v.target.value} />
                        <Label>Dimensions (m)</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" placeholder="Width" value={viewModel.model.dimensions.width} onChange={(v) => viewModel.model.dimensions.width = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Depth" value={viewModel.model.dimensions.depth} onChange={(v) => viewModel.model.dimensions.depth = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Height" value={viewModel.model.dimensions.height} onChange={(v) => viewModel.model.dimensions.height = v.target.valueAsNumber} />
                        </div>
                        <Label>Location</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" placeholder="X" value={viewModel.model.coordinates.x} onChange={(v) => viewModel.model.coordinates.x = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Y" value={viewModel.model.coordinates.y} onChange={(v) => viewModel.model.coordinates.y = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Z" value={viewModel.model.coordinates.z} onChange={(v) => viewModel.model.coordinates.z = v.target.valueAsNumber} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
});
  