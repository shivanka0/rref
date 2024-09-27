'use client';
import { useEffect, useRef } from "react";
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';


export default function HomePage() {
  var text = [[1,2],[3,4],[5,6]];
  return (
    <main className="">
      <div className="flex flex-col items-center justify-center p-10 ">
          <h3 className="result-text flex flex-col items-center justify-center p-20 m-10 bg-white">text</h3>
      </div>
    </main>
  );
}