import './App.css';
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd"; //https://www.npmjs.com/package/@tensorflow-models/coco-ssd
import Webcam from "react-webcam";
import { drawRect } from "./utils";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async() => {
    const model = await cocossd.load();
    // Loop detector
    setInterval(() => {
      detector(model);
    }, 10);
  };

  const detector = async(model) => {
    if(
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Input Data Properties
      const vidStream = webcamRef.current.video;
      const streamWidth = webcamRef.current.video.videoWidth;
      const streamHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = streamWidth;
      webcamRef.current.video.height = streamHeight;

      // Set canvas height and width
      canvasRef.current.width = streamWidth;
      canvasRef.current.height = streamHeight;

      // Make Detections
      const obj = await model.detect(vidStream);
      // console.log(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
       <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
