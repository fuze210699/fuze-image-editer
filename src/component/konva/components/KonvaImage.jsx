import React from 'react'
import { Image } from 'react-konva';
import useImage from 'use-image';

const KonvaImage = ({ url }) => {
  const [image] = useImage(url);
  return (
    <>
      <Image
        draggable
        image={image}
      />
    </>
  )
}
export default KonvaImage;
