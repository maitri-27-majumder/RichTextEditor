import { convertToRaw } from "draft-js";
import React from "react";

const Header = ({ editorState }) => {
  const saveData = () => {
    localStorage.setItem("editorData", JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <div className="header-container">
      <div><h2>Text Editor by Maitri</h2></div>
      <div className="button-container">
        <button onClick={saveData}>Save</button>
      </div>
    </div>
  );
};

export default Header;
