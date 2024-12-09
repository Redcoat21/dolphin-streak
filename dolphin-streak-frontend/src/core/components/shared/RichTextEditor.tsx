import { Editor, EditorContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface RichTextEditorProps {
  editor: Editor | null;
}

export default function RichTextEditor({ editor }: RichTextEditorProps) {
  if (!editor) {
    return null;
  }
  const setLink = () => {
    const url = prompt("Enter the URL") || "";
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const unsetLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const addImage = () => {
    const url = prompt("Enter the image URL") || "";
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: "Image" }).run();
    }
  };

  return (
    <div className="rounded-lg bg-[#1E293B] overflow-hidden">
      <div className="border-b border-[#2D3748] p-2 flex flex-wrap gap-1 overflow-x-auto">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("bold") ? "bg-[#2D3748]" : ""
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("italic") ? "bg-[#2D3748]" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("underline") ? "bg-[#2D3748]" : ""
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#2D3748] mx-1" />
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("heading", { level: 1 }) ? "bg-[#2D3748]" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("heading", { level: 2 }) ? "bg-[#2D3748]" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#2D3748] mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("bulletList") ? "bg-[#2D3748]" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("orderedList") ? "bg-[#2D3748]" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#2D3748] mx-1" />
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive({ textAlign: "left" }) ? "bg-[#2D3748]" : ""
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive({ textAlign: "center" }) ? "bg-[#2D3748]" : ""
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive({ textAlign: "right" }) ? "bg-[#2D3748]" : ""
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (editor.isActive("link")) {
              unsetLink();
            } else {
              setLink();
            }
          }}
          className={`p-2 rounded hover:bg-[#2D3748] transition-colors text-white ${
            editor.isActive("link") ? "bg-[#2D3748]" : ""
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-[#2D3748] transition-colors text-white"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="p-4 prose prose-invert max-w-none focus:outline-none"
      />
    </div>
  );
}
