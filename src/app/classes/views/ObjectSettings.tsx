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
import { TextEditor } from "./TextEditor";
import WorldNodeViewModel from "../viewmodels/WorldNodeViewModel";
import { Button } from "@/components/ui/button";
import { AttributeSetting } from "./AttributeSetting";
import { Separator } from "@/components/ui/separator";
import { StoryEventSetting } from "./EventSetting";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { ActionSetting } from "./ActionSetting";

interface ObjectSettingsProps {
  viewModel: WorldNodeViewModel;
}

export const ObjectSettings: React.FC<ObjectSettingsProps> = observer(({ viewModel }) => {
    return (
        <Tabs defaultValue="details" className="h-full">
            <TabsList className="w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        <Label>Name</Label>
                        <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
                            <Input value={viewModel.name} onChange={(v) => viewModel.name = v.target.value} />
                            <Button variant="ghost" onClick={() => viewModel.parent?.removeChildObject(viewModel)}>
                                <FiTrash2 color="salmon" />
                            </Button>
                        </div>
                        <TextEditor label="Description" text={viewModel.description} onChange={(s) => viewModel.description = s} placeholder="You can see an old wooden table, brittle from being exposed to water." />
                        <TextEditor label="Context" text={viewModel.context} onChange={(s) => viewModel.context = s} placeholder="A wooden table can be seen in the corner of the room." />
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

            <TabsContent value="actions" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        {viewModel.actions.map((action, index) => (
                            <div key={index}>
                                <ActionSetting key={index} action={action} onDelete={(a) => viewModel.removeAction(a)}/>
                                <Separator className="my-4" />
                            </div>
                        ))}

                        <Button variant="outline" onClick={() => viewModel.addAction()}><FiPlus /> Add interaction</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="attributes" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        {viewModel.attributes.map((attribute, index) => (
                            <div key={index}>
                                <AttributeSetting key={index} attribute={attribute} onDelete={(a) => viewModel.removeAttribute(a)}/>
                                <Separator className="my-4" />
                            </div>
                        ))}

                        <Button variant="outline" onClick={() => viewModel.addAttribute()}><FiPlus /> Add attribute</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="events" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        {viewModel.events.map((event, index) => (
                            <div key={index}>
                                <StoryEventSetting key={index} storyEvent={event} onDelete={(e) => viewModel.removeStoryEvent(e)} />
                                <Separator className="my-4" />
                            </div>
                        ))}

                        <Button variant="outline" onClick={() => viewModel.addStoryEvent()}><FiPlus /> Add event handler</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
});
  