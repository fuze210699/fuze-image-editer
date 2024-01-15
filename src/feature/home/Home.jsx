import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AppDropzone, KonvaStage } from "./components";
import { readFileAsDataURL } from "../../utils/helper";
import "./components/konva/konva.scss";
import KonvaTool from "./components/konva/KonvaTool";

const Home = () => {
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTool, setActiveTool] = useState('');

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

  return (
    <>
      {fileUrls.length ? (
        <>
          <div className="app-konva">
            <div className="konva-tool">
              <KonvaTool activeTool={activeTool} handleActiveTool={(tool) => {
                console.log(tool);
                setActiveTool(tool)}} />
            </div>
            <div className="konva-wrap">
              <KonvaStage activeTool={activeTool} files={fileUrls} />
              <button className="btn-konva-export">
                <img
                  src={require("../../assets/icons/png_icon_medium.png")}
                  alt="icon"
                />
                \<span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
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
