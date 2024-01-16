import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AppDropzone, KonvaStage, KonvaTool } from "../../component";
import { readFileAsDataURL } from "../../utils/helper";
import { TrashBinIcon } from "../../assets/icons";
import bootbox from "bootbox";

const Home = () => {
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTool, setActiveTool] = useState("");
  const [isExport, setIsExport] = useState(false);
  const [url, setUrl] = useState("");
  const [isCopy, setIsCopy] = useState(false);

  const handleAcceptedFiles = (files) => {
    files.forEach((file) => {
      readUrlFromFiles(file);
    });
  };

  const readUrlFromFiles = async (file) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      const image= new Image();
      image.onload = () => {
        const imageOption ={
          id: `image${Date.now()}`,
          width: image.width,
          height: image.height,
          imageUrl: dataUrl
        }
      setFileUrls((fileUrls) => [...fileUrls, imageOption]);
      }
      image.src = dataUrl;

    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  async function copyImageToClipboard(file) {
    try {
      // Read the image file as a Blob
      const blob = file.slice(0, file.size, file.type);
      // Create a new ClipboardItem with the image Blob
      const clipboardItem = new ClipboardItem({ [file.type]: blob });

      // Write the ClipboardItem to the clipboard
      await navigator.clipboard.write([clipboardItem]);
      setIsCopy(true);
      setTimeout(() => {
        setIsCopy(false);
        setUrl("");
        setIsExport(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
    }
  }

  useEffect(() => {
    if (!!url) {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "image.jpg", { type: "image/png" });
          copyImageToClipboard(file);
        });
    }
  }, [url]);

  const handleDiscardStage = () => {
    bootbox.confirm({
      title: "Delete This Note Permanently",
      message: "This cannot be undone.",
      closeButton: false,
      buttons: {
        confirm: {
          label: "Delete",
          className: "btn-success",
        },
        cancel: {
          label: "Cancel",
          className: "btn-danger",
        },
      },
      callback: function (result) {
        if (!result) {
          return;
        }
        setFileUrls([])
      },
    });
  };

  return (
    <>
      {fileUrls.length ? (
        <>
          <div className="app-konva">
            <div className="konva-tool">
              <KonvaTool
                activeTool={activeTool}
                handleActiveTool={(tool) => {
                  setActiveTool(tool);
                }}
              />
            </div>
            <div className="konva-wrap">
              <KonvaStage
                activeTool={activeTool}
                files={fileUrls}
                isExport={isExport}
                setUrl={(url) => setUrl(url)}
              />
              <button
                className="btn-konva-export"
                onClick={() => setIsExport(true)}
              >
                <img
                  src={require("../../assets/icons/png_icon_medium.png")}
                  alt="icon"
                />
                \<span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
              {isCopy && (
                <span
                  style={{
                    color: "white",
                    position: "absolute",
                    bottom: 18,
                    left: "58%",
                  }}
                >
                  Copied !
                </span>
              )}
              <img
                src={TrashBinIcon}
                alt="tool_icon"
                style={{
                  position: "absolute",
                  right: 50,
                  top: 15,
                  cursor: "pointer",
                }}
                onClick={handleDiscardStage}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="m-auto px-2 h-full flex-center">
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
