import React, { useEffect, useState } from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image';

const KonvaImage = ({ option, ...props }) => {
  const [image] = useImage(option.imageUrl);
  const [width, setWidth] = useState(option.width)
  const [height, setHeight] = useState(option.height)

  useEffect(()=>{
    if(width > 300 || height > 300){
      const scaleFactor = Math.min(300 / width, 300 / height);
      setWidth(width * scaleFactor);
      setHeight(height * scaleFactor);
    }
  },[width, height])

  return (
    <>
      <Image
        draggable
        image={image}
        width={width}
        height={height}
        {...props}
      />
    </>
  )
}
export default KonvaImage;
