import React from "react";
import Dropzone from "react-dropzone";
import { FilesImage } from "../../assets/images";

const DropZones = (props) => {
  const handleAcceptedFiles = (files) => {
    props.onDrop(files);
  };

  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className="drop-zone-wrap" {...getRootProps()}>
              <input {...getInputProps()} />
              <img src={FilesImage} className="drop-zone-let-drop-image" />
              <p>Drop to attach files</p>
            </div>
          </section>
        )}
      </Dropzone>
    </>
  );
};

export default DropZones;
