import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import RichTextEditor from "./Components/RichTextEditor";
import { EditorState, convertFromRaw } from "draft-js";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  useEffect(() => {
    const editorData = localStorage.getItem("editorData");
    const actualData = editorData && convertFromRaw(JSON.parse(editorData));
    editorData && setEditorState(EditorState.createWithContent(actualData));
    localStorage.removeItem("editorData");
  }, []);

  return (
    <div className="App">
      <Header editorState={editorState} />
      <RichTextEditor
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
}

export default App;
