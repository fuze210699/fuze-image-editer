import React, { useEffect, useState } from "react";
import { Stage, Layer} from "react-konva";
import { KonvaArrow, KonvaText, KonvaImage } from "./components";

const KonvaStage = ({ activeTool, files, isExport, setUrl }) => {
  const [mode, setMode] = useState("");
  const [textNode, setTextNode] = useState([]);
  const [arrowNode, setArrowNode] = useState([]);
  const [selectedId, selectShape] = React.useState(null);
  const [currentArrowOnDraw, setCurrentArrowOnDraw] = React.useState(null);

  const stageRef = React.useRef(null);
  const layerRef = React.useRef(null);

  useEffect(() => {
    setMode(activeTool);
  }, [activeTool]);

  useEffect(() => {
    if (isExport) {
      const uri = stageRef.current.toDataURL();
      setUrl(uri);
    }

  }, [isExport, setUrl]);

  const handleAddElementToKonvaByMode = () => {
    var { x, y } = stageRef.current.getRelativePointerPosition();
    if (selectedId) {
      selectShape(null);
      return;
    }
    if (mode === "text") {
      const option = {
        id: `text${Date.now()}`,
        fill: "red",
        draggable: true,
        text: "Default",
        x,
        y,
        fontSize: 30,
        fontStyle: "bold",
      };
      setTextNode((textNode) => [...textNode, option]);
      selectShape(option.id);
    }
  };

  const handleDrawOnMouseDown = () => {
    if (mode === "arrow") {
      const pos = stageRef.current.getPointerPosition();
      const option = {
        id: `arrow${Date.now()}`,
        points: [pos.x, pos.y],
        stroke: '#f92f6c',
        fill: '#f92f6c',
        pointerWidth: 10,
        strokeWidth: 5,
        tension: 10,
        lineCap: 'round',
        lineJoin: 'miter',
        shadowColor: '#000',
        pointerLength: 10,
        // pointerAtBeginning: true
      };
      setCurrentArrowOnDraw(option);
      setArrowNode((arrowNode) => [...arrowNode, option]);
    }
  }

  const handleDrawOnMouseMove = () => {
    if (mode === "arrow" && currentArrowOnDraw) {
      const pos = stageRef.current.getPointerPosition();
      const arrow = arrowNode[arrowNode.length - 1];
      if (currentArrowOnDraw) {
        const newPoints = [arrow.points[0], arrow.points[1], pos.x, pos.y];
        console.log(newPoints);
        setArrowNode(arrowNode => [...arrowNode.map(node => {
          if (node.id === arrow.id) {
            return { ...node, points: newPoints }
          }
          return node
        })]);
      }
    }
  }

  const handleDrawOnMouseUp = () => {
    setCurrentArrowOnDraw(null);
  }

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth - 150}
      height={window.innerHeight - 150}
      className={`konva-wrap-1 cursor-${activeTool}`}
      onTap={handleAddElementToKonvaByMode}
      onClick={handleAddElementToKonvaByMode}
      onMouseDown={handleDrawOnMouseDown}
      onMouseMove={handleDrawOnMouseMove}
      onMouseUp={handleDrawOnMouseUp}
    >
      <Layer ref={layerRef}>
        {files.map((file, index) =><KonvaImage url = { file } draggable = { mode === ''} key={index}/>)}
        {textNode.map((option, index) => (
          <KonvaText
            key={index}
            shapeProps={option}
            isSelected={option.id === selectedId}
            onSelect={() => {
              selectShape(option.id);
            }}
            onChange={(newAttrs) => {
              const text = textNode.slice();
              option[index] = newAttrs;
              setTextNode(text);
            }}
          />
        ))}
        {arrowNode.map((option, index) => (
          <KonvaArrow
            key={index}
            shapeProps={option}
            isSelected={option.id === selectedId}
            onSelect={() => {
              selectShape(option.id);
            }}
            onChange={(newAttrs) => {
              const arrow = arrowNode.slice();
              option[index] = newAttrs;
              setArrowNode(arrow);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default KonvaStage;
