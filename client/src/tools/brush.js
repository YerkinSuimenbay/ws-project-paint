import Tool from "./tool";

export default class Brush extends Tool {
  name = "Brush";
  constructor(canvas, socket, sessionId) {
    super(canvas, socket, sessionId);
    this.listen();
  }

  listen() {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    // this.ctx.stroke();
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.sessionId,
        tool: "finish",
      })
    );
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath(); // started drawing
    this.ctx.moveTo(...this.#getCoords(e)); // set cursor coords
    // e.pageX - e.target.offsetLeft,
    // e.pageY - e.target.offsetTop
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      // this.draw(...this.#getCoords(e));

      const [x, y] = this.#getCoords(e);
      this.socket.send(
        JSON.stringify({
          method: "draw",
          id: this.sessionId,
          tool: this.name,
          figure: {
            x,
            y,
          },
        })
      );
    }
  }

  // draw(x, y) {
  //   this.ctx.lineTo(x, y);
  //   this.ctx.stroke();
  // }
  static draw(ctx, x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  #getCoords(e) {
    const { offsetLeft: canvasLeft, offsetTop: canvasTop } = e.target;
    const { pageX: cursorX, pageY: cursorY } = e;

    const x = cursorX - canvasLeft;
    const y = cursorY - canvasTop;

    return [x, y];
  }
}
