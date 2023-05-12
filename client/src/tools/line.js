import Tool from "./tool";

export default class Line extends Tool {
  constructor(canvas) {
    super(canvas);
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
  }

  mouseDownHandler(e) {
    this.mouseDown = true;

    const [x, y] = this.#getCoords(e);
    this.startX = x;
    this.startY = y;
    this.ctx.beginPath(); // started drawing
    this.ctx.moveTo(...this.#getCoords(e)); // set cursor coords

    this.saved = this.canvas.toDataURL(); // save current canvas image
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(...this.#getCoords(e));
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };
  }

  #getCoords(e) {
    const { offsetLeft: canvasLeft, offsetTop: canvasTop } = e.target;
    const { pageX: cursorX, pageY: cursorY } = e;

    const x = cursorX - canvasLeft;
    const y = cursorY - canvasTop;

    return [x, y];
  }
}
