'use client';
import { useEffect, useRef } from "react";
import Tesseract from 'tesseract.js';
import Link from "next/link";

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

    // does the magic
    async function recognizeAndSolve() {
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL();
        const result = await Tesseract.recognize(dataUrl, 'eng');
        const text = result.data.text;
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
      captureRef.current.addEventListener('click', () => {
        if (context && videoRef.current) {
          context.drawImage(videoRef.current, 0, 0, 640, 480);
          recognizeAndSolve();
        }
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
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
      {/* Error Message */}
      <span ref={errorMsgRef}></span>
    </main>
  );
}