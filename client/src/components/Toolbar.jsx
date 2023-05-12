import React, { useState } from "react";
import "../styles/toolbar.scss";
import Brush from "../tools/brush";
import toolState from "../store/tool-state";
import canvasState from "../store/canvas-state";
import Rect from "../tools/rect";
import Circle from "../tools/circle";
import Eraser from "../tools/eraser";
import Line from "../tools/line";
import { observer } from "mobx-react-lite";

const Toolbar = observer(() => {
  const setTool = (Tool) => {
    toolState.setTool(
      new Tool(canvasState.canvas, canvasState.socket, canvasState.sessionId)
    );
  };

  const handleColorPicker = (e) => {
    toolState.setFillColor(e.target.value);
    toolState.setStrokeColor(e.target.value);
  };

  const handleUndo = () => {
    canvasState.undo();
  };

  const handleRedo = () => {
    canvasState.redo();
  };

  const download = () => {
    const dataURL = canvasState.canvas.toDataURL();
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = canvasState.sessionId + ".jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="toolbar">
      <div className="toolbar__center center">
        <div className="toolbar__btns">
          <button
            className="toolbar__btn brush"
            onClick={() => setTool(Brush)}
          ></button>
          <button
            className="toolbar__btn rect"
            onClick={() => setTool(Rect)}
          ></button>
          <button
            className="toolbar__btn circle"
            onClick={() => setTool(Circle)}
          ></button>
          <button
            className="toolbar__btn eraser"
            onClick={() => setTool(Eraser)}
          ></button>
          <button
            className="toolbar__btn line"
            onClick={() => setTool(Line)}
          ></button>
          <input
            type="color"
            name="color-picker"
            id="color-picker"
            value={toolState.color}
            onChange={handleColorPicker}
          />
        </div>
        <div className="toolbar__btns">
          <button className="toolbar__btn undo" onClick={handleUndo}></button>
          <button className="toolbar__btn redo" onClick={handleRedo}></button>
          <button className="toolbar__btn save" onClick={download}></button>
        </div>
      </div>
    </div>
  );
});

export default Toolbar;
