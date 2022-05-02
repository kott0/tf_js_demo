// import logo from './logo.svg';
import './App.css';

import React, {useRef, useEffect} from 'react';
// import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import Webcam from "react-webcam";
import {drawMesh} from "./utils";

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFaceMask = async() => {
    const net = await faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    setInterval(()=>{
      faceDetection(net)
    },100)
  };

  // Face detection - if detected, display mesh
  const faceDetection = async(net) => {
    if(
      webcamRef.current !== null &&
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current.video.readyState === 4
    ) {
        const vidStream = webcamRef.current.video;
        const vidWidth = webcamRef.current.video.vidWidth;
        const vidHeight = webcamRef.current.video.vidHeight;

        webcamRef.current.video.width = vidWidth;
        webcamRef.current.video.height = vidHeight;

        canvasRef.current.width = vidWidth;
        canvasRef.current.height = vidHeight;

        const face = await net.estimateFaces({input:vidStream});
        console.log(face);

        const ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  };

  useEffect(()=>{runFaceMask()}, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam 
          ref = {webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlgin: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />

        <canvas
            ref = {canvasRef}
            style = {{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlgin: "center",
              zIndex: 9,
              width: 640,
              height: 480
            }}
          />
      </header>
    </div>
  );
}

export default App;
