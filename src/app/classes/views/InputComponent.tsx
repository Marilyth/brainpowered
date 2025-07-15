import { observer } from "mobx-react-lite";
import { CommandParameterType } from "../utility/CommandParameter";
import { Input } from "@/components/ui/input";
import { BlockPicker } from "react-color";
import Editor from '@monaco-editor/react';
import { nodes } from "../models/world/NodeCollection";
import { MonacoLibrary } from "../utility/MonacoLibrary";

function addMonacoContext(monaco: any) {
    var context = new MonacoLibrary();
    context.includeVariable(nodes, "global");
    console.log(context);

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
        context.code,
        context.fileName
    );
}

const mutedColors = [
    '#FBFAE6', // cream
    '#F9F5EC', // off white
    '#D7E8B9', // lavender
    '#BADCBD', // light green
    '#96D294', // green
    '#85C1BB', // turquoise
    '#6B9797', // teal
    '#85B0C1', // sky blue
    '#83A1CD', // blue
    '#4B456B', // navy blue
    '#3E436F', // dark blue
    '#4C367E', // indigo
    '#9673A5', // purple
    '#D57ED5', // magenta
    '#EBD1F3', // violet
    '#E4ADC4', // pink
    '#B86273', // rose
    '#CB4C4E', // red
    '#EB9C5C', // orange
    '#EFA282', // coral
    '#DBB18F', // fawn
    '#D2B450', // gold
    '#E0D268', // yellow
    '#D1C87C', // lime
    '#CEA175', // bronze
    '#997864', // brown
    '#A9A9A9', // gray
    '#CBCBCB', // silver
];

interface InputComponentProps {
    type: CommandParameterType;
    value: string;
    onChange: (value: string) => void;
}
  
/**
 * Determines the best input component for a command parameter based on its type.
 * @param parameter The command parameter to get the input component for.
 * @returns A React component that renders the input for the command parameter.
 */
export const InputComponent: React.FC<InputComponentProps> = observer((props) => {
    switch (props.type) {
        case CommandParameterType.Text:
            return <Input value={props.value} onChange={(e) => props.onChange(e.target.value)} />;

        case CommandParameterType.Number:
            return <Input type="number" value={props.value} onChange={(e) => props.onChange(e.target.value)} />;

        case CommandParameterType.Boolean:
            return <Input type="checkbox" value={props.value} onChange={(e) => props.onChange(e.target.value)} />;

        case CommandParameterType.Color:
            return <BlockPicker
                        color={props.value}
                        onChangeComplete={(color) => props.onChange(color.hex)}
                        colors={mutedColors}
                        triangle="hide"
                        className="!w-full !bg-[#222222]"
                    />;

        case CommandParameterType.Code:
            return <Editor
                        beforeMount={addMonacoContext}
                        language="typescript"
                        theme="vs-dark"
                        value={props.value}
                        height={"200px"}
                        defaultValue="global."
                        options={{
                            automaticLayout: true,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            placeholder: "global.",
                        }}
                        onChange={(value) => props.onChange(value || "")}
                    />;
        default:
            return <Input value={props.value} onChange={(e) => props.onChange(e.target.value)} />;
    }
});