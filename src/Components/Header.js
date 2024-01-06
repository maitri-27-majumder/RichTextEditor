import { convertToRaw } from "draft-js";
import React from "react";

const Header = ({ editorState }) => {
  const saveData = () => {
    localStorage.setItem("editorData", JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <div className="header-container">
      <div>Demo Editor By Maitri</div>
      <div>
        <button onClick={saveData}>Save</button>
      </div>
    </div>
  );
};

export default Header;
