export default class Tool {
  canvas = null;
  ctx = null;
  constructor(canvas, socket, sessionId) {
    this.canvas = canvas;
    this.socket = socket;
    this.sessionId = sessionId;
    this.ctx = canvas.getContext("2d");
    this.ctx.globalCompositeOperation = "source-over";
    this.#clearEvents();
  }

  #clearEvents() {
    this.canvas.onmouseup = null;
    this.canvas.onmousedown = null;
    this.canvas.onmouseover = null;
  }

  set fillColor(color) {
    this.ctx.fillStyle = color;
  }

  set strokeColor(color) {
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width) {
    this.ctx.lineWidth = width;
  }
}
