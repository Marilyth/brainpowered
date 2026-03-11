"use client";

import { observer } from "mobx-react-lite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "./GeneralSettings";
import { PropertySettings } from "./PropertySettings";
import { InteractionSettings } from "./InteractionSettings";
import { ReactionSettings } from "./ReactionSettings";
import { WorldNode } from "@/classes/models/WorldNode";

interface ObjectSettingsProps {
  model: WorldNode;
}

export const ObjectSettings: React.FC<ObjectSettingsProps> = observer((props: ObjectSettingsProps) => {
    return (
        <Tabs defaultValue="general" className="overflow-hidden px-2">
            <TabsList className="w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="overflow-auto">
                <GeneralSettings model={props.model} />
            </TabsContent>

            <TabsContent value="properties" className="overflow-auto">
                <PropertySettings model={props.model} />
            </TabsContent>

            <TabsContent value="interactions" className="overflow-auto">
                <InteractionSettings model={props.model} />
            </TabsContent>

            <TabsContent value="reactions" className="overflow-auto">
                <ReactionSettings model={props.model} />
            </TabsContent>
        </Tabs>
    );
});
  