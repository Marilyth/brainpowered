import Action from "../src/app/classes/Action";

describe("Action", () => {
    test("action callback works", () => {
        let testString: string = "";
        const action = new Action("test", () => testString = "test");
        action.callback();

        expect(testString).toBe("test");
    });
});
