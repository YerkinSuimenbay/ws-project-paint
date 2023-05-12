import Tool from "./tool";

export default class Circle extends Tool {
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
    this.ctx.beginPath(); // started drawing

    const [x, y] = this.#getCoords(e);
    this.startX = x;
    this.startY = y;
    this.saved = this.canvas.toDataURL(); // save current canvas image
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const [currentX, currentY] = this.#getCoords(e);

      const width = currentX - this.startX;
      const height = currentY - this.startY;
      const radius = Math.sqrt(width ** 2 + height ** 2);
      this.draw(this.startX, this.startY, radius);
    }
  }

  draw(centerX, centerY, radius = 50, startAngle = 0, endAngle = 2 * Math.PI) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // очищаем весь канвас
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // нарисуем прежнее изображение(возвращаем старые рисунки)
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      // this.ctx.fillStyle = "green";
      // this.ctx.fill(); // заполнение цветом
      // this.ctx.lineWidth = 1;
      // this.ctx.strokeStyle = "red";
      this.ctx.stroke(); // обводка / border of the rect
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
