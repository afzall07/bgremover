import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, ImagePlus, RefreshCcw, Palette, Layers } from "lucide-react";
import svg from "../assets/add.svg";

function Uploads() {
  const location = useLocation();
  const fileFromBgRemove = location.state?.file || null;

  const filePicker = useRef();
  const bgFilePicker = useRef();
  const canvasRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(fileFromBgRemove);
  const [inputImg, setInputImg] = useState(null);
  const [generatedImg, setGeneratedImg] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(false);

  const ApiKey = import.meta.env.VITE_API_KEY;

  // Convert selected file to base64 for preview
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setInputImg(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image_file", selectedFile);

    setIsLoading(true);
    setGeneratedImg(null);
    setBgImage(null);
    setBgColor("#ffffff");

    try {
      const res = await fetch("https://clipdrop-api.co/remove-background/v1", {
        method: "POST",
        headers: { "X-Api-Key": ApiKey },
        body: formData,
      });

      if (!res.ok) throw new Error("API Error");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImg(url);
    } catch (error) {
      console.error("API call failed", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Draw final composed image
  useEffect(() => {
    if (!generatedImg) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const fgImg = new Image();
    fgImg.src = generatedImg;

    fgImg.onload = () => {
      canvas.width = fgImg.width;
      canvas.height = fgImg.height;
      if (bgImage) {
        const bgImg = new Image();
        bgImg.src = bgImage;
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
        };
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
      }
    };
  }, [generatedImg, bgImage, bgColor]);

  const handleInnerImg = () => filePicker.current.click();

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const handleBgFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setBgImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleBgFileInput = (e) => handleBgFile(e.target.files[0]);

  const handleDownload = () => {
    if (!generatedImg) {
      alert("Please remove the background first!");
      return;
    }
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited-bg.png";
    link.click();
  };

  const resetBtn = () => {
    setInputImg(null);
    setGeneratedImg(null);
    setBgImage(null);
    setBgColor("#ffffff");
    setSelectedFile(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen text-blue-500 pb-24">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-4 py-3">
        {/* Import Button */}
        <button
          onClick={handleInnerImg}
          className="flex items-center gap-1 bg-blue-500 hover:bg-[#222a3d] text-white px-3 py-2 rounded-xl text-sm font-medium transition-all"
        >
          <ImagePlus className="w-4 h-4" />
          Import
          <input
            type="file"
            hidden
            ref={filePicker}
            onChange={handleFileInput}
            accept="image/*"
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full px-4 mt-4 gap-5">
        {!generatedImg ? (
          <div
            className="w-full max-w-xs h-80  rounded-3xl flex flex-col items-center justify-center cursor-pointer border-2"
            onClick={handleInnerImg}
          >
            {inputImg ? (
              <img
                src={inputImg}
                alt="Preview"
                className="object-cover rounded-3xl w-full h-full"
              />
            ) : (
              <>
                <img src={svg} alt="" className="w-10 mb-2 opacity-70" />
                <p className="text-sm text-gray-400">Tap to import image</p>
              </>
            )}
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-xs rounded-3xl border-2"
          ></canvas>
        )}
        {!generatedImg && (
          <button
            className="bg-blue-500 text-white px-5 py-2 font-semibold  border-none rounded-2xl text-xl cursor-pointer"
            onClick={handleUpload}
            disabled={isLoading}
          >
            Remove background
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-300">Processing...</p>
        </div>
      )}

      {/* Bottom Toolbar */}
      {generatedImg && !isLoading && (
        <div className="fixed bottom-0 left-0 w-full bg-[#0e1424] border-t border-gray-700 py-3 flex justify-around text-xs text-gray-300 z-10">
          <button
            onClick={handleDownload}
            className="flex flex-col items-center hover:text-blue-400"
          >
            <Download className="w-5 h-5 mb-1" /> Download
          </button>

          <button
            onClick={() => bgFilePicker.current.click()}
            className="flex flex-col items-center hover:text-blue-400"
          >
            <Layers className="w-5 h-5 mb-1" /> Background
            <input
              type="file"
              hidden
              ref={bgFilePicker}
              accept="image/*"
              onChange={handleBgFileInput}
            />
          </button>

          <button
            onClick={resetBtn}
            className="flex flex-col items-center hover:text-blue-400"
          >
            <RefreshCcw className="w-5 h-5 mb-1" /> Reset
          </button>

          <label className="flex flex-col items-center hover:text-blue-400 cursor-pointer">
            <Palette className="w-5 h-5 mb-1" /> Color
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                setBgImage(null);
              }}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default Uploads;
