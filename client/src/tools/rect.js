import Tool from "./tool";

export default class Rect extends Tool {
  name = "Rect";
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

    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.sessionId,
        tool: this.name,
        figure: {
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
          fillColor: this.ctx.fillStyle,
          strokeColor: this.ctx.strokeStyle,
          lineWidth: this.ctx.lineWidth,
        },
      })
    );
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath(); // started drawing

    const [x, y] = this.#getCoords(e);
    this.startX = x;
    this.startY = y;
    this.saved = this.canvas.toDataURL(); // save current canvas image
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const [currentX, currentY] = this.#getCoords(e);

      this.width = currentX - this.startX;
      this.height = currentY - this.startY;

      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x, y, w, h) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // очищаем весь канвас
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // нарисуем прежнее изображение(возвращаем старые рисунки)
      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.fill(); // заполнение цветом / fills in the rect
      this.ctx.stroke(); // обводка / border of the rect
    };
  }

  static staticDraw(ctx, figure = {}) {
    const { x, y, width, height, fillColor, strokeColor, lineWidth } = figure;
    // const currentStyle = {
    //   fillColor: ctx.fillStyle,
    //   strokeColor: ctx.strokeStyle,
    //   lineWidth: ctx.lineWidth,
    // };

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.fill(); // заполнение цветом / fills in the rect
    ctx.stroke(); // обводка / border of the rect

    // ctx.fillStyle = currentStyle.fillColor;
    // ctx.strokeStyle = currentStyle.strokeColor;
    // ctx.lineWidth = currentStyle.lineWidth;
  }

  #getCoords(e) {
    const { offsetLeft: canvasLeft, offsetTop: canvasTop } = e.target;
    const { pageX: cursorX, pageY: cursorY } = e;

    const x = cursorX - canvasLeft;
    const y = cursorY - canvasTop;

    return [x, y];
  }
}
