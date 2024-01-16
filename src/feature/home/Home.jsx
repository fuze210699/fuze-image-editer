import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AppDropzone, KonvaStage, KonvaTool } from "../../component";
import { readFileAsDataURL } from "../../utils/helper";

const Home = () => {
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTool, setActiveTool] = useState('');
  const [isExport, setIsExport] = useState(false);
  const [url, setUrl] = useState('')
  const [isCopy, setIsCopy] = useState(false);

  const handleAcceptedFiles = (files) => {
    files.forEach((file) => {
      readUrlFromFiles(file);
    });
  };

  const readUrlFromFiles = async (file) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      setFileUrls((fileUrls) => [...fileUrls, dataUrl]);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  // const copyFileToClipboard = (file) => {
  //   // Create a new FileReader
  //   const reader = new FileReader();
  //   // Define the onload event for the reader
  //   reader.onload = function (event) {
  //     // Once the file is read, its contents will be available in event.target.result
  //     const dataUrl = event.target.result;

  //     // Create a new <img> element
  //     const img = new Image();

  //     // Set the src attribute of the image to the data URL
  //     img.src = dataUrl;

  //     // Create a new <canvas> element
  //     const canvas = document.createElement('canvas');

  //     // Set the dimensions of the canvas to match the image
  //     canvas.width = img.width;
  //     canvas.height = img.height;

  //     // Get the drawing context of the canvas
  //     const ctx = canvas.getContext('2d');

  //     // Draw the image onto the canvas
  //     ctx.drawImage(img, 0, 0);

  //     // Convert the canvas content to a data URL
  //     const canvasDataUrl = canvas.toDataURL('image/png');

  //     // Create a new <textarea> element to hold the image data URL
  //     const textArea = document.createElement('textarea');
  //     textArea.value = canvasDataUrl;

  //     // Append the textarea to the DOM (it doesn't have to be visible)
  //     document.body.appendChild(textArea);

  //     // Select the contents of the textarea
  //     textArea.select();

  //     // Copy the selected contents to the clipboard
  //     document.execCommand('copy');
  //     console.log('run');
  //     console.log(file);
  //     // Clean up by removing the textarea from the DOM
  //     document.body.removeChild(textArea);
  //   };

  //   // Read the file as a data URL
  //   reader.readAsDataURL(file);
  // }

  async function copyImageToClipboard(file) {
    try {
      // Read the image file as a Blob
      const blob = file.slice(0, file.size, file.type);
      // Create a new ClipboardItem with the image Blob
      const clipboardItem = new ClipboardItem({ [file.type]: blob });

      // Write the ClipboardItem to the clipboard
      await navigator.clipboard.write([clipboardItem]);
      setIsCopy(true);
      setTimeout(() => { setIsCopy(false); setUrl('');setIsExport(false) }, 3000)
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    }
  }

  useEffect(() => {
    if (!!url) {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'image.jpg', { type: 'image/png' });
          copyImageToClipboard(file);
        });
    }
  }, [url]);

  return (
    <>
      {fileUrls.length ? (
        <>
          <div className="app-konva">
            <div className="konva-tool">
              <KonvaTool activeTool={activeTool} handleActiveTool={(tool) => {
                console.log(tool);
                setActiveTool(tool)
              }} />
            </div>
            <div className="konva-wrap">
              <KonvaStage activeTool={activeTool} files={fileUrls} isExport={isExport} setUrl={(url) => setUrl(url)} />
              <button draggable
                className="btn-konva-export" onClick={() => setIsExport(true)}>
                <img
                  src={require("../../assets/icons/png_icon_medium.png")}
                  alt="icon"
                />
                \<span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
              {isCopy && <span style={{ color: 'white', position: 'absolute', bottom: 18, left: '62%' }}>Copied !</span>}
            </div>
          </div>
        </>
      ) : (
        <div className='m-auto px-2 h-full flex-center'>
          <Card className="w-full">
            <CardContent>
              <AppDropzone onDrop={handleAcceptedFiles} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Home;
