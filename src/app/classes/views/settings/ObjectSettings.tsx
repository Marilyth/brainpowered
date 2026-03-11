"use client";

import { observer } from "mobx-react-lite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SelectableWorldNode from "../../viewmodels/SelectableWorldNode";
import { GeneralSettings } from "./GeneralSettings";
import { PropertySettings } from "./PropertySettings";
import { InteractionSettings } from "./InteractionSettings";
import { ReactionSettings } from "./ReactionSettings";

interface ObjectSettingsProps {
  viewModel: SelectableWorldNode;
}

export const ObjectSettings: React.FC<ObjectSettingsProps> = observer(({ viewModel }) => {
    return (
        <Tabs defaultValue="general" className="overflow-hidden px-2">
            <TabsList className="w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="overflow-auto">
                <GeneralSettings model={viewModel.node} />
            </TabsContent>

            <TabsContent value="properties" className="overflow-auto">
                <PropertySettings model={viewModel.node} />
            </TabsContent>

            <TabsContent value="interactions" className="overflow-auto">
                <InteractionSettings model={viewModel.node} />
            </TabsContent>

            <TabsContent value="reactions" className="overflow-auto">
                <ReactionSettings model={viewModel.node} />
            </TabsContent>
        </Tabs>
    );
});
  