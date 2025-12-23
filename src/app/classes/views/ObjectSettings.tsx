"use client";

import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextEditor } from "./TextEditor";
import SelectableWorldNode from "../viewmodels/SelectableWorldNode";
import { Button } from "@/components/ui/button";
import { PropertySetting } from "./PropertySetting";
import { Separator } from "@/components/ui/separator";
import { StoryEventSetting } from "./EventSetting";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { ActionSetting } from "./ActionSetting";

interface ObjectSettingsProps {
  viewModel: SelectableWorldNode;
}

export const ObjectSettings: React.FC<ObjectSettingsProps> = observer(({ viewModel }) => {
    return (
        <Tabs defaultValue="properties" className="h-full">
            <TabsList className="w-full">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="overflow-auto space-y-4">
                <Card>
                    <CardContent className="space-y-4">
                        <Label>Id</Label>
                        <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
                            <Input disabled value={viewModel.node.id} />
                            <Button variant="ghost" onClick={() => viewModel.parent?.removeChildObject(viewModel)}>
                                <FiTrash2 color="salmon" />
                            </Button>
                        </div>
                        <Label>Name</Label>
                        <Input value={viewModel.node.name} onChange={(v) => viewModel.node.name = v.target.value} />
                        <TextEditor label="Description" text={viewModel.node.description} onChange={(s) => viewModel.node.description = s} placeholder="You can see an old wooden table, brittle from being exposed to water." />
                        <TextEditor label="Context" text={viewModel.node.context} onChange={(s) => viewModel.node.context = s} placeholder="A wooden table can be seen in the corner of the room." />
                        <Label>Dimensions (m)</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" min={0} placeholder="Width" value={viewModel.node.dimensions.width} onChange={(v) => viewModel.node.dimensions.width = v.target.valueAsNumber} />
                            <Input type="number" min={0} placeholder="Depth" value={viewModel.node.dimensions.depth} onChange={(v) => viewModel.node.dimensions.depth = v.target.valueAsNumber} />
                            <Input type="number" min={0} placeholder="Height" value={viewModel.node.dimensions.height} onChange={(v) => viewModel.node.dimensions.height = v.target.valueAsNumber} />
                        </div>
                        <Label>Location</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Input type="number" placeholder="X" value={viewModel.node.coordinates.x} onChange={(v) => viewModel.node.coordinates.x = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Y" value={viewModel.node.coordinates.y} onChange={(v) => viewModel.node.coordinates.y = v.target.valueAsNumber} />
                            <Input type="number" placeholder="Z" value={viewModel.node.coordinates.z} onChange={(v) => viewModel.node.coordinates.z = v.target.valueAsNumber} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="space-y-4">
                        {/* {viewModel.node.properties.map((property, index) => (
                            <div key={index}>
                                <PropertySetting key={index} property={property} onDelete={(a) => viewModel.node.removeProperty(a)}/>
                                <Separator className="my-4" />
                            </div>
                        ))} */}

                        <Button variant="outline" onClick={() => viewModel.node.addProperty()}><FiPlus /> Add property</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="actions" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        {/* {viewModel.node.actions.map((action, index) => (
                            <div key={index}>
                                <ActionSetting key={index} action={action} onDelete={(a) => viewModel.node.removeAction(a)}/>
                                <Separator className="my-4" />
                            </div>
                        ))} */}

                        <Button variant="outline" onClick={() => viewModel.node.addAction()}><FiPlus /> Add interaction</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="events" className="overflow-auto">
                <Card>
                    <CardContent className="space-y-4">
                        {/* {viewModel.node.reactions.map((event, index) => (
                            <div key={index}>
                                <StoryEventSetting key={index} storyEvent={event} onDelete={(e) => viewModel.node.removeStoryEvent(e)} />
                                <Separator className="my-4" />
                            </div>
                        ))} */}

                        <Button variant="outline" onClick={() => viewModel.node.addStoryEvent()}><FiPlus /> Add reaction</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
});
  