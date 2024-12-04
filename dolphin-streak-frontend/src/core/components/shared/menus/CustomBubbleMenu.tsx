import { BubbleMenu, Editor } from "@tiptap/react";
// import { NodeTypeDropdown } from "./NodeTypeDropdown";
// import { generalButtons } from "./buttons";

import { NodeTypeDropdown } from "./NodeTypeDropDown";
import { generalButtons } from "./buttons";

interface CustomBubbleMenuProps {
  editor: Editor;
}

export const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
  editor,
}) => {
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
      <NodeTypeDropdown editor={editor} />
      {generalButtons.map((btn) => (
        <button
          type="button"
          className="bubble-menu-button"
          onClick={() => btn.action(editor)}
          key={btn.tooltip}
        >
          <i className={`${btn.iconClass} scale-150`} />
        </button>
      ))}
    </BubbleMenu>
  );
};
