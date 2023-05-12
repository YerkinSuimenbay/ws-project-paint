import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

import "../styles/canvas.scss";
import canvasState from "../store/canvas-state";
import toolState from "../store/tool-state";
import Brush from "../tools/brush";
import Rect from "../tools/rect";

const axiosInstance = axios.create({ baseURL: "http://localhost:5050" });

const Canvas = observer(() => {
  const canvasRef = useRef(null);
  const usernameRef = useRef(null);
  const params = useParams();
  const [show, setShow] = useState(true);

  const handleEnter = () => {
    canvasState.setUsername(usernameRef.current.value);
    setShow(false);
  };

  const registerAction = (e) => {
    canvasState.pushToUndo(canvasRef.current.toDataURL()); // push the current image of canvas before changing
  };

  const postCanvasImage = async (e) => {
    try {
      const { data } = await axiosInstance.post(`/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      });

      console.log("canvas image posted:", data);
    } catch (error) {
      console.log("Error while posting canvas image", error.message);
    }
  };

  useEffect(() => {
    if (!canvasState.username) return;

    const socket = new WebSocket("ws://localhost:5050");
    canvasState.setSocket(socket);
    canvasState.setSessionId(params.id);
    toolState.setTool(new Brush(canvasRef.current, socket, params.id));

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          method: "connect",
          id: params.id,
          username: canvasState.username,
        })
      );
    };

    socket.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      console.log(msg);

      switch (msg.method) {
        case "connect":
          console.log(`User ${msg.username} connected`);
          break;
        case "draw":
          handleDraw(msg);
          break;
        default:
          break;
      }
    };
  }, [params.id, canvasState.username]);

  const handleDraw = (msg) => {
    const { tool, figure } = msg;
    const ctx = canvasRef.current.getContext("2d");

    switch (tool) {
      case Brush.name:
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case Rect.name:
        // Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height);
        Rect.staticDraw(ctx, figure);
        break;
      case "finish":
        ctx.beginPath(); // начинаем новый путь рисования
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    usernameRef.current.focus();
    canvasState.setCanvas(canvasRef.current);

    const ctx = canvasRef.current.getContext("2d");
    axiosInstance
      .get(`/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response.data);
        }
        console.log(error);
      });
  }, [params.id]);

  return (
    <div className="canvas">
      <Modal show={show} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            style={{ width: "100%", padding: 5 }}
            ref={usernameRef}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEnter}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={registerAction}
        onMouseUp={postCanvasImage}
      ></canvas>
    </div>
  );
});

export default Canvas;
