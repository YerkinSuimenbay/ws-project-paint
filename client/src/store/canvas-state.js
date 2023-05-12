import { makeAutoObservable } from "mobx";

class CanvasState {
  canvas = null;
  undoList = [];
  redoList = [];
  username = "";
  socket = null;
  sessionId = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setUsername(username) {
    this.username = username;
  }
  setSocket(socket) {
    this.socket = socket;
  }
  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  pushToRedo(data) {
    this.redoList.push(data);
  }

  undo() {
    const ctx = this.canvas.getContext("2d");

    if (!this.undoList.length) {
      console.log("eees");
      // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    const dataURL = this.undoList.pop();
    this.redoList.push(this.canvas.toDataURL());
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  redo() {
    if (!this.redoList.length) {
      console.log("redoList = []");
      return;
    }
    console.log("redoList != []");

    const ctx = this.canvas.getContext("2d");
    const dataURL = this.redoList.pop();
    this.undoList.push(this.canvas.toDataURL());
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      console.log({ img });
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }
}

const canvasState = new CanvasState();
export default canvasState;
