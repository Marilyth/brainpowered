import Location from "../src/app/classes/world/base/Location";
import Action from "../src/app/classes/world/Action";
import { parseUserInput } from "../src/app/classes/world/ActionParser";
import { WorldNode } from "@/app/classes/world/base/WorldNode";

describe("parseUserInput", () => {
    const testWorldNode: WorldNode = new Location("", "", "", "");

    const testActions = [
        new Action("eat|consume|taste bun|bread|dough", testWorldNode, ""),
        new Action("drink|sip water|h2o|liquid", testWorldNode, ""),
        new Action("run|sprint|jog bathroom|toilet", testWorldNode, ""),
    ];

    test.each([
        ["I want to really, like, TASTE the dough, feel me?", 0],
        ["Mmh oh yea, sip the h2O!! like it owes me money!", 1],
        ["Yeesh I really need to pee. Time to jog to the toilettery!", 2]
    ])("input \"%s\" matching action %d", (input: string, expected: number) => {
        // Act
        const action = parseUserInput(testActions, input);

        // Assert
        expect(action).toBe(testActions[expected]);
    });

    test.each([
        ["I want to die"],
        [""],
    ])("input \"%s\" matching no action returns null", (input: string) => {
        // Act
        const action = parseUserInput(testActions, input);

        // Assert
        expect(action).toBe(null);
    });
});
