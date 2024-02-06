import React from "react";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import "../../node_modules/draft-js/dist/Draft.css";
import { useRef } from "react";

const RichTextEditor = ({ editorState, setEditorState }) => {
  const customStyleMap = {
    red: {
      color: "rgba(255, 0, 0, 1.0)",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
  };

  const editorRef = useRef(null);

  const focus = () => {
    editorRef.current.focus();
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
    const currentSelectionState = editorState.getSelection(); // current caret position
    const caretPositionKey = currentSelectionState.anchorKey; // unique key of line
    const currentContentState = editorState.getCurrentContent(); //map of the entire editor content
    const currentContentBlock = currentContentState.getBlockForKey(
      // get the content block of the current line
      caretPositionKey
    );
    const foundIndex = findSecondNearestWhitespace(currentContentBlock.text);
    const matchContent = currentContentBlock.text.slice(-1 * foundIndex);
    const matchedSelectionState = currentSelectionState.set(
      "anchorOffset",
      currentSelectionState["anchorOffset"] - foundIndex
    );
    if ("# " === matchContent) {
      applyBlockStyle(currentContentState, matchedSelectionState, editorState);
    } else if ("* " === matchContent) {
      applyInlineStyles(
        "BOLD",
        currentContentState,
        matchedSelectionState,
        editorState,
        currentContentBlock
      );
    } else if ("** " === matchContent) {
      applyInlineStyles(
        "red",
        currentContentState,
        matchedSelectionState,
        editorState,
        currentContentBlock
      );
    } else if ("*** " === matchContent) {
      applyInlineStyles(
        "UNDERLINE",
        currentContentState,
        matchedSelectionState,
        editorState,
        currentContentBlock
      );
    }
  };

  const applyInlineStyles = (
    type,
    currentContentState,
    matchedSelectionState,
    editorState,
    currentContentBlock
  ) => {
    const nextContentState = Modifier.replaceText(
      currentContentState,
      matchedSelectionState,
      ""
    );
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );
    nextEditorState =
      currentContentBlock.getType() === "header-one" && type === "BOLD"
        ? RichUtils.toggleBlockType(nextEditorState, "header-one")
        : nextEditorState;
    onChange(RichUtils.toggleInlineStyle(nextEditorState, type));
  };

  const applyBlockStyle = (
    currentContentState,
    matchedSelectionState,
    editorState
  ) => {
    const nextContentState = Modifier.replaceText(
      currentContentState,
      matchedSelectionState,
      ""
    );
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-block-type"
    );
    nextEditorState = RichUtils.toggleBlockType(nextEditorState, "header-one");
    onChange(nextEditorState);
  };
  const findSecondNearestWhitespace = (text) => {
    let lastWhitespaceIndex = -1;
    let secondNearestWhitespaceIndex = -1;

    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] === " ") {
        if (lastWhitespaceIndex === -1) {
          lastWhitespaceIndex = i;
        } else {
          secondNearestWhitespaceIndex = i;
          break;
        }
      }
    }

    if (secondNearestWhitespaceIndex === -1) {
      return text.length;
    } else {
      return text.length - secondNearestWhitespaceIndex - 1;
    }
  };
  return (
    <div className="editor-container" onClick={focus}>
      <Editor 
       
        editorState={editorState}
        onChange={onChange}
        ref={editorRef}
        spellCheck={true}
        customStyleMap={customStyleMap}
        placeholder="Type # and press space for Heading OR type * and press space for bold OR ** and space for red line OR *** and space for underline"
          />
    </div>
  );
};

export default RichTextEditor;
