'use client';
import { useEffect, useRef } from "react";
import Tesseract from 'tesseract.js';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureRef = useRef<HTMLButtonElement>(null);
  const errorMsgRef = useRef<HTMLSpanElement>(null);
  var rref = require('rref');
  useEffect(() => {
    const constraints = {
      audio: false,
      video: {
        width: 640,
        height: 480,
        facingMode: 'environment',
      },
    };

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
      } catch (e) {
        if (errorMsgRef.current) {
          errorMsgRef.current.innerHTML = `navigator.getUserMedia.error:${(e as Error).toString()}`;
        }
      }
    }

    function handleSuccess(stream: MediaStream) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    var text = '';
    // does the magic
    async function recognizeAndSolve() {
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL();
        const result = await Tesseract.recognize(dataUrl, 'eng');
        text = result.data.text;
        // const matrix = parseMatrix(text);
        // const rrefMatrix = rref(matrix);
        console.log(text);
      }
    }

    // TODO: implement parseMatrix
    function parseMatrix(text: string): number[][] {
      // Implement a function to parse the recognized text into a matrix
      // This is a placeholder for the actual parsing logic
      return [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    }

    init();

    if (captureRef.current && canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      captureRef.current.addEventListener('click', async () => {
        if (context && videoRef.current instanceof HTMLVideoElement) {
          context.drawImage(videoRef.current, 0, 0, 640, 480);
          try {
            recognizeAndSolve();
            const resultText = document.getElementsByClassName('result-text');
            if (resultText[0]) {
              (resultText[0] as HTMLElement).innerText = text;
            }
          } catch (error) {
            console.error('Error recognizing and solving:', error);
            if (errorMsgRef.current) {
              errorMsgRef.current.innerHTML = `Error recognizing and solving: ${error}`;
            }
          }
        }
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-row justify-left">
        <div className="flex flex-col justify-left p-10">
            {/* Webcam */}
            <div className="video-wrap">
                <video ref={videoRef} playsInline muted autoPlay></video>
              </div>
              {/* Capture */}
              <div className="controller">
                <button ref={captureRef}>Capture</button>
              </div>
              {/* Canvas */}
              <canvas ref={canvasRef} width="640" height="480"></canvas>
        </div>
        <h3 className="result-text flex flex-col justify-left p-10 bg-white text-black"></h3>
      </div>


      {/* Error Message */}
      <span ref={errorMsgRef}></span>
    </main>
  );
}