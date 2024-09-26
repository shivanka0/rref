'use client';
import { useEffect, useRef } from "react";
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';


export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureRef = useRef<HTMLButtonElement>(null);
  const errorMsgRef = useRef<HTMLSpanElement>(null);
  var rref = require('rref');
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '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', dangerouslyAllowBrowser: true
  });
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
    var parsedMatrix = " ";
    // does the magic
    async function recognizeAndSolve() {
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL();
        const result = await Tesseract.recognize(dataUrl, 'eng');
        text = result.data.text;
        const response = await client.chat.completions.create({
          messages: [{ role: 'user', content: 'do the row reduction echolon form of the matrix or vector equation or system of equations or whatever this is: ' + text}],
          model: 'gpt-4o',
        });
        parsedMatrix = response.choices[0]?.message.content ?? '';
        // const rrefMatrix = rref(matrix);
        console.log(parsedMatrix);
      }
    }

    // // TODO: implement parseMatrix
    // function parseMatrix(text: string): number[][] {
    //   // Implement a function to parse the recognized text into a matrix
    //   // This is a placeholder for the actual parsing logic
    //   return [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    // }

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
              (resultText[0] as HTMLElement).innerText = parsedMatrix;
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
    <main className="">
      <div className="flex flex-col items-center justify-center p-10 ">
            {/* Webcam */}
            <div className="video-wrap flex flex-col items-center justify-center">
                <video ref={videoRef} playsInline muted autoPlay></video>
              </div>
              {/* Capture */}
              <div className="controller flex flex-col items-center justify-centers">
                <button className="capture-button bg-white flex flex-col items-center justify-center" ref={captureRef}>Capture</button>
              </div>
              {/* Canvas */}
              <canvas ref={canvasRef} className="flex flex-col items-center justify-center" width="640" height="480"></canvas>
              <h3 className="result-text flex flex-col items-center justify-center p-20 m-10 bg-white"></h3>

      </div>


      {/* Error Message */}
      <span ref={errorMsgRef}></span>
    </main>
  );
}