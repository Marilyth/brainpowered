import Action from "../src/app/classes/Action";
import { parseUserInput } from "../src/app/classes/ActionParser";

describe("parseUserInput", () => {
    const testActions = [
        new Action("eat|consume|taste bun|bread|dough", () => {}),
        new Action("drink|sip water|h2o|liquid", () => {}),
        new Action("run|sprint|jog bathroom|toilet", () => {}),
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
