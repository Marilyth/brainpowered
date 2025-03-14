"use client";

import { WorldNode } from "./world/base/WorldNode";
import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ObjectSettingsProps {
  viewModel: WorldNode;
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
                        <Input placeholder="Table..." value={viewModel.name} />
                        <Label>Description</Label>
                        <Input placeholder="A wooden table..." value={viewModel.description} />
                        <Label>Dimensions (m)</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" placeholder="Width" />
                            <Input type="number" placeholder="Depth" />
                            <Input type="number" placeholder="Height" />
                        </div>
                        <Label>Location</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" placeholder="X" />
                            <Input type="number" placeholder="Y" />
                            <Input type="number" placeholder="Z" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
});
  