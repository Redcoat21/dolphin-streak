import { BubbleMenu, Editor } from "@tiptap/react";
import { useState } from "react";

interface LinkBubbleMenuProps {
  editor: Editor;
}

export const LinkBubbleMenu: React.FC<LinkBubbleMenuProps> = ({ editor }) => {
  const [url, setUrl] = useState("");

  const handleSetLink = () => {
    if (url) {
      editor.chain().setLink({ href: url }).run();
    }
    setUrl("");
  };

  const handleUnsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <BubbleMenu
      editor={editor}
      className="bubble-menu"
      tippyOptions={{
        duration: 200,
        animation: "shift-toward-subtle",
        moveTransition: "transform 0.2s ease-in-out",
      }}
    >
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        className="bubble-menu-input"
      />
      <button
        type="button"
        className="bubble-menu-button"
        onClick={handleSetLink}
      >
        Set Link
      </button>
      <button
        type="button"
        className="bubble-menu-button"
        onClick={handleUnsetLink}
      >
        Unset Link
      </button>
    </BubbleMenu>
  );
};
