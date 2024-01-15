import React, { useEffect, useState } from "react";
import { Stage, Layer, Image, Text, Arrow, Transformer } from "react-konva";
import useImage from 'use-image';

const ImageKonva = ({url}) => {
  const [image] = useImage(url);
  return <Image image={image} draggable />
}

const KonvaStage = ({activeTool, files}) => {
  const [mode, setMode] = useState('');
  const [isSelected, setIsSelected] = useState(null);
  const [textNode, setTextNode] = useState([])
  const [arrowNode, setArrowNode] = useState([])


  const stageRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const trRef = React.useRef(null);
  const text = React.useRef(null);
  const arrow = React.useRef(null);

  useEffect(() => {
    setMode(activeTool);
  }, [activeTool])

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([text.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleAddElementToKonvaByMode = () => {
    setIsSelected(null);
    if(mode === 'text'){
      const option = {
        fill: 'red',
        draggable: true,
        text: 'Default',
        x: 100,
        y: 100,
        fontSize: 30,
        fontStyle: 'bold',
      }
      setTextNode(textNode => [...textNode, option])
    }else if(mode === 'arrow'){
      const option = {
        fill: 'red',
        draggable: true,
        x: 100,
        y: 100,
      }
      setArrowNode(arrowNode => [...arrowNode, option])
    }
  }

  return (
    <Stage ref={stageRef} width={window.innerWidth - 150} height={window.innerHeight - 100} className={`konva-wrap-1 cursor-${activeTool}`} onClick={handleAddElementToKonvaByMode}>
      <Layer ref={layerRef}>
        {files.map((file, index) => <ImageKonva url={file} key={index} />)}
        {textNode.map((option, index) => <Text ref={text} {...option} key={index} onClick={()=> setIsSelected('text')} />)}
        {arrowNode.map((option, index) => <Arrow {...option} key={index} />)}
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default KonvaStage;
