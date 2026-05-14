'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Heading1,
  Heading2
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-border bg-muted/20">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>
      
      <div className="w-px h-6 bg-border mx-1 self-center" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Add Link"
      >
        <LinkIcon size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('code') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
        title="Code"
      >
        <Code size={18} />
      </button>

      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg hover:bg-muted text-foreground disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg hover:bg-muted text-foreground disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  )
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: 'tight',
        bulletListMarker: '-',
        linkify: true,
        breaks: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer font-bold',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Tulis isi konten di sini...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // If content looks like raw markdown (starts with #, -, etc.), let's keep it as MD
      // But for compatibility with existing renderers, HTML is safer.
      // tiptap-markdown handles the conversion.
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[400px] p-5 sm:p-8 max-w-none text-foreground',
      },
    },
    immediatelyRender: false,
  })

  return (
    <div className="w-full rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
