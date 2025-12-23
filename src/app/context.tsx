// store/AppStore.ts
import { makeAutoObservable } from "mobx";
import { Story } from "./classes/models/Story";
import TypeWriterViewModel from "./classes/viewmodels/TypeWriterViewModel";

export class AppContext {
  public currentStory: Story;
  public currentTypeWriter: TypeWriterViewModel;

  constructor() {
    makeAutoObservable(this);
  }

  public setCurrentStory(story: Story) {
    this.currentStory = story;
    this.currentTypeWriter = new TypeWriterViewModel({
          opacityAnimationDuration: 0.3, typeSpeed: 50, pitch: 0, volumes: [],
          characterStyle: { fontSize: "16px", color: "#FFFFFF" },
          characterInitial: { },
          characterAnimate: { },
          characterTransition: { } });

    this.currentTypeWriter.startParsingAsync("Enter [color;orange;start] to start the story.");
  }
}

export const appContext = new AppContext();
