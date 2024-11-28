import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = useCallback((newState) => {
    setEditorState(newState);
  }, []);

  const handleSubmit = () => {
    const contentState = editorState.getCurrentContent();
    const html = draftToHtml(convertToRaw(contentState));
    console.log(html);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Rich Text Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Editor
          editorState={editorState}
          onChange={onEditorStateChange}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "fontFamily",
              "list",
              "textAlign",
              "colorPicker",
              "link",
              "embedded",
              "emoji",
              "history",
            ],
          }}
        />
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
