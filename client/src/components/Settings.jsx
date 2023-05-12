import React, { useState } from "react";
import "../styles/settings.scss";
import toolState from "../store/tool-state";
import { observer } from "mobx-react-lite";

const minLineWidth = 1;
const maxLineWidth = 50;

const Settings = () => {
  const [lineWidth, setLineWidth] = useState(minLineWidth);

  const handleLineWidthChange = (e) => {
    if (!toolState.tool) return;
    let lineWidth = Number(e.target.value);
    if (lineWidth < minLineWidth) lineWidth = minLineWidth;
    if (lineWidth > maxLineWidth) lineWidth = maxLineWidth;

    toolState.setLineWidth(lineWidth);
    setLineWidth(lineWidth);
  };
  const handleStrokeColorChange = (e) => {
    toolState.setStrokeColor(e.target.value);
  };

  return (
    <div className="settings">
      <div className="settings__center center">
        <div className="settings__item">
          <label htmlFor="line-width">Line width</label>
          <input
            type="number"
            id="line-width"
            value={lineWidth}
            min={minLineWidth}
            max={maxLineWidth}
            onChange={handleLineWidthChange}
          />
        </div>
        <div className="settings__item">
          <label htmlFor="stroke-color">Stroke color</label>
          <input
            type="color"
            id="stroke-color"
            onChange={handleStrokeColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
