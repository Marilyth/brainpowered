export default class Action {
    constructor(actionString: string, actionCallback: () => void) {
        this.actionString = actionString;
        this.callback = actionCallback;
    }

    public actionString: string;
    public callback: () => void;
}