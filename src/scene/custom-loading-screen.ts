import { ILoadingScreen } from "@babylonjs/core";

class CustomLoadingScreen implements ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor!: string;

  protected loadingScreenDiv = window.document.getElementById("loadingScreen");

  constructor(public loadingUIText: string) {

  }

  public displayLoadingUI() {
    // TODO
  }

  public hideLoadingUI() {
    if (this.loadingScreenDiv) {
      this.loadingScreenDiv.style.display = 'none'
    }
  }
}

export default CustomLoadingScreen;