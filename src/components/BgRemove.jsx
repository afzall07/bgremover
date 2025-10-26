import React, { useRef, useState, useEffect } from "react";
import "./BgRemove.css";
import withBgImage from "../assets/my-imagebg.png.jpg";
import withoutBgImage from "../assets/my-image.png";
import svg from "../assets/add.svg";
import { useNavigate } from "react-router-dom";

function BgRemove() {
  const filePicker = useRef();
  const [inputImg, setInputImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  // Upload Image Handlers
  const handleInnerImg = () => filePicker.current.click();
  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImg(e.target.result);
      navigate("/uploads", { state: { file } }); // Navigate and pass file
    };
    reader.readAsDataURL(file);
  };
  const handleFileInput = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="main">
      <div className="style1">
        <div className="image">
          <div className="image1">
            <img src={withBgImage} alt="" id="withBgImage" />
          </div>
          <div className="image2">
            <img src={withoutBgImage} alt="" id="withoutBgImage" />
          </div>
        </div>

        <div className="text">
          <h2 className="heading">Remove Image Background</h2>
          <p className="subtext">
            100% Automatically and{" "}
            <span className="bg-blue-500 font-semibold text-white py-1 px-2 rounded-2xl">
              Free
            </span>
          </p>
        </div>
      </div>
      <div className="style2 hidden md:block">
        <div className="upload-container">
          <div
            className={`upload-box ${isDragging ? "drag-active" : ""}`}
            onClick={handleInnerImg}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {inputImg ? (
              <img src={inputImg} alt="Preview" className="uploaded-img" />
            ) : (
              <div className="upload-placeholder">
                <img src={svg} alt="" className="upload-icon" />
                <span>or drop a file</span>
              </div>
            )}
            <input
              type="file"
              hidden
              ref={filePicker}
              onChange={handleFileInput}
            />
          </div>

          <button id="upload-btn" onClick={handleInnerImg}>
            Upload Image
          </button>
        </div>
      </div>
      <button
        id="upload-btn"
        className=" block md:hidden cursor-pointer"
        onClick={handleInnerImg}
      >
        Upload Image
      </button>
    </div>
  );
}

export default BgRemove;
