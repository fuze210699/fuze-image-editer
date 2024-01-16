import React, { useRef } from "react";
import { Text, Transformer } from "react-konva";

const KonvaText = ({
  shapeProps,
  stageRef,
  isSelected,
  setIsSelected,
  changeAttribute,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDbClick = () => {
    const textNode = shapeRef.current;
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    // create textarea and style it
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.background= "transparent";
    textarea.style.color= "red";
    textarea.style.fontSize= '30px';
    textarea.style.resize= 'none';
    textarea.style.border= '0px';
    textarea.style.outline= 'none';
    textarea.style.width = textNode.width() || 100;

    textNode.visible(false);
    textNode.getLayer().batchDraw();
    setIsSelected(null);
    textarea.focus();

    textarea.addEventListener("keydown", function (e) {
      // hide on enter
      if (e.keyCode === 13) {
        textNode.text(textarea.value);
        document.body.removeChild(textarea);
        textNode.visible(true);
        textNode.getLayer().batchDraw();
        setIsSelected(shapeProps.id);
        changeAttribute({key:'text', value: textarea.value, id:shapeProps.id  })
      }
    });
  };

  return (
    <>
      <Text
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });

        }}
        ondblclick = { handleDbClick }
      />
      {isSelected && (
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
      )}
    </>
  );
};

export default KonvaText;
