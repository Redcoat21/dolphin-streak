import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
});

const EditorComponent: React.FC = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const onEditorStateChange = (contentState: any) => {
    const newEditorState = EditorState.createWithContent(convertFromRaw(contentState));
    setEditorState(newEditorState);
  };

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
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
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

export default EditorComponent;
