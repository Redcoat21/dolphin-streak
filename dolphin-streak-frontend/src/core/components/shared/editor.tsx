import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditorContent } from "@tiptap/react";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough as StrikeIcon,
  Code as CodeIcon,
  List as BulletListIcon,
  ListOrdered as NumberedListIcon,
  Highlighter as HighlightIcon,
  Underline as UnderlineIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
} from "lucide-react";

interface ICustomRichTextEditorProps {
  editor: Editor | null;
  className?: string;
}

export function CustomRichTextEditor({
  editor,
  className,
}: ICustomRichTextEditorProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rounded-lg", className)}>
      <div className="border-b border-[#0E1747] p-2 flex flex-wrap gap-2 ">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") && "bg-muted")}
        >
          <BoldIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") && "bg-muted")}
        >
          <ItalicIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(editor.isActive("strike") && "bg-muted")}
        >
          <StrikeIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(editor.isActive("codeBlock") && "bg-muted")}
        >
          <CodeIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive("bulletList") && "bg-muted")}
        >
          <BulletListIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive("orderedList") && "bg-muted")}
        >
          <NumberedListIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={cn(editor.isActive("highlight") && "bg-muted")}
        >
          <HighlightIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive("underline") && "bg-muted")}
        >
          <UnderlineIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(editor.isActive("textAlign", "left") && "bg-muted")}
        >
          <AlignLeftIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(editor.isActive("textAlign", "center") && "bg-muted")}
        >
          <AlignCenterIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(editor.isActive("textAlign", "right") && "bg-muted")}
        >
          <AlignRightIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={cn(editor.isActive("textAlign", "justify") && "bg-muted")}
        >
          <AlignJustifyIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={cn(editor.isActive("superscript") && "bg-muted")}
        >
          <SuperscriptIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={cn(editor.isActive("subscript") && "bg-muted")}
        >
          <SubscriptIcon />
        </Button>
      </div>
      <div className="p-4 min-h-[200px] prose prose-sm max-w-none prose-invert">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
